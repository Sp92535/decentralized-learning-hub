"use client";
import { loginUser } from "@/utils/user_factory";
import { useState } from "react";

export default function Login({ setIsLoggedIn, setUserData }) {
    const [status, setStatus] = useState("");

    const handleLogin = async () => {
        setStatus("Logging in...");
        const userData = await loginUser();
        if (userData) {
            setIsLoggedIn(true);
            setUserData(userData);
            setStatus("Login Successful!");
        } else {
            setStatus("Login Failed. User not found.");
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <button onClick={handleLogin}>Login</button>
            <p>{status}</p>
        </div>
    );
}
