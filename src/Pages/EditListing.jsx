import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../Components/Spinner";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router";
import { db } from "../Firebase";

export default function EditListing() {
  const params = useParams();
  const navigate = useNavigate();
  const auth = getAuth();
  const [geoLocationEnabled, setGeoLocationEnabled] = useState(false); //THIS WILL TELL THE LONGITUDE AND LATUDE OF ADDRESS IF PERSON HAS A BANK CARD
  const [loading, setLoading] = useState(false); //IF LOADING IS TRUE SHOW THE SPINNER COMPONENT
  const [listings, setListings] = useState(null);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: true,
    regularPrices: 50,
    discountedPrice: 0,
    latitude: 0,
    longitude: 0,
    images: {},
  });
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    description,
    offer,
    regularPrices,
    discountedPrice,
    latitude,
    longitude,
    images,
  } = formData;
  const onChange = (e) => {
    // BOOLEAN CHECK THE FORMS FOR TRUE/FALSE
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    //FOR IMAGES, IF FILES EXIST STORE THE FILE IN IMAGES
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }
    //EXCEPT FOR IMAGES
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value, //IF BOOLEAN IS NULL IT MEANS ASSSIGN THE ID TO VALUE LIKE TYPE TO RENT/SELL BUT IF BOOLEAN IS TRUE/FALSE THEN IT IS BUTTON AND IT ASSIGNS TRUE/FALSE TO IT'S ID
      }));
    }
  };

  // FETCH USER LISTING
  useEffect(() => {
    setLoading(true);
    const fetchUserListing = async () => {
      const docRef = doc(db, "listings", params.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListings(docSnap.data());
        setFormData({
          ...docSnap.data(),
        });
        setLoading(false);
      } else {
        navigate("/profile");
        toast.error("Listing does not exist");
      }
    };
    fetchUserListing();
  }, []);

  // CHECK ONLY THAT USER CAN UPDATE WHICH CREATED THE LISTING
  useEffect(() => {
    if (listings && listings.userRef !== auth.currentUser.uid) {
      navigate("/");
      toast.error("You are not authenticated to update the listing");
    }
  }, [auth.currentUser.uid, navigate, listings]);

  // SUBMIT THE FORM ON CLICK
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // IF THERE IS OFFER THEN IT CHECKS THE DISCOUNTED PRICE MUST BE LESS THAN REGULAR PRICE
    if (+discountedPrice >= +regularPrices) {
      //+ SIGN WILL CONVERT IT INTO INTEGER
      setLoading(false);
      toast.error("Discounted Price must be less than the Regular Price");
      return;
    }
    //IF IMAGE IS GREATER THAN 6 FILES THEN IT MUST SHOW ERROR
    if (images.length > 6) {
      setLoading(false);
      toast.error("Files must be less than 6");
      return;
    }
    //FOR GEOLOCATION
    const geoLocation = {};
    const location = null; //THIS WILL BE USED WHEN GEOLOCATION IS TRUE OTHERWISE IT HAS NO USE
    if (geoLocationEnabled) {
      //code
      // IF IT IS TRUE THE GOOGLE WILL PROVIDE API KEY WHICH IS PROVIDED ON BANK STATEMENT.
      // AND THAT API WILL HELP YOU TO GET THE CO-ORDINATES OF LOCATION (ADDRESS) WITHOUT ENTERING LATITUDE OR LONGITUDE
    } else {
      geoLocation.latitude = latitude;
      geoLocation.longitude = longitude;
    }

    //STORE IMAGE FUNCTION TO RETURN THE URLS OF IMAGE
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        //RESOLVE FOR SUCCESS AND REJECT FOR ERROR
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`; //UNIQUE IMAGE NAME
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);
        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    // UPLOAD THE IMAGE AND GET THE URL OF FIREABSE STORAGE OF THAT IMAGE
    const imageURLs = await Promise.all(
      //PROMISE JUST HELP IN RETURNING DATA CORRECTLY
      [...images].map((image) => storeImage(image)) //[...images] IT SPREAD THE IMAGE AND MAP THE IMAGES ONE BY ONE TO STOREIMAGE FUNCTION
    ).catch((error) => {
      setLoading(false);
      console.log(error);
      toast.error("Image is not uploaded");
      return;
    });

    //NOW ADD THE LISTING TO FIREABSE FIRESTORE
    //CREATE THE COPY OF FORMDATA WHICH HELPS WHICH THINGS WE WANT TO STORE
    const formDataCopy = {
      ...formData, //GET ALL VALUES OF FORMDATA
      imageURLs,
      geoLocation,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };
    //DELETE SOMETHING FROM OUR FORMDATA COPY BCS WE DONT STORE EVERYTHING IN DATABASE
    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountedPrice; //IF THERE IS NO OFFER THEN DELETE DISCOUNTED PRICE
    //WE STORE LATITUDE AND LONGITUDE IN GEOLOCATION
    delete formDataCopy.latitude;
    delete formDataCopy.longitude;

    console.log(formDataCopy);
    const docRef = doc(db, "listings", params.id);
    await updateDoc(docRef, formDataCopy);
    setLoading(false);
    toast.success("Listing is updated");
    navigate(`/profile`);
  };

  //SHOW SPINNER ON LOADING TRUE
  if (loading) {
    return <Spinner />;
  }

  //updated the latitude and longitude bcs it is coming from geolocation
  formData.latitude = listings?.geoLocation?.latitude;
  formData.longitude = listings?.geoLocation?.longitude;
  return (
    <main className="max-w-md px-2 mx-auto">
      <h1 className="uppercase text-center text-3xl mt-6 font-bold underline">
        Edit your Listing
      </h1>
      {/* FORM  */}
      <form>
        {/* SELL OR RENT BUTTON */}
        <div>
          <p className="text-lg mt-6 font-semibold">Sell / Rent</p>
          <div className="flex mt-3">
            <button
              type="button"
              id="type"
              value="sell"
              onClick={onChange}
              className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                type === "rent"
                  ? "bg-white text-black"
                  : "bg-slate-600 text-white"
              }`}
            >
              Sell
            </button>
            <button
              type="button"
              id="type"
              value="rent"
              onClick={onChange}
              className={`ml-3  type="button"px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                type === "sell"
                  ? "bg-white text-black"
                  : "bg-slate-600 text-white"
              }`}
            >
              Rent
            </button>
          </div>
        </div>
        {/* NAME INPUT */}
        <div>
          <p className="text-lg mt-6 font-semibold">Name</p>
          <div className="flex mt-3">
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Name"
              required
              maxLength="32"
              minLength="10"
              value={name}
              onChange={onChange}
              className="w-full px-4 py-2 text-xl rounded transition duration-150 ease-in-out text-gray-700 border bg-white border-gray-300 focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
            />
          </div>
        </div>
        {/* BEDS AND BATHROOMS */}
        <div className="flex space-x-6">
          <div>
            <p className="text-lg font-semibold">Beds</p>
            <input
              type="number"
              name="bedrooms"
              id="bedrooms"
              required
              maxLength="50"
              minLength="1"
              value={bedrooms}
              onChange={onChange}
              className="w-full px-4 py-2 text-xl rounded transition duration-150 ease-in-out text-gray-700 border bg-white border-gray-300 focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center mb-6"
            />
          </div>
          <div>
            <p className="text-lg font-semibold">Baths</p>
            <input
              type="number"
              name="bathrooms"
              id="bathrooms"
              required
              maxLength="50"
              minLength="1"
              value={bathrooms}
              onChange={onChange}
              className="w-full px-4 py-2 text-xl rounded transition duration-150 ease-in-out text-gray-700 border bg-white border-gray-300 focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center mb-6"
            />
          </div>
        </div>
        {/* PARKING SPOT */}
        <div>
          <p className="text-lg font-semibold">Parking Spot</p>
          <div className="flex mt-3">
            <button
              type="button"
              id="parking"
              value={true}
              onClick={onChange}
              className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                !parking ? "bg-white text-black" : "bg-slate-600 text-white"
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              id="parking"
              value={false}
              onClick={onChange}
              className={`ml-3  type="button"px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                parking ? "bg-white text-black" : "bg-slate-600 text-white"
              }`}
            >
              No
            </button>
          </div>
        </div>
        {/* FURNISHED */}
        <div>
          <p className="text-lg mt-6 font-semibold">Furnished</p>
          <div className="flex mt-3">
            <button
              type="button"
              id="furnished"
              value={true}
              onClick={onChange}
              className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                !furnished ? "bg-white text-black" : "bg-slate-600 text-white"
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              id="furnished"
              value={false}
              onClick={onChange}
              className={`ml-3  type="button"px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                furnished ? "bg-white text-black" : "bg-slate-600 text-white"
              }`}
            >
              No
            </button>
          </div>
        </div>
        {/* ADDRESS TEXTAREA */}
        <div>
          <p className="text-lg mt-6 font-semibold">Address</p>
          <div className="flex mt-3">
            <textarea
              name="address"
              id="address"
              placeholder="Address"
              required
              value={address}
              onChange={onChange}
              className="w-full px-4 py-2 text-xl rounded transition duration-150 ease-in-out text-gray-700 border bg-white border-gray-300 focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
            />
          </div>
          {!geoLocationEnabled && (
            <div className="flex space-x-6">
              <div>
                <p className="text-lg font-semibold">Latitude</p>
                <input
                  type="number"
                  name="latitude"
                  id="latitude"
                  required
                  maxLength="90"
                  minLength="-90"
                  value={latitude}
                  onChange={onChange}
                  className="w-full px-4 py-2 text-xl rounded transition duration-150 ease-in-out text-gray-700 border bg-white border-gray-300 focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center mb-6"
                />
              </div>
              <div>
                <p className="text-lg font-semibold">Longitude</p>
                <input
                  type="number"
                  name="longitude"
                  id="longitude"
                  required
                  maxLength="180"
                  minLength="-180"
                  value={longitude}
                  onChange={onChange}
                  className="w-full px-4 py-2 text-xl rounded transition duration-150 ease-in-out text-gray-700 border bg-white border-gray-300 focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center mb-6"
                />
              </div>
            </div>
          )}
        </div>
        {/* DESCRIPTION TEXTAREA */}
        <div>
          <p className="text-lg font-semibold">Description</p>
          <div className="flex mt-3">
            <textarea
              name="description"
              id="description"
              placeholder="Description"
              required
              value={description}
              onChange={onChange}
              className="w-full px-4 py-2 text-xl rounded transition duration-150 ease-in-out text-gray-700 border bg-white border-gray-300 focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
            />
          </div>
        </div>
        {/* PARKING SPOT */}
        <div>
          <p className="text-lg font-semibold">Offer</p>
          <div className="flex mt-3 mb-6">
            <button
              type="button"
              id="offer"
              value={true}
              onClick={onChange}
              className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                !offer ? "bg-white text-black" : "bg-slate-600 text-white"
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              id="offer"
              value={false}
              onClick={onChange}
              className={`ml-3  type="button"px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                offer ? "bg-white text-black" : "bg-slate-600 text-white"
              }`}
            >
              No
            </button>
          </div>
        </div>
        {/* REGULAR PRICES */}
        <div className="flex mb-6 items-center">
          <div>
            <p className="text-lg font-semibold">Regular Prices</p>
            <div className="flex w-full justify-center items-center space-x-6">
              <input
                type="number"
                name="regularPrices"
                id="regularPrices"
                required
                maxLength="4000000"
                minLength="50"
                value={regularPrices}
                onChange={onChange}
                className="w-full px-4 py-2 text-xl rounded transition duration-150 ease-in-out text-gray-700 border bg-white border-gray-300 focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
              />
              {/* IF TYPE RENT SHOW $/MONTH */}
              {type === "rent" && (
                <div>
                  <p className="text-md w-full whitespace-nowrap">$ / Month</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* DISCOUNTED PRICE */}
        {/* IF OFFER IS TRUE SHOW DISCOUNTED PRICES INPUT */}
        {offer && (
          <div className="flex mb-6 items-center">
            <div>
              <p className="text-lg font-semibold">Discounted Prices</p>
              <div className="flex w-full justify-center items-center space-x-6">
                <input
                  type="number"
                  name="regularPrices"
                  id="discountedPrice"
                  required={offer}
                  maxLength="4000000"
                  minLength="50"
                  value={discountedPrice}
                  onChange={onChange}
                  className="w-full px-4 py-2 text-xl rounded transition duration-150 ease-in-out text-gray-700 border bg-white border-gray-300 focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
                />
                {/* IF TYPE RENT SHOW $/MONTH */}
                {type === "rent" && (
                  <div>
                    <p className="text-md w-full whitespace-nowrap">
                      $ / Month
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* IMAGES */}
        <div className="mb-6">
          <p className="text-lg font-semibold">Images</p>
          <p className="font-medium text-gray-600 uppercase">
            The first image will be the cover (max 6 Files)
          </p>
          <input
            type="file"
            name="images"
            id="images"
            required
            multiple
            accept=".jpeg, .png, jpg"
            onChange={onChange}
            className="mt-1 w-full px-3 py-1.5 rounded transition duration-150 ease-in-out text-gray-700 border bg-white border-gray-300 focus:text-gray-700 focus:bg-white focus:border-slate-600"
          />
        </div>
        {/* BUTTON */}
        <button
          className="mb-6 uppercase w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm rounded shadow-sm hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          onClick={onSubmit}
        >
          Edit Listing
        </button>
      </form>
    </main>
  );
}
