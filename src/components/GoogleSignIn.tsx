import React from 'react'
import { useRouter } from 'next/navigation';

import { FaGoogle } from "react-icons/fa";

import { Button } from "@/components/ui/button"

import { auth, db, googleProvider } from '@/config/firebase'
import { signInWithPopup } from "firebase/auth"
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore'

const GoogleSignIn = ({
    form,
    setShowUsernameDialog
}: {
    form: any,
    setShowUsernameDialog: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const router = useRouter();

    async function signInWithGoogle() {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const email = user.email ?? '';

            const userRef = doc(db, 'users', email);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
                await setDoc(doc(db, 'users', email), {
                    firstName: user.displayName?.split(" ")[0] ?? 'User',
                    lastName: user.displayName?.split(" ")[1] ?? '',
                    username: '',
                });
            } else {
                await updateDoc(userRef, {
                    firstName: user.displayName?.split(" ")[0] ?? 'User',
                    lastName: user.displayName?.split(" ")[1] ?? '',
                });
            }

            const newUserDoc = await getDoc(userRef);
            const userData = newUserDoc.data();

            if (userData && userData.username == '') {
                setShowUsernameDialog(true);
            } else {
                form.reset();
                console.log('User signed in with Google successfully');
                router.push(`/${userData?.username}`);
            }

            form.reset();
        } catch (error) {
            console.error(error);
        }
    }



    return (
        <div className='px-6'>
            <div className="my-4 border-t border-light-2 mx-4"></div>
            <Button onClick={signInWithGoogle} className="w-full bg-dark-5 hover:bg-dark-4">
                <FaGoogle className="mx-4 text-light-2" />
                Sign In with Google
            </Button>
        </div>
    )
}

export default GoogleSignIn