"use client";
import { useEffect, useState } from "react";
import { getContracts } from "@/utils/contracts";
import Register from "@/components/Register/Register";
import Login from "@/components/Login/Login";
import Link from "next/link";

export default function Home() {
  const [userFactory, setUserFactory] = useState(null);
  const [courseFactory, setCourseFactory] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        setLoading(true);
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const contracts = await getContracts();
        if (contracts) {
          setUserFactory(contracts.userFactory);
          setCourseFactory(contracts.courseFactory);
          setIsConnected(true);
        }
      } catch (error) {
        console.error("Error connecting wallet:", error);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please install Metamask.");
    }
  };

  useEffect(() => {
    if (isConnected) {
      connectWallet();
    }
  }, [isConnected]);

  return (
    <div className="flex h-screen">
      {/* Left Section (Form & Wallet Connection) */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white shadow-lg p-8">
        <div className="max-w-sm w-full">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Welcome</h2>

          {!isConnected ? (
            <button 
              onClick={connectWallet} 
              disabled={loading} 
              className="w-full px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg shadow-md disabled:bg-gray-400">
              {loading ? "Connecting..." : "Connect Wallet"}
            </button>
          ) : (
            <div>
              <p className="text-green-600 font-semibold text-center mb-4">Wallet Connected ✅</p>
              <Register />
              <p className="my-3 text-gray-600 text-center">OR</p>
              <Login setIsLoggedIn={setIsLoggedIn} setUserData={setUserData} />

              {isLoggedIn && (
                <div className="mt-6 p-4 border-t">
                  <p className="text-lg font-semibold text-gray-700">Welcome {userData.name}! </p>
                  <p className="text-gray-600">Address: {userData.address}</p>
                  <div className="mt-4 space-y-2">
                    <Link href="/create-course" className="block text-blue-600 hover:underline">Create Course</Link>
                    <Link href="/owned-courses" className="block text-blue-600 hover:underline">Owned Courses</Link>
                    <Link href="/all-courses" className="block text-blue-600 hover:underline">Explore Courses</Link>
                    <Link href="/bought-courses" className="block text-blue-600 hover:underline">Bought Courses</Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Section (Branding) */}
      <div className="hidden md:flex w-1/2 bg-blue-600 text-white flex-col items-center justify-center p-8">
        <h2 className="text-4xl font-bold">Decentralized Learning Hub</h2>
        <p className="text-lg text-center mt-4">Empowering education through blockchain technology.</p>
      </div>
    </div>
  );
}
