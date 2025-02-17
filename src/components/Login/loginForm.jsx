"use client";

import { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation"; // Use Next.js router
import "../Login/loginForm.css";
import "../globals.css"

export const LoginForm = () => {
  const router = useRouter(); // Next.js navigation

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Login successful!");
        console.log("Server response:", data);
        router.push("/dashboard"); // Next.js navigation
      } else {
        alert(`Login failed: ${data.message || "Invalid credentials"}`);
        console.error("Error response:", data);
      }
    } catch (error) {
      console.error("Error occurred during login:", error);
      alert("Something went wrong! Please try again.");
    }
  };

  return (
    <div>
      <IoMdArrowRoundBack
        size={30}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          cursor: "pointer",
        }}
        onClick={() => router.back()} // Navigate back
      />
      <form onSubmit={handleFormSubmit} className="registration-form">
        <div className="container">
          <div className="card">
            <h1>Login Form</h1>
            <label htmlFor="email"><b>Email</b></label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              required
              value={user.email}
              onChange={handleInputChange}
            />
            <label htmlFor="password"><b>Password</b></label>
            <input
              type="password"
              name="password"
              required
              autoComplete="off"
              placeholder="Enter Password"
              value={user.password}
              onChange={handleInputChange}
            />
            <button type="submit" className="btn">Login</button>
          </div>
        </div>
      </form>
    </div>
  );
};
