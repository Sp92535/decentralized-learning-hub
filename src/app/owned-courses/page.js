"use client";
import { useState, useEffect } from "react";
import { getOwnedCourses } from "@/utils/course_marketplace";
import { Sidebar } from "@/components/Sidebar/sidebar";
import Link from "next/link";

export default function OwnedCourses() {
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      setStatus("🔍 Loading your courses...");
      try {
        const ownedCourses = await getOwnedCourses();
        setCourses(ownedCourses);
        setStatus(ownedCourses.length > 0 ? "" : "📚 You don't own any courses yet");
      } catch (error) {
        console.error("Failed to fetch owned courses:", error);
        setStatus("❌ Failed to load your courses");
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-start flex-1 p-8">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-4xl border border-gray-200 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-center mb-6">
            <span className="text-blue-600 text-3xl mr-2">📚</span>
            <h1 className="text-3xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Owned Courses
            </h1>
          </div>

          {status && (
            <div className={`p-3 rounded-lg text-center mb-6 ${status.includes("✅") ? "bg-green-100 text-green-700" :
              status.includes("❌") ? "bg-red-100 text-red-700" :
                status.includes("📚") ? "bg-yellow-100 text-yellow-700" :
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
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{course.name}</h3>
                      <p className="text-sm text-gray-500 mb-1">
                        <span className="font-medium">Course Id:</span> {course.courseId}
                      </p>
                      <p className="text-sm text-gray-500 mb-3">
                        <span className="font-medium">Price:</span> <span className="text-indigo-600 font-medium">{course.price} ETH</span>
                      </p>
                    </div>
                    <div className="flex flex-col items-start md:items-end">
                      <Link
                        href={{
                          pathname: '/course',
                          query: { link: course.ipfsLink }
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 transform hover:-translate-y-1"
                      >
                        <span className="mr-2">📖</span>
                        Access Course
                      </Link>
                      <div className="text-sm text-gray-500 mt-2">
                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-md font-medium">
                          <span className="mr-1">✓</span>Owned
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-xl text-gray-600 mb-2">No courses owned yet</p>
              <p className="text-gray-500 mb-6">Purchase some to start learning!</p>
              <a
                href="/courses"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 transform hover:-translate-y-1"
              >
                <span className="mr-2">🔍</span>
                Browse Courses
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
