import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Offers from "./Pages/Offers";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import ForgetPassword from "./Pages/ForgetPassword";
import Profile from "./Pages/Profile";
import Header from "./Components/Header";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from "./Components/PrivateRoute";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          {/* IT WILL TAKE THE PRIVATE ROUTE ON HITTING PROFILE URL BUT AT PRIVATE ROUTE IT WILL CHECK LOGGED IN CONDITION IF IT IS TRUE IT WILL RENDER OUTLET WHICH MEANS PROFILE COMPONENT BCS IT IS TAKING PROFILE COMPONENT */}
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
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
