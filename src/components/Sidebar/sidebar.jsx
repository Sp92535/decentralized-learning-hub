"use client";
import React from "react";
import Link from "next/link";
import { FaBook, FaShoppingCart, FaSearch, FaPlus, FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

export const Sidebar = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("userData");
    router.push("/");
  };

  return (
    <aside className="w-64 bg-white h-screen flex flex-col items-center py-6 text-gray-900 shadow-lg border-r border-gray-200">
      {/* Logo */}
      <div className="mb-8">
        <Link href="/dashboard">
          <div className="flex flex-col items-center">
            <h1 className="text-4xl mb-2">📚</h1>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              DLH
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="w-full px-4">
        <ul className="space-y-4">
          <li>
            <Link href="/create-course">
              <div className="flex items-center px-4 py-3 rounded-lg bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 transition text-gray-800 shadow-sm hover:shadow transform hover:-translate-y-0.5">
                <div className="p-2 bg-blue-500 rounded-lg text-white mr-3">
                  <FaPlus />
                </div>
                <span className="font-medium">Create Course</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/owned-courses">
              <div className="flex items-center px-4 py-3 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 transition text-gray-800 shadow-sm hover:shadow transform hover:-translate-y-0.5">
                <div className="p-2 bg-gray-500 rounded-lg text-white mr-3">
                  <FaBook />
                </div>
                <span className="font-medium">Owned Courses</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/all-courses">
              <div className="flex items-center px-4 py-3 rounded-lg bg-gradient-to-r from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 transition text-gray-800 shadow-sm hover:shadow transform hover:-translate-y-0.5">
                <div className="p-2 bg-green-500 rounded-lg text-white mr-3">
                  <FaSearch />
                </div>
                <span className="font-medium">Explore Courses</span>  
              </div>
            </Link>
          </li>
          <li>
            <Link href="/bought-courses">
              <div className="flex items-center px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-100 to-indigo-200 hover:from-indigo-200 hover:to-indigo-300 transition text-gray-800 shadow-sm hover:shadow transform hover:-translate-y-0.5">
                <div className="p-2 bg-indigo-500 rounded-lg text-white mr-3">
                  <FaShoppingCart />
                </div>
                <span className="font-medium">Bought Courses</span>
              </div>
            </Link>
          </li>
        </ul>
      </nav>
      
      {/* Bottom section */}
      <div className="mt-auto px-4 py-4 w-full space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-100 p-4 rounded-lg shadow-sm">
          <h3 className="font-medium text-gray-800 mb-2">Need Help?</h3>
          <p className="text-sm text-gray-600 mb-3">
            Questions about blockchain education?
          </p>
          <Link href="/support">
            <div className="text-sm font-medium text-blue-600 hover:text-blue-800 transition">
              Contact Support →
            </div>
          </Link>
        </div>
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 rounded-lg bg-gradient-to-r from-red-100 to-red-200 hover:from-red-200 hover:to-red-300 transition text-gray-800 shadow-sm hover:shadow transform hover:-translate-y-0.5"
        >
          <div className="p-2 bg-red-500 rounded-lg text-white mr-3">
            <FaSignOutAlt />
          </div>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};