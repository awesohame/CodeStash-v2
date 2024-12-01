import { NextRequest, NextResponse } from 'next/server';
import { searchStashes } from '@/lib/vectorSearch';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');
    const userEmail = searchParams.get('userEmail');
    const searchIndex = searchParams.get('searchIndex') || 'desc'; // default desc search

    if (!query || !userEmail) {
      return NextResponse.json({ error: 'Missing query or userEmail' }, { status: 400 });
    }

    const results = await searchStashes(query, userEmail, searchIndex);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error searching stashes:', error);
    return NextResponse.json({ error: 'Error searching stashes' }, { status: 500 });
  }
}