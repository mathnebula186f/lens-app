import React from "react";
import Link from "next/link";

export default function Navbar({
  isSignedIn,
  loggedInAddress,
  loggedInName,
  loggedInProfilePic,
  handleSignIn,
  handleSignOut,
}) {
  return (
    <>
      <div className="flex justify-start">
        {isSignedIn && (
          <>
            <div className="text-white">
              <div>Wallet ID: {loggedInAddress}</div>
              {loggedInName && <div>{loggedInName}</div>}
              {loggedInProfilePic && (
                <img
                  src={loggedInProfilePic}
                  alt="Profile"
                  className="w-full h-auto rounded-full max-w-48 max-h-48 object-cover mx-auto"
                />
              )}
            </div>
          </>
        )}
      </div>
      <div className="flex justify-end">
        {isSignedIn && (
          <>
            <Link href="/createPost">
              <button className="bg-green-500 text-white px-4 py-2 rounded-md m-2">
                Create Post
              </button>
            </Link>
            <Link href="/pages/">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md m-2">
                Edit Profile
              </button>
            </Link>
          </>
        )}
        {!isSignedIn ? (
          <button
            onClick={handleSignIn}
            className="bg-blue-500 text-white px-4 py-2 rounded-md m-2">
            Sign In
          </button>
        ) : (
          <>
            <button
              onClick={handleSignOut}
              className="bg-red-500 text-white px-4 py-2 rounded-md m-2">
              Sign Out
            </button>
          </>
        )}
      </div>
    </>
  );
}
