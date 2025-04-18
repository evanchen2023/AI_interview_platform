"use client" //nextJS, as long as we use some client set of
// functionality like button, input and form, will have to use it

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Image from 'next/image'

import { Button } from "@/components/ui/button"
import {
    Form
} from "@/components/ui/form"
import Link from 'next/link'
import {toast} from "sonner"; /*new version of error message pop up from the windows.*/
import FormField from "@/components/FormField";
import {useRouter} from "next/navigation";
import {auth} from "@/firebase/client";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "firebase/auth";    //we need to remove the "@", because we need the function from the library.
import {
    signIn,
    signUp
} from "@/lib/actions/auth.action";



//create a new function here: Use schema to format the input from the users.
const authFormSchema = (type: FormType) => {
    return z.object({
        name: type === 'sign-up' ? z.string().min(3) : z.string().optional(),
        email: z.string().email(),
        password: z.string().min(3),

    })
}



const AuthForm = ({ type } : { type: FormType }) => {
    const router = useRouter();
    const formSchema = authFormSchema(type);

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {

        try {
            if(type === 'sign-up') {
                const { name, email, password } = values;

                const userCredentials = await createUserWithEmailAndPassword(auth, email, password);

                const result = await signUp({
                    uid: userCredentials.user.uid,
                    name: name!,
                    email,
                    password,
                })

                if(!result.success) {
                    toast.error(result.message);
                    return;
                }

                toast.success('Account created successfully. Please sign in.');
                router.push("/sign-in");
            } else {
                const { email, password } = values;

                const userCredentials = await signInWithEmailAndPassword(auth, email, password);

                const idToken = await userCredentials.user.getIdToken();

                if(!idToken) {
                    console.log("something going on here!!!!!debuging at sign in page!")
                    toast.error('Sign in failed');
                    return;
                }

                await signIn({
                    email, idToken
                })

                toast.success('Sign in successfully.');
                router.push("/");
            }
        } catch (error) {
            console.log(error);
            toast.error(`There was an error: ${error}`);
        }
    }

    const isSignIn = type === "sign-in"; //用于判断是否处于注册页面，如果是的话，就显示不一样的输入标题。

    return (
        <div className="card-border lg:min-w-[566px]">
            <div className="flex flex-col gap-6 card py-14 px-10">
                <div className="flex flex-row gap-2 justify-center">
                    <Image
                        src="/logo.svg"
                        alt="logo"
                        height={32}
                        width={38}
                    />
                    <h2 className="text-primary-100">PrepWise</h2>
                </div>

                <h3>Practice job interview with AI </h3>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
                        {!isSignIn && (
                            <FormField
                                control={form.control}
                                name="name"
                                label="Name"
                                placeholder="Your name"/>
                            )}
                        <FormField
                            control={form.control}
                            name="email"
                            label="Email"
                            placeholder="Your email address!"
                            type="email"/>

                        <FormField
                            control={form.control}
                            name="password"
                            label="Password"
                            placeholder="enter your password"
                            type="password"/>


                        <Button className="btn" type="submit">{isSignIn ? 'Sign in' : 'Create an Account'}</Button>
                    </form>
                </Form>
                <p className="text-center">
                    {isSignIn ? 'No account yet?' : 'Have an account already?'}
                    <Link
                        href={!isSignIn ? '/sign-in' : '/sign-up'}
                        className="font-bold text-user-primary ml-1"
                        prefetch={false} // Add this
                        onClick={(e) => e.stopPropagation()} // Prevent event bubbling
                    >
                        {!isSignIn ? 'Sign in' : 'Sign up'}
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default AuthForm;