"use client";
import { useState } from "react";
import { registerUser } from "@/utils/contracts";

export default function Register() {
    const [username, setUsername] = useState("");
    const [status, setStatus] = useState("");

    const handleRegister = async () => {
        if (!username) return;

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
