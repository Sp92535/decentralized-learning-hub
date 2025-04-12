"use client";
import { loginUser, registerUser } from "@/utils/course_marketplace";
import { useState } from "react";

export default function Register() {
    const [username, setUsername] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!username) return;
        
        try {
            setLoading(true);
            const hasAccount = await loginUser();
            if(hasAccount){
                setStatus("Account for this address already exists");
                return;
            }
            
            setStatus("Registering...");
            const success = await registerUser(username);
            setStatus(success ? "Registration Successful!" : "Registration Failed");
        } catch (error) {
            console.error("Registration error:", error);
            setStatus("Registration Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 text-center">Register New Account</h3>
            
            <div className="space-y-3">
                <input
                    type="text"
                    placeholder="Enter Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <button 
                    onClick={handleRegister}
                    disabled={loading || !username} 
                    className="w-full px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {loading ? "Registering..." : "Register"}
                </button>
                
                {status && (
                    <p className={`text-sm font-medium text-center ${
                        status.includes("Successful") ? "text-green-600" : 
                        status.includes("Registering") ? "text-blue-600" : "text-red-600"
                    }`}>
                        {status}
                    </p>
                )}
            </div>
        </div>
    );
}