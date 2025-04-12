"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getContracts } from "@/utils/contracts";
import Register from "@/components/Register/Register";
import Login from "@/components/Login/Login";

export default function Home() {
  const router = useRouter();
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
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/dashboard");
    }
  }, [isLoggedIn, router]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Left Section (Registration & Login) */}
      <div className="w-1/2 flex flex-col justify-center items-center p-10">
        <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border border-gray-200 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-center mb-6">
            <span className="text-green-600 text-3xl mr-2">🔐</span>
            <h1 className="text-3xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Welcome
            </h1>
          </div>

          {!isConnected ? (
            <button
              onClick={connectWallet}
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 transform hover:-translate-y-1"
            >
              <span className="mr-2">🦊</span>
              {loading ? "Connecting..." : "Connect Wallet"}
            </button>
          ) : (
            <div className="w-full space-y-6">
              <p className="text-green-600 font-semibold text-center mb-4">
                Wallet Connected ✅
              </p>
              <Register />
              <div className="relative flex items-center my-6">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-600">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
              <Login setIsLoggedIn={setIsLoggedIn} setUserData={setUserData} />
            </div>
          )}
        </div>
      </div>

      {/* Right Section (Decentralized Learning Hub) */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-10">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold mb-6">Decentralized Learning Hub</h1>
          <p className="text-lg mb-8">
            A secure and transparent platform for learning and teaching on the blockchain.
          </p>
          <div className="flex justify-center space-x-4">
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
              <span className="text-3xl mb-2">📚</span>
              <p className="font-medium">Learn Anywhere</p>
            </div>
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
              <span className="text-3xl mb-2">⛓️</span>
              <p className="font-medium">Blockchain Secured</p>
            </div>
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
              <span className="text-3xl mb-2">💰</span>
              <p className="font-medium">Earn by Teaching</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}