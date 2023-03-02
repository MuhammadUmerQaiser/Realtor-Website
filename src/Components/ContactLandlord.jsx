import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { db } from "../Firebase";

export default function ContactLandlord({ userRef, listing }) {
  const [landlord, setLandLord] = useState(null);
  const [message, setMessage] = useState();
  //load the user data which we are contacting
  useEffect(() => {
    const getLandlordData = async () => {
      const docRef = doc(db, "users", userRef);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLandLord(docSnap.data());
      } else {
        toast.error("Could not load the data");
      }
    };
    getLandlordData();
  }, [userRef]);
  return (
    <>
      {landlord !== null && (
        <div className="flex flex-col w-full">
          <p className="font-semibold">
            Contact {landlord.name} for the {listing.name.toLowerCase()}
          </p>
          <div>
            <textarea
              name="message"
              id="message"
              rows="2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mt-6 mb-6"
            ></textarea>
          </div>
          <a href={`mailto:${landlord.email}?Subject=${listing.name}&body=${message}`}>
            <button type="button" className="px-7 py-3 bg-blue-600 text-white rounded text-sm uppercase shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full text-center">Send Message</button>
          </a>
        </div>
      )}
    </>
  );
}
