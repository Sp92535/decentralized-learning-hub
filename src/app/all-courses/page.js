"use client";
import { buyCourse, getAllCourses } from "@/utils/course_factory";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar/sidebar";

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      setStatus("🔍 Loading courses...");
      try {
        const data = await getAllCourses();
        setCourses(data);
        setStatus(data.length > 0 ? "" : "📝 No courses available");
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        setStatus("❌ Failed to load courses");
      }
    };
    fetchCourses();
  }, []);

  const handleBuyCourse = async (course) => {
    try {
      setStatus(`⏳ Purchasing ${course.name}...`);
      const success = await buyCourse(course.address, course.price);
      if (success) {
        setStatus(`✅ Successfully purchased ${course.name}!`);
      }
    } catch (error) {
      console.error("Course purchase failed:", error);
      setStatus(`❌ Purchase failed: ${error.message || "Unknown error"}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex flex-col items-center justify-start flex-1 p-8">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-4xl border border-gray-200 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-center mb-6">
            <span className="text-green-600 text-3xl mr-2">📚</span>
            <h1 className="text-3xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Available Courses
            </h1>
          </div>
          
          {status && (
            <div className={`p-3 rounded-lg text-center mb-6 ${
              status.includes("✅") ? "bg-green-100 text-green-700" :
              status.includes("❌") ? "bg-red-100 text-red-700" :
              status.includes("📝") ? "bg-yellow-100 text-yellow-700" :
              "bg-blue-100 text-blue-700"
            }`}>
              {status}
            </div>
          )}
          
          {courses.length > 0 ? (
            <div className="grid gap-6">
              {courses.map((course, index) => (
                <div 
                  key={index} 
                  className="border border-gray-200 p-6 rounded-xl shadow-md bg-white hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{course.name}</h3>
                      <p className="text-sm text-gray-500 mb-1">
                        <span className="font-medium">Address:</span> {course.address.substring(0, 10)}...{course.address.substring(course.address.length - 8)}
                      </p>
                      <p className="text-sm text-gray-500 mb-1">
                        <span className="font-medium">IPFS Link:</span>{" "}
                        <a 
                          href={course.ipfsLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-500 hover:text-blue-700 underline transition-colors"
                        >
                          View Content
                        </a>
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="bg-indigo-50 px-4 py-2 rounded-lg mb-2">
                        <span className="text-lg font-bold text-indigo-700">{course.price} ETH</span>
                      </div>
                      <button 
                        onClick={() => handleBuyCourse(course)} 
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 transform hover:-translate-y-1"
                      >
                        <span className="mr-2">💰</span>
                        Purchase Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-xl text-gray-600 mb-2">No courses available yet</p>
              <p className="text-gray-500">Check back later or create your own course!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}