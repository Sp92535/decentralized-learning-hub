"use client";
import React, { createContext, useState } from "react";
import Category from "./Category/category";
import "../Sidebar/sidebar.css";
import "../globals.css";

export const Sidebar = () => {
  return (
    <section className="sidebar">
      <div className="logo-container">
        <h1>🛒</h1>
      </div>
      <Category />
      {/* <ConnectWallet className="btns mt-4" /> */}
    </section>
  );
};
