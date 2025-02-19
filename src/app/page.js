"use client";
import { useEffect, useState } from "react";
import { getContracts } from "@/utils/contracts";
import Link from "next/link";


export default function Home() {
  const [userFactory, setUserFactory] = useState(null);
  const [courseFactory, setCourseFactory] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);

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
    <div>
      <h1>Decentralized Learning Hub</h1>
      {!isConnected ? (
        <button onClick={connectWallet} disabled={loading}>
          {loading ? "Connecting..." : "Connect Wallet"}
        </button>
      ) : (
        <div>
          <p>Connected ✅</p>
          <Link href={"/register"}> Register </Link>
          <br></br>
          <Link href={"/login"}> Login </Link>
        </div>
      )}

      {userFactory && courseFactory ? (
        <p>Contracts Loaded Successfully!</p>
      ) : (
        <p>Loading Contracts...</p>
      )}
    </div>
  );
}
