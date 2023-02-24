import { getAuth, updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { db } from '../Firebase';
import {HiHome} from 'react-icons/hi';
import { Link } from 'react-router-dom';

export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  // GET DATA OF LOGGED IN USER
  const [inputs, setInputs] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  });
  const {name, email} = inputs;
  //  EDIT DETAILSSSSSSSS
  const [checkEditStatus, setCheckEditStatus] = useState(false);
  //INPUT ON CHANGE
  const onChange = (e) => {
    setInputs((prevState) => ({
      ...prevState, 
      [e.target.id]: e.target.value
    }))
  };
  //CHANGE USER NAME ON SUBMIT
  const onSubmit = async () => {
    try {
      if(auth.currentUser.displayName !== name){
        // UPDATE NAME IN FIREBASE AUTHENTICATION
        await updateProfile(auth.currentUser, {
          displayName: name
        })
        // UPDATE NAME IN FIREBASE FIRESTORE ALSO
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name: name
        });
        toast.success("Name has been updated successfully");
      }else{
        toast.error("You haven't changed the name");
      }
    } catch (error) {
      toast.error("Could not update your profile");
    }
  };

  // LOGGED OUT ON CLICK
  const loggedOut = () => {
    auth.signOut();
    navigate("/sign-in");
  }
  return (
    <>
    <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
      <h1 className='uppercase text-center text-3xl mt-6 font-bold underline'>My Profile</h1>
      <div className='w-full md:w-[50%] mt-6 px-3'>
        <form>
          {/* INPUT NAME */}
          <input type="text" name="name" id="name" value={name} disabled={!checkEditStatus} onChange={onChange} className={`w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${checkEditStatus && "bg-red-200 focus:bg-red-200"}`}/>

          {/* INPUT EMAIL */}
          <input type="text" name="email" id="email" value={email} disabled className='mt-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out'/>

          <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg mt-6'>
            <p className='flex items-center'>Do you want to change your name?
              <span onClick={() => {
                checkEditStatus && onSubmit();
                setCheckEditStatus(!checkEditStatus);
              }} className='text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-1 cursor-pointer'>
                {checkEditStatus ? "Apply Change" : "Edit"}
              </span>
            </p>
            <p onClick={loggedOut} className='text-blue-600 hover:blue-red-800 transition duration-200 ease-in-out cursor-pointer'>Sign Out</p>
          </div>
        </form>
        <button type='submit' className='mt-6 w-full bg-blue-600 text-white uppercase px-7 py-3 font-medium text-sm rounded shadow-md hover:bg-blue-700 active:bg-blue-800 hover:shadow-lg transition duration-150 ease-in-out'>
          <Link to="/create-listing" className='flex items-center justify-center'>
            <HiHome className='mr-2 text-3xl rounded-full bg-red-200 p-1 border-2' />
              Sell or rent your home
          </Link>
        </button>
      </div>
    </section>
    </>
  )
}
