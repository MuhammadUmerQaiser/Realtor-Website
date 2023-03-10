import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const [pageStateOnAuthCheck, setPageStateOnAuthCheck] = useState("Sign In");
    const auth = getAuth();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if(user){
                setPageStateOnAuthCheck("Profile");
            }else{
                setPageStateOnAuthCheck("Sign In");
            }
        })
    }, [auth]);

    const matchLocationPath = (router) => {
        if(router === location.pathname){
            return true;
        }
    }
  return (
    <div className='bg-white border-b shadow-sm static top-0 z-40'>
        <header className='flex justify-between items-center px-5 max-w-6xl mx-auto'>
            <div>
                <img src='https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg' alt='Logo'
                className='h-6 cursor-pointer' onClick={() => navigate('/')} />
            </div>
            <div>
                <ul className='flex space-x-11'>
                    <li className={`cursor-pointer py-4 text-sm font-semibold text-gray-500 border-b-[3px] border-b-transparent ${matchLocationPath("/") && "text-black border-b-red-600"}`} onClick={() => navigate('/')}>Home</li>
                    <li className={`cursor-pointer py-4 text-sm font-semibold text-gray-500 border-b-[3px] border-b-transparent ${matchLocationPath("/offers") && "text-black border-b-red-600"}`} onClick={() => navigate('/offers')}>Offers</li>
                    <li className={`cursor-pointer py-4 text-sm font-semibold text-gray-500 border-b-[3px] border-b-transparent ${(matchLocationPath("/sign-in") || matchLocationPath("/profile")) && "text-black border-b-red-600"}`} onClick={() => navigate('/profile')}>
                        {/* THIS NAVIGATE PROFILE MEANS IT REDIRECTS TO PRFILE PAGE BUT IF USER IS NOT AUTHENTICATED IT REDIRECTS TO SIGN-IN PAGE AS WE MADE THE PRIVATE ROUTE */}
                        {pageStateOnAuthCheck}
                    </li>
                </ul>
            </div>
        </header>
    </div>
  )
}
