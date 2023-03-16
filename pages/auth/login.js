import React, { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";

export default function login(){
    const route = useRouter();
    const [user, loading] = useAuthState(auth);

    // Sign in with google
    const googleProvider = new GoogleAuthProvider();
    const googleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            route.push("/")
        } catch (error) {
            console.log(error)
        }
    }

    // Side effects
    useEffect(() => {
        if(user){
            route.push('/')
        } else {
            console.log("You're logged out.")
        }
    }, [user])

    return (
        <div className="shadow-xl mt-32 p-10 text-gray-700 rounded-lg">
            <h2 className="text-2xl font-medium">Join Today</h2>
            <div className="py-4">
                <h3 className="py-4">Sign in with one of the providers.</h3>
                <button onClick={googleLogin} className="text-white bg-gray-700 w-full font-medium rounded-lg flex align-middle p-4 gap-2">
                  <FcGoogle className="text-2xl" />
                  Sign in with google
                </button>
            </div>
        </div>
    )
}