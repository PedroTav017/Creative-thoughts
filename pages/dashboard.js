import React, { useEffect, useState } from "react"
import { auth, db } from "../utils/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { useRouter } from "next/router"
import { collection, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore"
import Message from "@/components/Message"
import { BsTrash2Fill } from "react-icons/bs"
import { AiFillEdit } from "react-icons/ai"
import Link from "next/link"

const Dashboard = () => {
    const route = useRouter();
    const [user, loading] = useAuthState(auth);
    const [posts, setPosts] = useState([])

    // See if user is logged
    const getData = async () => {
        if(loading) return;
        if(!user) return route.push('/auth/login');
        const collectionRef = collection(db, 'posts');
        const q = query(collectionRef, where('user', '==', user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setPosts(snapshot.docs.map(doc => ({...doc.data(), id: doc.id })))
        });
        return unsubscribe;
    }

    // Delete Post
    const deletePost = async (id) => {
        const docRef = doc(db, "posts", id)
        await deleteDoc(docRef)
    } 

    // Get users data
    useEffect(() => {
        getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, loading])

    return (
       <div>
        <h1>Your posts</h1>
        <div>
            {posts.map(post => <Message {...post} key={post.id}>
                <div className="flex gap-4">
                    <button onClick={() => deletePost(post.id)} className="text-pink-600 flex items-center justify-center gap-2 py-2 text-sm">
                        <BsTrash2Fill className="text-2xl" />Delete
                    </button>
                    <Link href={{pathname: '/post', query: post}}>
                       <button className="text-teal-600 flex items-center justify-center gap-2 py-2 text-sm">
                          <AiFillEdit className="text-2xl" />Edit
                       </button>
                    </Link>

                </div>
            </Message>)}
        </div>
        <button className="font-medium text-white bg-gray-800 py-2 px-4 my-6" onClick={() => auth.signOut()}>Sign out</button>
       </div> 
    )
}

export default Dashboard