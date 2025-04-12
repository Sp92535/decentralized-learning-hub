"use client";
import { loginUser } from "@/utils/course_marketplace";
import { useState, useEffect } from "react";

export default function Login({ setIsLoggedIn, setUserData }) {
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    // Check localStorage on component mount
    useEffect(() => {
        const storedUser = localStorage.getItem("userData");
        if (storedUser) {
            setUserData(JSON.parse(storedUser));
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogin = async () => {
        try {
            setLoading(true);
            setStatus("Logging in...");
            const userData = await loginUser();
            
            if (userData) {
                // Store in localStorage
                localStorage.setItem("userData", JSON.stringify(userData));

                // Update state
                setIsLoggedIn(true);
                setUserData(userData);
                setStatus("Login Successful!");
            } else {
                setStatus("Login Failed. User not found.");
            }
        } catch (error) {
            console.error("Login error:", error);
            setStatus("Login Failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 text-center">Login to Your Account</h3>
            
            <button 
                onClick={handleLogin}
                disabled={loading} 
                className="w-full px-6 py-3 text-white bg-green-600 hover:bg-green-700 font-semibold rounded-lg shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {loading ? "Logging in..." : "Login with Connected Wallet"}
            </button>
            
            {status && (
                <p className={`text-sm font-medium text-center ${
                    status.includes("Successful") ? "text-green-600" : 
                    status.includes("Logging") ? "text-blue-600" : "text-red-600"
                }`}>
                    {status}
                </p>
            )}
        </div>
    );
}
