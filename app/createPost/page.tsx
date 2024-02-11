// createPost.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CreatePost() {
  const [loggedInAddress, setLoggedInAddress] = useState<string | null>(null);
  const [post, setPost] = useState('');

  useEffect(() => {
    const address = localStorage.getItem('loggedInAddress');
    if (address) {
      setLoggedInAddress(address);
    }
    (window as any).ethereum.on('accountsChanged', handleAccountsChanged);
    return () => {
      (window as any).ethereum.off('accountsChanged', handleAccountsChanged);
    };
  }, []);

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length > 0) {
      const newAddress = accounts[0];
      setLoggedInAddress(newAddress);
    } else {
      setLoggedInAddress(null);
    }
  };

  const handleSubmit = async() => {
  if (!loggedInAddress) {
    console.error('User not logged in');
    return;
  }
  if (!post.trim()) {
    alert('Post field cannot be empty.');
    return;
  }
  await (window as any).ethereum.request({
    method: 'wallet_requestPermissions',
    params: [{
      eth_accounts: {}
    }]
  });
  
  // Retrieve existing posts from local storage
  const existingPostsString = localStorage.getItem(loggedInAddress + '_posts');
  const existingPosts = existingPostsString ? JSON.parse(existingPostsString) : [];

  // Append the new post to the existing array of posts
  const updatedPosts = [...existingPosts, post];

  // Save the updated array of posts in local storage
  localStorage.setItem(loggedInAddress + '_posts', JSON.stringify(updatedPosts));

  alert("Post Created!");
  // You may also send the post data to your backend or perform any other actions here
  // Redirect to homepage or any other page
  // router.push('/');
};


  return (
  <div className='p-20 bg-pattern text-white bg-cover'>
    <h1 className='text-5xl font-bold mb-8'>Create Post</h1>
    <div className="text-black mb-4">Logged In Address: {loggedInAddress}</div>
    <label className="block mb-2 text-lg">Post:</label>
    <textarea
      value={post}
      onChange={(e) => setPost(e.target.value)}
      className="w-full border rounded-md px-4 py-2 mb-4 text-black"
    />
    <button
      onClick={handleSubmit}
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      Submit
    </button>
    <Link href='/'>
      <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded ml-2 focus:outline-none focus:shadow-outline">
        HomePage
      </button>
    </Link>
  </div>
  );
}
