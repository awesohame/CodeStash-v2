import { NextResponse } from "next/server";
import { getLogos } from 'favicons-scraper';
import fetch from 'node-fetch';

export async function POST(req: Request) {
    try {
        const { url } = await req.json();
        const favicons = await getLogos(url);
        
        // Prefer .ico or smallest icon
        const preferredFavicon = favicons.find(f => f.type === 'ico') || favicons[0];
        
        if (!preferredFavicon) {
            return new NextResponse('', { status: 404 });
        }

        const faviconResponse = await fetch(preferredFavicon.src);
        if (!faviconResponse.ok) {
            return new NextResponse('', { status: faviconResponse.status });
        }

        const faviconBuffer = await faviconResponse.arrayBuffer();
        return new NextResponse(faviconBuffer, {
            status: 200,
            headers: {
                'Content-Type': preferredFavicon.mime || 'image/png',
                'Content-Length': faviconBuffer.byteLength.toString(),
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (err) {
        return new NextResponse('', { 
            status: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'text/plain'
            }
        });
    }
}
