"use client";
import { useState } from "react";
import { loginUser, registerUser } from "@/utils/contracts";

export default function Register() {
    const [username, setUsername] = useState("");
    const [status, setStatus] = useState("");

    const handleRegister = async () => {
        if (!username) return;
        const hasAccount = await loginUser();
        if(hasAccount){
            setStatus("Account for this address already exists...")
            return
        }
        setStatus("Registering...");
        const success = await registerUser(username);
        setStatus(success ? "Registration Successful!" : "Registration Failed.");
    };

    return (
        <div>
            <h1>Register</h1>
            <input
                type="text"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={handleRegister}>Register</button>
            <p>{status}</p>
        </div>
    );
}
