import React, { useState } from 'react'
import AuthenticationImage from '../Components/AuthenticationImage'
import {AiFillEye, AiFillEyeInvisible} from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../Components/OAuth';
import { createUserWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth";
import {db} from "../Firebase";
import { toast } from 'react-toastify';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

export default function SignUp() {
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: ""
  });
  const {name, email, password} = inputs;
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  //onchange set input data
  const onChange = (e) => {
    setInputs((previousState) => ({
      ...previousState, [e.target.id]: e.target.value
    }))
  }

  //On submit form store data
  const onSubmit = async (e) => {
    e.preventDefault();
    try{
      //CREATE THE USER ON AUTHENTICATION
      const auth = getAuth();
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredentials.user;

      // ADD NAME FIELD
      updateProfile(auth.currentUser, {
        displayName: name
      })

      // DELETE THE PASSWORD BCS WE WONT STORE PASSWORD IN OUR COLLECTION
      const inputsCopy = {...inputs}; //ADD ALL FIELD IN INPUTSCOPY
      delete inputsCopy.password; // DELETE PASSWORD
      inputsCopy.timemstamp = serverTimestamp() //ADD TIMESTAMP

      await setDoc(doc(db, "users", user.uid), inputsCopy); //call setdoc method to store data on firestore database. doc takes three argumenst ... 1) dabatabase (db), 2)Collection  Name, 3)User Id and after that we gives our input so it can store in database with collection "Users"
      toast.success(name + " has been registered successfully");
      navigate("/")
    }catch(error){
      toast.error("Something went wrong with registration")
    }
  }
  return (
    <section>
      <h1 className='uppercase text-center text-3xl mt-6 font-bold underline'>Sign Up</h1>
      <div className='flex justify-center items-center flex-wrap px-6 py-12 max-w-6xl mx-auto'>
        <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
          <AuthenticationImage />
        </div>
        <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
          <form onSubmit={onSubmit}>
            <input type="text" name="name" id="name" value={name} placeholder='Full Name' className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out mb-6' onChange={onChange}/>
            <input type="email" name="email" id="email" value={email} placeholder='Email Address' className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out mb-6' onChange={onChange}/>
            <div className='relative'>
              {/* ONCLICK EYE CHANGE PASSWORD TO TEXT */}
              <input type={showPassword ? 'text' : 'password'} name="password" id="password" placeholder='Password' value={password} className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out mb-6' onChange={onChange}/>
              {/* PASSWORD EYE */}
              {showPassword ? <AiFillEye className='absolute right-3 top-3 text-xl cursor-pointer' onClick={() => setShowPassword(false)} /> : <AiFillEyeInvisible className='absolute right-3 top-3 text-xl cursor-pointer' onClick={() => setShowPassword(true)} />}
            </div>
            {/* BUTTONS */}
            <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg'>
              <p className='mb-6'>Already have an account? 
                <Link to="/sign-in" className='text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-1'> Sign In</Link>
              </p>
              <p>
                <Link to="/forget-password" className='text-blue-600 hover:text-blue-700 transition duration-200 ease-in-out'>Forget Password?</Link>
              </p>
            </div>
            {/* SIGN IN BUTTON */}
            <button className='uppercase  w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800'>Sign Up</button>
            {/* OR LINE */}
            <div className='flex items-center my-4 before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300'>
              <p className='uppercase text-center mx-4 font-semibold'>OR</p>
            </div>
            {/* GOOGLE SIGN IN BUTTON */}
          </form>
          <OAuth />
          
        </div>
      </div>
    </section>
  )
}
