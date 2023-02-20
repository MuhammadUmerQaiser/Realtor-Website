import React, { useState } from 'react'
import AuthenticationImage from '../Components/AuthenticationImage'
import {AiFillEye, AiFillEyeInvisible} from 'react-icons/ai';
import { Link } from 'react-router-dom';
import OAuth from '../Components/OAuth';

export default function ForgetPassword() {
  const [email, setEmail] = useState("")

  //onchange set input data
  const onChange = (e) => {
    setEmail(e.target.value)
  }
  return (
    <section>
      <h1 className='uppercase text-center text-3xl mt-6 font-bold underline'>Forgot Password</h1>
      <div className='flex justify-center items-center flex-wrap px-6 py-12 max-w-6xl mx-auto'>
        <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
          <AuthenticationImage />
        </div>
        <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
          <form>
            <input type="email" name="email" id="email" value={email} placeholder='Email Address' className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out mb-6' onChange={onChange}/>
            {/* BUTTONS */}
            <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg'>
              <p className='mb-6'>Already have an account? 
                <Link to="/sign-in" className='text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-1'> Sign In</Link>
              </p>
              <p>
                <Link to="/sign-in" className='text-blue-600 hover:text-blue-700 transition duration-200 ease-in-out'>Sign In</Link>
              </p>
            </div>
            {/* SIGN IN BUTTON */}
            <button className='uppercase  w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800'>Send Reset Password</button>
            {/* OR LINE */}
            <div className='flex items-center my-4 before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300'>
              <p className='uppercase text-center mx-4 font-semibold'>OR</p>
            </div>
            {/* GOOGLE SIGN IN BUTTON */}
            <OAuth />
          </form>
          
        </div>
      </div>
    </section>
  )
}
