import { connectToDatabase } from './server/mongodb';
import { getRedisClient } from './server/redis';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Stash } from '@/constants/types';
import { db } from "@/config/firebase";
import { collection, getDocs, query as que, where, documentId } from "firebase/firestore";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY as string);

export async function getEmbedding(text: string): Promise<number[]> {
    const model = genAI.getGenerativeModel({ model: "embedding-001" });
    const result = await model.embedContent(text);
    const embedding = result.embedding;
    return Array.from(embedding.values);
}

export async function searchStashes(query: string, userEmail: string): Promise<Stash[]> {
  const cacheKey = `search:${userEmail}:${query}`;
  
  try {
    // Commented out Redis caching for now
    // const redis = await getRedisClient();
    // const cachedResults = await redis.get(cacheKey);
    // if (cachedResults) {
    //   return JSON.parse(cachedResults);
    // }

    const mongoDb = await connectToDatabase();
    const embeddingsCollection = mongoDb.collection('stashEmbeddings');

    const queryEmbedding = await getEmbedding(query);

    const results = await embeddingsCollection.aggregate([
      {
        $search: {
          index: 'default',
          compound: {
            should: [
              {
                knnBeta: {
                  vector: queryEmbedding,
                  path: 'descEmbedding',
                  k: 10
                }
              },
              {
                knnBeta: {
                  vector: queryEmbedding,
                  path: 'sectionEmbeddings',
                  k: 10
                }
              },
              {
                text: {
                  query: query,
                  path: ['title', 'desc'],
                  fuzzy: {}
                }
              }
            ]
          }
        }
      },
      {
        $match: { userEmail }
      },
      {
        $limit: 20
      },
      {
        $project: {
          _id: 0,
          stashId: 1,
          score: { $meta: 'searchScore' }
        }
      }
    ]).toArray();

    // Fetch full stash data from Firestore
    const stashIds = results.map(result => result.stashId);
    const userStashesCollection = collection(db, "stashes", userEmail, "userStashes");
    const q = que(userStashesCollection, where(documentId(), 'in', stashIds));
    const querySnapshot = await getDocs(q);

    const stashes = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    } as Stash));

    // Sort stashes based on the order of results from MongoDB
    const sortedStashes = stashIds.map(id => stashes.find(stash => stash.id === id)).filter(Boolean) as Stash[];

    // Commented out Redis caching for now
    // await redis.set(cacheKey, JSON.stringify(sortedStashes), 'EX', 3600);
    return sortedStashes;
  } catch (error) {
    console.error('Error in searchStashes:', error);
    throw new Error('Search operation failed');
  }
}