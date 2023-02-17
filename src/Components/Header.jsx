import React from 'react'
import { useLocation, useNavigate } from 'react-router'

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();

    const matchLocationPath = (router) => {
        if(router === location.pathname){
            return true;
        }
    }
  return (
    <div className='bg-white border-b shadow-sm static top-0 z-50'>
        <header className='flex justify-between items-center px-5 max-w-6xl mx-auto'>
            <div>
                <img src='https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg' alt='Logo'
                className='h-6 cursor-pointer' onClick={() => navigate('/')} />
            </div>
            <div>
                <ul className='flex space-x-11'>
                    <li className={`cursor-pointer py-4 text-sm font-semibold text-gray-500 border-b-[3px] border-b-transparent ${matchLocationPath("/") && "text-black border-b-red-500"}`} onClick={() => navigate('/')}>Home</li>
                    <li className={`cursor-pointer py-4 text-sm font-semibold text-gray-500 border-b-[3px] border-b-transparent ${matchLocationPath("/offers") && "text-black border-b-red-500"}`} onClick={() => navigate('/offers')}>Offers</li>
                    <li className={`cursor-pointer py-4 text-sm font-semibold text-gray-500 border-b-[3px] border-b-transparent ${matchLocationPath("/sign-in") && "text-black border-b-red-500"}`} onClick={() => navigate('/sign-in')}>Sign In</li>
                </ul>
            </div>
        </header>
    </div>
  )
}
