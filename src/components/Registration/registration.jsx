"use client"; // ✅ Marks this as a Client Component
import { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io"; 
import { useRouter } from "next/navigation"; // ✅ Use Next.js router
import "../Registration/registration.css"; // ✅ Ensure this path is correct
import "../globals.css"

export const RegistrationForm = () => {
  const router = useRouter(); // ✅ Correct way to handle navigation

  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5001/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Registration successful!");
        console.log("Server response:", data);
        router.push("/login"); // ✅ Redirect to login page after success
      } else {
        alert("Registration failed!");
        console.error("Error response:", data);
      }
    } catch (error) {
      console.error("Error occurred during registration:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <>
      {/* Back Arrow (Navigates to previous page) */}
      <IoMdArrowRoundBack
        size={30}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          cursor: "pointer",
        }}
        onClick={() => router.back()} // ✅ Corrected navigation
      />

      <form onSubmit={handleFormSubmit} className="registration-form">
        <div className="container">
          <h1>Sign Up</h1>
          <p>Please fill in the form to create an account.</p>

          <label htmlFor="first_name">
            <b>First Name</b>
          </label>
          <input
            type="text"
            name="first_name"
            placeholder="Enter First Name"
            required
            value={user.first_name}
            onChange={handleInputChange}
          />

          <label htmlFor="last_name">
            <b>Last Name</b>
          </label>
          <input
            type="text"
            name="last_name"
            placeholder="Enter Last Name"
            required
            value={user.last_name}
            onChange={handleInputChange}
          />

          <label htmlFor="email">
            <b>Email</b>
          </label>
          <input
            type="email" // ✅ Fixed type
            name="email"
            placeholder="Enter Email"
            required
            value={user.email}
            onChange={handleInputChange}
          />

          <label htmlFor="password">
            <b>Password</b>
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            required
            value={user.password}
            onChange={handleInputChange}
          />

          <label htmlFor="phone_number">
            <b>Phone Number</b>
          </label>
          <input
            type="tel" // ✅ Use "tel" for phone number input
            name="phone_number"
            placeholder="9876543210"
            required
            value={user.phone_number}
            onChange={handleInputChange}
          />

          <p>
            By creating an account you agree to our{" "}
            <a href="#" style={{ color: "dodgerblue" }}>
              Terms and Privacy
            </a>
          </p>

          <div className="clearfix">
            <button type="submit" className="btn">
              Sign Up
            </button>
          </div>
        </div>
      </form>
    </>
  );
};
