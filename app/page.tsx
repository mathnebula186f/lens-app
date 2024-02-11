// app/page.tsx
'use client'
import { useEffect, useState } from 'react';
import { useExploreProfiles } from '@lens-protocol/react-web';
import Link from 'next/link';
import { formatPicture } from '../utils';
import Navbar from './Navbar';

export default function Home() {
  const [loggedInAddress, setLoggedInAddress] = useState<string | null>(null);
  const [loggedInName, setLoggedInName] = useState<string | null>(null);
  const [loggedInDescription, setLoggedInDescription] = useState<string | null>(null);
  const [loggedInProfilePic, setLoggedInProfilePic] = useState<string | null>(null); // Add state for profile picture
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [profiles, setProfiles] = useState<any[]>([]); // State to store profiles

  useEffect(() => {
    const address = localStorage.getItem('loggedInAddress');
    const name = localStorage.getItem(address + '_name');
    const description = localStorage.getItem(address + '_description');
    const profilePic = localStorage.getItem(address + '_profilePic'); // Retrieve profile picture from local storage
    if (address) {
      setLoggedInAddress(address);
      setLoggedInName(name);
      setLoggedInDescription(description);
      setLoggedInProfilePic(profilePic); // Set profile picture state
      setIsSignedIn(true);
    }
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    return () => {
      window.ethereum.off('accountsChanged', handleAccountsChanged);
    };
  }, []);

  useEffect(() => {
    // Get all addresses from local storage that have posts
    const addressesWithPosts: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.endsWith('_posts')) {
        const address = key.replace('_posts', '');
        addressesWithPosts.push(address);
      }
    }
    console.log("psosts=",addressesWithPosts)
    // Create profiles for each address with posts
    const profilesFromPosts = addressesWithPosts.map((address) => {
      const name = localStorage.getItem(address + '_name');
      const description = localStorage.getItem(address + '_description');
      const profilePic = localStorage.getItem(address + '_profilePic');
      console.log(profilePic)
      return {
        handle: name,
        bio: description,
        picture: profilePic
      };
    });

    // Set the profiles state
    setProfiles(profilesFromPosts);
  }, []);

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length > 0) {
      const newAddress = accounts[0];
      setLoggedInAddress(newAddress);
      localStorage.setItem('loggedInAddress', newAddress);
      const newName = localStorage.getItem(newAddress + '_name');
      const newDescription = localStorage.getItem(newAddress + '_description');
      const newProfilePic = localStorage.getItem(newAddress + '_profilePic'); // Retrieve updated profile picture
      setLoggedInName(newName);
      setLoggedInDescription(newDescription);
      setLoggedInProfilePic(newProfilePic); // Set updated profile picture state
      setIsSignedIn(true);
    } else {
      setLoggedInAddress(null);
      setLoggedInName(null);
      setLoggedInDescription(null);
      setLoggedInProfilePic(null); // Clear profile picture state
      setIsSignedIn(false);
    }
  };

  const handleSignIn = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      await window.ethereum.request({
      method: 'wallet_requestPermissions',
      params: [{
        eth_accounts: {}
      }]
    });
      setLoggedInAddress(address);
      const name = localStorage.getItem(address + '_name');
      const description = localStorage.getItem(address + '_description');
      const profilePic = localStorage.getItem(address + '_profilePic'); // Retrieve profile picture from local storage
      setLoggedInName(name);
      setLoggedInDescription(description);
      setLoggedInProfilePic(profilePic); // Set profile picture state
      setIsSignedIn(true);
      localStorage.setItem('loggedInAddress', address);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleSignOut = () => {
    setLoggedInAddress(null);
    setLoggedInName(null);
    setLoggedInDescription(null);
    setLoggedInProfilePic(null); // Clear profile picture state
    setIsSignedIn(false);
    localStorage.removeItem('loggedInAddress');
  };

  const { data } = useExploreProfiles({
    limit: 25
  });

  return (
    <div className='p-20 bg-pattern bg-cover'>
      <Navbar isSignedIn={isSignedIn} loggedInAddress={loggedInAddress} loggedInName={loggedInName} loggedInProfilePic={loggedInProfilePic} handleSignIn={handleSignIn} handleSignOut={handleSignOut} />
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white">MILAN APP</h1>
        </div>
        <h2 className="text-3xl font-bold mb-4 text-white">Current Posts</h2>
        {data ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.concat(profiles).map((profile, index) => (
            <Link href={`/profile/${profile.handle}`} key={index}>
              <div className='bg-white rounded-lg overflow-hidden shadow-md cursor-pointer transition duration-300 hover:shadow-lg'>
                <div className="p-4">
                  {profile.picture && profile.picture.__typename === 'MediaSet' ? (
                    <img
                      src={formatPicture(profile.picture)}
                      className="w-full h-auto rounded-full max-w-48 max-h-48 object-cover mx-auto"
                      alt={profile.handle}
                    />
                  ) : (
                    <div className="w-full h-auto rounded-full mx-auto">
                      <img
                        src={formatPicture(profile.picture)}
                        className="w-full h-auto rounded-full max-w-48 max-h-48 object-cover"
                        alt={profile.handle}
                      />
                    </div>
                  )}
                </div>
                <div className="px-4 py-2">
                  <h3 className="text-xl font-semibold text-black">{profile.handle}</h3>
                  <p className="text-gray-600">{profile.bio}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>        
        ) : (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
          </div>
        )}
      </div>
    </div>
  );
}
