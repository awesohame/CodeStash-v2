import { NextRequest, NextResponse } from 'next/server';
import { searchStashes } from '@/lib/vectorSearch';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');
    const userEmail = searchParams.get('userEmail');

    if (!query || !userEmail) {
      return NextResponse.json({ error: 'Missing query or userEmail' }, { status: 400 });
    }

    const results = await searchStashes(query, userEmail);
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: 'Error searching stashes' }, { status: 500 });
  }
}