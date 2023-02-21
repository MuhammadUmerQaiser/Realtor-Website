import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import React from 'react'
import {FcGoogle} from 'react-icons/fc';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import {db} from "../Firebase";

export default function OAuth() {
  const navigate = useNavigate();
  const registerUserWithGoogle = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider(); // get the provider
      const userCredentials = await signInWithPopup(auth, provider); //open the google popup window to authenticate
      const user = userCredentials.user; //get user all details
      //get the data from user which is signed through google
      const inputs = {
        name: user.displayName,
        email: user.email,
        timestamp: serverTimestamp()
      };

      //chech if user already registered
      const docRef = doc(db, "users", user.uid); //get data of this user from collection "Users"
      const docSnap = await getDoc(docRef); //Count the data using getDoc
      
      if(!docSnap.exists()){
        await setDoc(docRef, inputs); //setDoc add the data in database by taking inputs and collection
        toast.success(user.displayName + " has been registered successfully");
      }
      navigate("/");
    } catch (error) {
      toast.error("Something went wrong");
    }
  }
  return (
    <button type='button' onClick={registerUserWithGoogle} className='flex items-center justify-center w-full bg-red-700 text-white px-7 py-3 uppercase text-sm font-medium hover:bg-red-800 active:bg-red-900 shadow-md  hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out rounded'>
      <FcGoogle className='text-2xl bg-white rounded-full mr-2' />
      Continue With Google
    </button>
  )
}
