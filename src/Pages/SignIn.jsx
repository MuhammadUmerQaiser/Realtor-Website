import React, { useState } from 'react'
import AuthenticationImage from '../Components/AuthenticationImage'
import {AiFillEye, AiFillEyeInvisible} from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../Components/OAuth';
import { toast } from 'react-toastify';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default function SignIn() {
  const [inputs, setInputs] = useState({
    email: "",
    password: ""
  });
  const {email, password} = inputs;
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  //onchange set input data
  const onChange = (e) => {
    setInputs((previousState) => ({
      ...previousState, [e.target.id]: e.target.value
    }))
  }
  
  //sign in on submitting
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      if(userCredentials.user){
        toast.success("Logged in successfully");
        navigate("/");
      }else{
        toast.error("User is not registered");
      }
    } catch (error) {
      toast.error("Invalid Arguments");
    }
  }
  return (
    <section>
      <h1 className='uppercase text-center text-3xl mt-6 font-bold underline'>Sign In</h1>
      <div className='flex justify-center items-center flex-wrap px-6 py-12 max-w-6xl mx-auto'>
        <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
          <AuthenticationImage />
        </div>
        <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
          <form onSubmit={onSubmit}>
            <input type="email" name="email" id="email" value={email} placeholder='Email Address' className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out mb-6' onChange={onChange}/>
            <div className='relative'>
              {/* ONCLICK EYE CHANGE PASSWORD TO TEXT */}
              <input type={showPassword ? 'text' : 'password'} name="password" id="password" placeholder='Password' value={password} className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out mb-6' onChange={onChange}/>
              {/* PASSWORD EYE */}
              {showPassword ? <AiFillEye className='absolute right-3 top-3 text-xl cursor-pointer' onClick={() => setShowPassword(false)} /> : <AiFillEyeInvisible className='absolute right-3 top-3 text-xl cursor-pointer' onClick={() => setShowPassword(true)} />}
            </div>
            {/* BUTTONS */}
            <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg'>
              <p className='mb-6'>Don't have an account? 
                <Link to="/sign-up" className='text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-1'> Regsiter</Link>
              </p>
              <p>
                <Link to="/forget-password" className='text-blue-600 hover:text-blue-700 transition duration-200 ease-in-out'>Forget Password?</Link>
              </p>
            </div>
            {/* SIGN IN BUTTON */}
            <button className='uppercase  w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800'>Sign In</button>
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
