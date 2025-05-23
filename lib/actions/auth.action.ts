'use server'

import { getFirestore } from "firebase-admin/firestore";
import {db, auth} from "@/firebase/admin";
import {cookies} from "next/headers";

/* session duration for 1 week*/
const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;

    try {
        const userRecord = await db.collection('users').doc(uid).get();

        if (userRecord.exists) {
            return {
                success: false,
                message: "User already exists! Please sign in instead.",
            }
        }

        await db.collection('user').doc(uid).set({
            name, email
        })

        return {
            success: true,
            message: "Account created successfully. Please sign in.",
        }
    } catch (e:any) {
        console.error("Error creating a user", e);

        if(e.code === 'auth/email-already-exists') {
            return {
                success: false,
                message: 'This email is already in use'
            }
        }

        return {
            success: false,
            message: "Failed to create an account, please try again.",
        }
    }
}

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;

    try {
        const userRecord = await auth.getUserByEmail(email);

        if (!userRecord){
            return {
                success: false,
                message: "User does not exist. Create an account instead."
            }
        }

        await setSessionCookie(idToken);

    } catch (e) {
        console.log("checking error here: ");
        console.log(e);

        return {
            success: false,
            message: "Failed to log into an account",
        }
    }
}

export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK * 1000,
    });

    cookieStore.set('session', sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax'
    })
}

export async function getCurrentUser(): Promise<User | null>  {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get('session')?.value;
    console.log('Session Cookie值:', sessionCookie); //use this one to debug to check if we have the right cookie

    if(!sessionCookie) {
        console.log('Session Cookie not found at this stage');
        return null;
    }

    try {
        console.log('start to check the session cookie...');
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        console.log('解码后的claims:', {
            uid: decodedClaims.uid,
            email: decodedClaims.email,
            exp: new Date(decodedClaims.exp * 1000).toISOString()
        });

        //这里开始检查在firebase里面的db的集合，用于检查路径：
        const db = getFirestore();

        // 列出所有集合的正确方式
                async function listAllCollections() {
                    const collections = await db.listCollections();
                    console.log('所有顶级集合:');
                    collections.forEach(collection => {
                        console.log(`- ${collection.id}`);
                    });
                }

        // 调用这个函数查看集合
                await listAllCollections();
        //检查结束。

        const userRecord = await db
            .collection('user')    //这里需要同步firebase的路径！！！！！！user NOT users
            .doc(decodedClaims.uid)
            .get();

        if (!userRecord.exists) {
            console.log('用户记录不存在，UID:', decodedClaims.uid);
            return null;
        };

        console.log('成功获取用户记录');
        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User;
    } catch (error) {
        console.log(error);
        console.error('验证cookie时出错:', error);
        // invalid or expired seesion:
        return null;
    }
}

export async function isAuthenticated() {
    const user = await getCurrentUser();

    return !!user;
}