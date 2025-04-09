"use client";
import { useState, useEffect } from "react";
import { getOwnedCourses } from "@/utils/user_factory";
import { Sidebar } from "@/components/Sidebar/sidebar"; // Import Sidebar

export default function OwnedCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
        setLoading(true);
        try {
            const data = await getOwnedCourses();
            console.log("Fetched courses:", data);

            // If data is a Proxy, extract the actual array
            const extractedData = data?.names ? [...data.names] : [];

            setCourses(extractedData);
        } catch (error) {
            console.error("Error fetching courses:", error);
            setCourses([]); // Ensure state is never undefined/null
        }
        setLoading(false);
    };
    fetchCourses();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-1 p-8">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-2xl border border-gray-200 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-center mb-8">
            <span className="text-blue-600 text-3xl mr-3">📚</span>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Owned Courses
            </h1>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-600 font-medium">Loading your courses...</p>
            </div>
          ) : courses.length > 0 ? (
            <div className="grid gap-4">
              {courses.map((course, index) => (
                <div
                  key={index}
                  className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-200 flex items-center"
                >
                  <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-gray-800 font-medium text-lg">{course}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg mb-4 w-16 h-16 flex items-center justify-center text-3xl">
                📝
              </div>
              <p className="text-gray-600 font-medium mb-2">No courses found</p>
              <p className="text-gray-500 text-sm max-w-md">
                You don't own any courses yet. Explore available courses and add them to your collection.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}