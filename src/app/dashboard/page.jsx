"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar/sidebar";

export default function Dashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (!storedUser) {
      router.push("/");
    } else {
      setUserData(JSON.parse(storedUser));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    setUserData(null);
    router.push("/");
  };

  if (!userData) return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl">
        <p className="text-lg text-gray-700">Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-1 p-8">
        <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-2xl border border-gray-200 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-center mb-6">
            <span className="text-blue-600 text-3xl mr-2">👋</span>
            <h1 className="text-3xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Welcome, {userData.name}!
            </h1>
          </div>
          
          <div className="text-center mb-8">
            <p className="text-gray-600 flex items-center justify-center">
              <span className="mr-2">📍</span> {userData.address}
            </p>
            <p className="text-gray-500 mt-4">
              Your dashboard is under construction. More features coming soon!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h2 className="font-semibold text-blue-800 mb-2">My Courses</h2>
              <p className="text-gray-600">View your enrolled courses</p>
            </div>
            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
              <h2 className="font-semibold text-indigo-800 mb-2">My Creations</h2>
              <p className="text-gray-600">Manage courses you've created</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg shadow-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-200 transform hover:-translate-y-1"
          >
            <span className="mr-2">🚪</span>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}