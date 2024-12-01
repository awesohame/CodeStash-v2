import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/server/mongodb';
import { getEmbedding } from '@/lib/vectorSearch';
import { StashSection } from '@/constants/types';

export async function POST(req: NextRequest) {
  try {
    const { userEmail, stash } = await req.json();
    const mongoDb = await connectToDatabase();
    const embeddingsCollection = mongoDb.collection('stashEmbeddings');

    const descEmbedding = await getEmbedding(stash.desc);
    
    // Combine all section contents into a single string
    const allSectionsContent = stash.stashSections
      .map((section: StashSection) => section.content)
      .join(' ');

    // Create a single embedding for all sections
    const sectionsEmbedding = await getEmbedding(allSectionsContent);

    await embeddingsCollection.insertOne({
      stashId: stash.id,
      userEmail,
      descEmbedding,
      sectionsEmbedding
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating stash embeddings:', error);
    return NextResponse.json({ success: false, error: 'Error creating stash' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userEmail, id, stashUpdate } = await req.json();
    const mongoDb = await connectToDatabase();
    const embeddingsCollection = mongoDb.collection('stashEmbeddings');

    const updateObj: any = {};
    if (stashUpdate.desc) {
      updateObj.descEmbedding = await getEmbedding(stashUpdate.desc);
    }
    
    if (stashUpdate.stashSections) {
      // Combine all section contents into a single string
      const allSectionsContent = stashUpdate.stashSections
        .map((section: StashSection) => section.content)
        .join(' ');

      // Create a single embedding for all sections
      updateObj.sectionsEmbedding = await getEmbedding(allSectionsContent);
    }

    await embeddingsCollection.updateOne({ stashId: id, userEmail }, { $set: updateObj });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating stash embeddings:', error);
    return NextResponse.json({ success: false, error: 'Error updating stash' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get('userEmail');
    const id = searchParams.get('id');

    const mongoDb = await connectToDatabase();
    const embeddingsCollection = mongoDb.collection('stashEmbeddings');
    await embeddingsCollection.deleteOne({ stashId: id, userEmail });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting stash embeddings:', error);
    return NextResponse.json({ success: false, error: 'Error deleting stash' }, { status: 500 });
  }
}