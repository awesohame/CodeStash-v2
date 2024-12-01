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

export async function searchStashes(
  query: string, 
  userEmail: string, 
  searchIndex: string = 'desc'
): Promise<Stash[]> {
  const cacheKey = `search:${userEmail}:${query}:${searchIndex}`;
    // Commented out Redis caching for now
    // const redis = await getRedisClient();
    // const cachedResults = await redis.get(cacheKey);
    // if (cachedResults) {
    //   return JSON.parse(cachedResults);
    // }

  
  try {
    const mongoDb = await connectToDatabase();
    const embeddingsCollection = mongoDb.collection('stashEmbeddings');

    const queryEmbedding = await getEmbedding(query);

    // Determine which index to use based on searchIndex
    const indexPath = searchIndex === 'sections' 
      ? 'sectionsEmbedding' 
      : 'descEmbedding';

    const results = await embeddingsCollection.aggregate([
      {
        "$vectorSearch": {
          "index": "stash_vsearch_index",
          "path": indexPath,
          "queryVector": queryEmbedding,
          "numCandidates": 100,
          "limit": 5
        }
      },
      {
        $match: { userEmail }
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

    // sort stashes based on the order of results from MongoDB
    const sortedStashes = stashIds.map(id => stashes.find(stash => stash.id === id)).filter(Boolean) as Stash[];

    return sortedStashes;
  } catch (error) {
    console.error('Error in searchStashes:', error);
    throw new Error('Search operation failed');
  }
}