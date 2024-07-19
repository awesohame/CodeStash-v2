import { NextResponse } from "next/server";
import { getLogos } from 'favicons-scraper'

export async function POST(req: Request) {
    try {
        const { url } = await req.json();
        const favicon = await getLogos(url);
        // console.log(favicon[0]?.src);
        // favicon.map((f) => console.log(f.type));
        return new NextResponse(favicon[0]?.src, { status: 200 });
    } catch (err) {
        console.log(err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}