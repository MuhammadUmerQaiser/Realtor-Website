import React, { useEffect, useState } from "react";
import HomeSlider from "../Components/HomeSlider";
import { db } from "../Firebase";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import ListingItem from "../Components/ListingItem";

export default function Home() {
  const [offersListing, setOfferListing] = useState(null); //get those listing which has offer
  const [rentsListing, setRentListing] = useState(null); //get those listing which has rent
  const [salesListing, setSaleListing] = useState(null); //get those listing which has sale
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        const docSnap = await getDocs(q);
        let listings = [];
        docSnap.forEach((listing) => {
          return listings.push({
            id: listing.id,
            data: listing.data(),
          });
        });
        setOfferListing(listings);
      } catch (error) {
        console.log(error);
      }
    };
    //fetch rent listing
    const fetchRentListings = async () => {
      try {
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("type", "==", "rent"),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        const docSnap = await getDocs(q);
        let listings = [];
        docSnap.forEach((listing) => {
          return listings.push({
            id: listing.id,
            data: listing.data(),
          });
        });
        setRentListing(listings);
      } catch (error) {
        console.log(error);
      }
    };
    //fetch sales listing
    const fetchSalesListings = async () => {
      try {
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("type", "==", "sell"),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        const docSnap = await getDocs(q);
        let listings = [];
        docSnap.forEach((listing) => {
          return listings.push({
            id: listing.id,
            data: listing.data(),
          });
        });
        setSaleListing(listings);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
    fetchRentListings();
    fetchSalesListings();
  }, []);
  return (
    <div>
      <HomeSlider />
      <div className="max-w-6xl mx-auto pt-4 sapce-y-6">
        {offersListing && offersListing.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-6 font-semibold">Recent Offers</h2>
            <Link to="/offers">
              <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-out">
                Show more offers
              </p>
              <ul className="sm:grid sm:grid-col-2 lg:grid-cols-3 xl:grid-cols-4">
                {offersListing.map((listing) => {
                  return (
                    <ListingItem
                      key={listing.id}
                      listing={listing.data}
                      id={listing.id}
                    />
                  );
                })}
              </ul>
            </Link>
          </div>
        )}
        {rentsListing && rentsListing.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-6 font-semibold">
              Places for rent
            </h2>
            <Link to={`/category/rent`}>
              <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-out">
                Show more places for rent
              </p>
              <ul className="sm:grid sm:grid-col-2 lg:grid-cols-3 xl:grid-cols-4">
                {rentsListing.map((listing) => {
                  return (
                    <ListingItem
                      key={listing.id}
                      listing={listing.data}
                      id={listing.id}
                    />
                  );
                })}
              </ul>
            </Link>
          </div>
        )}
        {salesListing && salesListing.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-6 font-semibold">
              Places for sale
            </h2>
            <Link to={`/category/sell`}>
              <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-out">
                Show more places for sale
              </p>
              <ul className="sm:grid sm:grid-col-2 lg:grid-cols-3 xl:grid-cols-4">
                {salesListing.map((listing) => {
                  return (
                    <ListingItem
                      key={listing.id}
                      listing={listing.data}
                      id={listing.id}
                    />
                  );
                })}
              </ul>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
