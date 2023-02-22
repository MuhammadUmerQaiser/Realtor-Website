import React from 'react'
import { Navigate, Outlet } from 'react-router';
import {useAuthStatus}  from '../Hooks/useAuthStatus';
import Spinner from './Spinner';

export default function PrivateRouteForSignIn() {
    const {loggedIn, checkingStatus} = useAuthStatus();
    if(checkingStatus){
        return <Spinner />;
    }
    return loggedIn ? <Navigate to="/profile" /> : <Outlet /> 
}
