import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Offers from "./Pages/Offers";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import ForgetPassword from "./Pages/ForgetPassword";
import Profile from "./Pages/Profile";
import CreateListing from "./Pages/CreateListing";
import Header from "./Components/Header";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import PrivateRouteForProfileAndListing from "./Components/PrivateRouteForProfileAndListing";
import PrivateRouteForSignIn from "./Components/PrivateRouteForSignIn";
import EditListing from "./Pages/EditListing";
import Listing from "./Pages/Listing";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/offers" element={<Offers />} />
          {/* IT WILL TAKE THE PRIVATE ROUTE ON HITTING SIGN IN URL BUT AT PRIVATE ROUTE IT WILL CHECK LOGGED IN CONDITION IF IT IS FALSE IT WILL RENDER OUTLET WHICH MEANS SIGN IN COMPONENT BCS IT IS TAKING PROFILE COMPONENT */}
          <Route path="/sign-in" element={<PrivateRouteForSignIn />}>
            <Route path="/sign-in" element={<SignIn />} />
          </Route>
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          {/* IT WILL TAKE THE PRIVATE ROUTE ON HITTING PROFILE URL BUT AT PRIVATE ROUTE IT WILL CHECK LOGGED IN CONDITION IF IT IS TRUE IT WILL RENDER OUTLET WHICH MEANS PROFILE COMPONENT BCS IT IS TAKING PROFILE COMPONENT */}
          <Route path="/profile" element={<PrivateRouteForProfileAndListing />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/create-listing" element={<PrivateRouteForProfileAndListing />}>
            <Route path="/create-listing" element={<CreateListing />} />
          </Route>
          <Route path="/edit-listing/:id" element={<PrivateRouteForProfileAndListing />}>
            <Route path="/edit-listing/:id" element={<EditListing />} />
          </Route>
          <Route path="/category/:categoryName/:listingId" element={<Listing />} />
        </Routes>
      </Router>
      {/* TO GENERATE TOAST */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;
