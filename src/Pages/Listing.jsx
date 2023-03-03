import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../Components/Spinner";
import { db } from "../Firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from "swiper";
import "swiper/css/bundle";
import { BsClipboardCheck } from "react-icons/bs";
import { FaMapMarkerAlt, FaBed, FaBath, FaChair } from "react-icons/fa";
import { RiParkingFill } from "react-icons/ri";
import { getAuth } from "firebase/auth";
import ContactLandlord from "../Components/ContactLandlord";
import { Marker, Popup, TileLayer, MapContainer } from "react-leaflet";

export default function Listing() {
  const auth = getAuth();
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [contactLandlord, setContactLandlord] = useState(false);
  SwiperCore.use([Autoplay, Navigation, Pagination]);
  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    }
    fetchListing();
  }, [params.listingId]);

  //copy link on share button click
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareLinkCopied(true);
    setTimeout(() => {
      //show text for only 3sec
      setShareLinkCopied(false);
    }, 1200);
  };

  //load spinner
  if (loading) {
    return <Spinner />;
  }
  return (
    <main>
      {/* SWIPER SLIDER */}
      <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        modules={[EffectFade]}
        autoplay={{ delay: 3000 }}
      >
        {listing.imageURLs.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full overflow-hidden h-[300px]"
              style={{
                background: `url(${listing.imageURLs[index]}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* LINK SHARE ICON */}
      <div
        className="fixed top-[13%] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400 rounded-full w-12 h-12 flex justify-center items-center"
        onClick={copyLink}
      >
        <BsClipboardCheck className="text-lg text-slate-600" />
      </div>
      {/* when link copied show text for 3 sec when state is true */}
      {shareLinkCopied && (
        <p className="fixed top-[23%] right-[5%] font-semibold border-2 border-gray-500 rounded-full bg-white z-10 p-2">
          Link Copied
        </p>
      )}
      {/* DESCRIPTION */}
      <div className="m-4 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg shadow-lg bg-white lg:space-x-5">
        <div className="w-full">
          {/* name and price */}
          <p className="text-2xl font-bold mb-3 text-blue-900">
            {listing.name} - $
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrices
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" ? "/month" : ""}
          </p>
          {/* address */}
          <p className="flex items-center mt-6 mb-3 font-semibold">
            <FaMapMarkerAlt className="text-green-700 mr-2" />
            {listing.address}
          </p>
          {/* rent/sale and discount */}
          <div className="flex justify-start items-center space-x-4 w-[75%]">
            <p className="bg-red-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md">
              {listing.type === "rent" ? "For Rent" : "For Sale"}
            </p>
            {listing.offer && (
              <p className="bg-green-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md">
                ${listing.regularPrices - listing.discountedPrice}
              </p>
            )}
          </div>
          {/* description */}
          <p className="mt-3 mb-3">
            <span className="font-semibold">Description - </span>
            {listing.description}
          </p>
          {/* beds, baths, furnished and parking */}
          <ul className="flex items-center space-x-2 sm:space-x-10 text-sm font-semibold mb-6">
            <li className="flex items-center whitespace-nowrap">
              <FaBed className="text-lg mr-2" />
              {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaBath className="text-lg mr-2" />
              {listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <RiParkingFill className="text-lg mr-2" />
              {listing.parking ? "Parking Spot" : "No Parking"}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaChair className="text-lg mr-2" />
              {listing.furnished ? "Furnished" : "Not Furnished"}
            </li>
          </ul>
          {/* BUTTON */}
          {listing.userRef !== auth.currentUser?.uid && !contactLandlord && (
            <div className="mt-6">
              <button
                className="px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg w-full text-center transition duration-150 ease-in-out"
                onClick={() => setContactLandlord(!contactLandlord)}
              >
                Contact Landlord
              </button>
            </div>
          )}
          {/* show form on button click */}
          {contactLandlord && (
            <ContactLandlord userRef={listing.userRef} listing={listing} />
          )}
        </div>
        {/* MAP */}
        <div className="w-full h-[200px] md:h-[400px] z-10 overflow-x-hidden mt-6 md:mt-0 md:ml-2">
          <MapContainer
            center={[
              listing.geoLocation.latitude,
              listing.geoLocation.longitude,
            ]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[
                listing.geoLocation.latitude,
                -listing.geoLocation.longitude,
              ]}
            >
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </main>
  );
}
