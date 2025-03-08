"use client";
import React, { createContext, useState } from "react";
import "../components/globals.css";
import { Navbar } from "../components/Navbar/navbar"; 
import { Sidebar } from "../components/Sidebar/sidebar"; 

export default function Layout({ children }) {
  return (
      <html lang="en">
        <head />
        <body className="antialiased">
          {/* <Navbar /> */}
          <div className="flex">
            {/* <Sidebar /> */}
            <main className="flex-grow">{children}</main>
          </div>
        </body>
      </html>
  );
}
