import React from 'react'
import Link from 'next/link';

export default function Navbar({ isSignedIn, loggedInAddress, loggedInName, loggedInProfilePic, handleSignIn, handleSignOut }) {
  return (
    <div className="flex items-center space-x-4">
      {isSignedIn && (
        <>
          <div className='text-white'>
            <div>Wallet ID: {loggedInAddress}</div>
            {loggedInName && <div>{loggedInName}</div>}
            {loggedInProfilePic && <img src={loggedInProfilePic} alt="Profile" className="w-10 h-10 rounded-full" />}
          </div>
          <div>
            <Link href='/createPost'>
              <button className="bg-green-500 text-white px-4 py-2 rounded-md">Create Post</button>
            </Link>
            <Link href='/pages/'>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md ml-4">Edit Profile</button>
            </Link>
          </div>
        </>
      )}
      {!isSignedIn ? (
        <button onClick={handleSignIn} className="bg-blue-500 text-white px-4 py-2 rounded-md">Sign In</button>
      ) : (
        <div className="flex items-center space-x-4">
          <button onClick={handleSignOut} className="bg-red-500 text-white px-4 py-2 rounded-md">Sign Out</button>
        </div>
      )}
    </div>
  )
}
