// editProfile.tsx
'use client';
import { useState ,useEffect} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function EditProfile({setLoggedInName, setLoggedInDescription }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [loggedInAddress, setLoggedInAddress] = useState<string | null>(null);
  // const router = useRouter();

  useEffect(() => {
    const address = localStorage.getItem('loggedInAddress');
    const name = localStorage.getItem(address + '_name');
    const description = localStorage.getItem(address + '_description');
    if (address) {
      setLoggedInAddress(address);
      // setLoggedInName(name);
      // setLoggedInDescription(description);
      // setIsSignedIn(true);
    }
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    return () => {
      window.ethereum.off('accountsChanged', handleAccountsChanged);
    };
  }, []);

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length > 0) {
      const newAddress = accounts[0];
      setLoggedInAddress(newAddress);
      localStorage.setItem('loggedInAddress', newAddress);
      const newName = localStorage.getItem(newAddress + '_name');
      const newDescription = localStorage.getItem(newAddress + '_description');
      // setLoggedInName(newName);
      // setLoggedInDescription(newDescription);
      // setIsSignedIn(true);
    } else {
      setLoggedInAddress(null);
      // setLoggedInName(null);
      // setLoggedInDescription(null);
      // setIsSignedIn(false);
    }
  };
  const handleSubmit = async () => {
    // Update profile information in local storage
    if (!name.trim() || !description.trim()) {
      alert('Name and description fields cannot be empty.');
      return;
    }
    await window.ethereum.request({
      method: 'wallet_requestPermissions',
      params: [{
        eth_accounts: {}
      }]
    });
    console.log("My Address=",loggedInAddress);
    localStorage.setItem(loggedInAddress + '_name', name);
    localStorage.setItem(loggedInAddress + '_description', description);
    if (profilePic) {
      // Convert image file to base64 and store in local storage
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result?.toString();
        if (base64Image) {
          localStorage.setItem(loggedInAddress + '_profilePic', base64Image);
        }
      };
      reader.readAsDataURL(profilePic);
    }
    // Update state in parent component
    // setLoggedInName(name);
    // setLoggedInDescription(description);
    // Redirect to homepage
    // router.push('/');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(file);
    }
  };

  return (
    <div className='p-20'>
      
      <h1 className='text-5xl font-bold mb-8'>Edit Profile</h1>
      <h1 className='text-4xl font-bold mb-8'>{loggedInAddress}</h1>
      <div className="text-black mb-4">Address: {loggedInAddress}</div>
      <label className="block mb-2 text-lg">Name:</label>
      <input 
        type='text' 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        className="w-full border rounded-md px-4 py-2 mb-4 text-black"
      />
      <label className="block mb-2 text-lg">Description:</label>
      <textarea 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
        className="w-full border rounded-md px-4 py-2 mb-4 text-black"
      />
      <label className="block mb-2 text-lg">Profile Picture:</label>
      <input 
        type='file' 
        accept='image/*' 
        onChange={handleFileChange} 
        className="mb-4"
      />
      <button 
        onClick={handleSubmit} 
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
      >
        Submit
      </button>
      <Link href='/'>
        <button>HomePage</button>
      </Link>
    </div>
  );
}
