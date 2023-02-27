import { getAuth, updateProfile } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { db } from '../Firebase';
import {HiHome} from 'react-icons/hi';
import { Link } from 'react-router-dom';
import ListingItem from '../Components/ListingItem';

export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  //users listing
  const [userListing, setUserListing] = useState("");
  //loading effect
  const [loading, setLoading] = useState(true);
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

  // SHOW USERS LISTING USINH USE EFFECT
  useEffect(() => {
    const fetchUserListings = async () => {
      const listingRef = collection(db, "listings");
      const dataQuery = query(listingRef, where("userRef", "==", auth.currentUser.uid), orderBy("timestamp", "desc")); //query through which data filters
      const docSnap = await getDocs(dataQuery); //get all the data according to query
      let listings = [];
      docSnap.forEach((doc) => {    
        return listings.push({
          id: doc.id,
          data: doc.data()
        });
      });
      setUserListing(listings);
      console.log(listings)
      setLoading(false);
    }
    fetchUserListings();
    console.log(userListing);
  }, [auth.currentUser.uid]);
  
  // ON DELETE FUNCTION
  const onDelete = async (listingId) => {
    if(window.confirm("Are you sure you want to delete?")){
      // this will delete the listing from collection
      await deleteDoc(doc(db, "listings", listingId));
      // now update the listing from userListing constant so it can update the page
      const updateListings = userListing.filter(
        (listing) => listing.id !== listingId //check listing which is not available in object
      );
      setUserListing(updateListings); //update the userListing
      toast.success("Successfully deleted the listing");
    }else{
      toast.error("Cannot delete the listing");
    }
  }

  // ON EDIT FUNCTION
  const onEdit = (listingId) => {
    navigate(`/edit-listing/${listingId}`);
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
    <div className='max-w-6xl px-3 mt-6 mx-auto'>
      {/* {userListing} */}
      {
        //if loading is false and if there is listing then show the listing to users
        !loading && userListing.length > 0 && (
          <>
            <h2 className='font-semibold text-center text-2xl'>My Listings</h2>
            <ul className='sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl-grid-cols-5 mt-6 mb-6'>
              {
                userListing.map((listing) => {
                  return (
                    <ListingItem key={listing.id} listing={listing.data} id={listing.id} 
                    onDelete={() => onDelete(listing.id)} onEdit={() => onEdit(listing.id)} />
                  )
                })
              }
            </ul>
          </>
        )
      }
    </div>
    </>
  )
}
