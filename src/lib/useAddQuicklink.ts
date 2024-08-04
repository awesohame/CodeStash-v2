import { doc, setDoc, getDocs, query, collection, where, getDoc } from 'firebase/firestore';
import { db, auth } from '@/config/firebase';


// create a custom hook to add a quicklink
const useAddQuicklink = (label: string, link: string, iconImg: File) => {
    const addQuicklink = async () => {
        try {
            const user = auth.currentUser;
            if (!user) return;

            // check if the quicklink already exists
            const quicklinkRef = collection(db, 'quicklinks');
            const quicklinkQuery = query(quicklinkRef, where('label', '==', label), where('link', '==', link));
            const quicklinkDocs = await getDocs(quicklinkQuery);

            if (!quicklinkDocs.empty) {
                console.log('Quicklink already exists');
                return;
            }

            // add the quicklink
            const quicklinkDoc = doc(quicklinkRef);
            await setDoc(quicklinkDoc, {
                label,
                link,
                iconImg: '',
                user: user.uid,
            });

            console.log('Quicklink added');
        } catch (error) {
            console.error("Error adding quicklink:", error);
        }
    }
};