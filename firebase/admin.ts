import { initializeApp, getApps, cert} from "firebase-admin/app";
import {getAuth} from "firebase-admin/auth";
import {getFirestore} from "firebase-admin/firestore";


const initFirebaseAdmin = () => {
    const apps = getApps();  /*这里的getApps是为了避免重复初始化，后续的if也是检验是否已有*/

    if(!apps.length) {
        /*这里可以加入try and catch来处理错误，防止初始化失败*/
        initializeApp({
            credential: cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g,"\n"),
            })
        });
    }

    return {
        auth: getAuth(),
        db: getFirestore()
    }
}

export const { auth, db } = initFirebaseAdmin();