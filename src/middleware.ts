import { NextRequest, NextResponse } from "next/server"
import axios from "axios"

import { initAdmin } from "./config/firebaseAdmin"
import { getFirestore } from "firebase-admin/firestore"

export function middleware(req: NextRequest) {
    if (req.nextUrl.pathname === '/') {
        return NextResponse.next()
    }

    // breaks down literally because it's not implemented by next.js yet
    // firebase-admin doesnt work in middlewares (webpack issue)

    // await initAdmin()
    // const firestore = getFirestore()
    // const docs = await firestore.collection('users').get()
    // docs.forEach(doc => {
    //     console.log(doc.id, '=>', doc.data())
    // })

    return NextResponse.next()
}

export const config = {
    matcher: '/:path*',
}