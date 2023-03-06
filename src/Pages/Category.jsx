import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../Components/Spinner";
import { db } from "../Firebase";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import ListingItem from "../Components/ListingItem";
import { useParams } from "react-router";

export default function Category() {
  const [listings, setListing] = useState(null);
  const [lastFetchedListings, setLastFetchedListing] = useState(null); //get the last listing which is loaded on the page
  const [loading, setLoading] = useState(true);
  const params = useParams();
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("type", "==", params.categoryName),
          orderBy("timestamp", "desc"),
          limit(8)
        );
        const docSnap = await getDocs(q);
        const lastVisible = docSnap.docs[docSnap.docs.length - 1]; //get the last listing
        setLastFetchedListing(lastVisible);
        let listings = [];
        docSnap.forEach((listing) => {
          return listings.push({
            id: listing.id,
            data: listing.data(),
          });
        });
        setListing(listings);
        setLoading(false);
      } catch (error) {
        toast.error("Could not fetch listings");
      }
    };

    fetchListing();
  }, []);

  const onFetchMoreListings = async () => {
    try {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("type", "==", params.categoryName),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListings), //this will tell the last listing so data will start fetching after this
        limit(4)
      );
      const docSnap = await getDocs(q);
      const lastVisible = docSnap.docs[docSnap.docs.length - 1]; //get the last listing
      setLastFetchedListing(lastVisible);
      let listings = [];
      docSnap.forEach((listing) => {
        return listings.push({
          id: listing.id,
          data: listing.data(),
        });
      });
      setListing((prevState) => [
        ...prevState, ...listings
      ]);
      setLoading(false);
    } catch (error) {
      toast.error("Could not fetch listings");
    }
  };

  if (loading) {
    return <Spinner />;
  }
  return (
    <div className="max-w-6xl mx-auto pt-4 sapce-y-6">
      <h1 className="uppercase text-center text-3xl mt-6 font-bold underline mb-6">
        {params.categoryName == "rent" ? 'Places for rent' : 'places for sale'}
      </h1>
      {listings && listings.length > 0 && (
        <div className="m-2 mb-6">
          <ul className="sm:grid sm:grid-col-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {listings.map((listing) => {
              return (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              );
            })}
          </ul>
          {lastFetchedListings && (
            <div className="flex justify-center items-center">
              <button
                onClick={onFetchMoreListings}
                className="bg-white px-3 py-1.5 text-gray-700 border border-gray-300 mb-6 mt-6 hover:border-slate-600 rounded transition duration-150 ease-in-out"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
