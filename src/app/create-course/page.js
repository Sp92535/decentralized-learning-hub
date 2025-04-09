"use client";

import { useState, useRef } from "react";
import { uploadToIPFS } from "@/utils/upload";
import { createCourse } from "@/utils/course_factory";
import { Sidebar } from "@/components/Sidebar/sidebar"; 

export default function CreateCourse() {
  const [courseName, setCourseName] = useState("");
  const [price, setPrice] = useState("");
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => setFiles(Array.from(e.target.files));

  const handleCreate = async () => {
    if (!courseName || !price || files.length === 0) {
      setStatus("⚠️ Please fill all fields and select files.");
      return;
    }
    setStatus("🚀 Uploading files...");
    const { success, ipfsLink, message } = await uploadToIPFS(files);
    if (!success) {
      setStatus(`❌ ${message}`);
      return;
    }
    setStatus("⛓️ Creating Course on Blockchain...");
    const { success: courseSuccess, message: courseMessage } =
      await createCourse(courseName, ipfsLink, price);
    setStatus(
      courseSuccess ? "✅ Course Created Successfully!" : `❌ ${courseMessage}`
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-1 p-8">
        <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border border-gray-200 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-center mb-6">
            <span className="text-green-600 text-3xl mr-2">📚</span>
            <h1 className="text-3xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Create Course
            </h1>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="courseName">
                Course Name
              </label>
              <input
                id="courseName"
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                placeholder="Enter course name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="courseFiles">
                Course Files
              </label>
              <div className="relative">
                <input
                  id="courseFiles"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="courseFiles"
                  className="flex items-center justify-center w-full px-4 py-3 rounded-lg border border-dashed border-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                >
                  <span className="mr-2">📂</span>
                  {files.length ? `${files.length} file(s) selected` : "Choose files"}
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="coursePrice">
                Price (ETH)
              </label>
              <input
                id="coursePrice"
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                placeholder="0.05"
              />
            </div>
            
            {status && (
              <div className={`p-3 rounded-lg text-center ${
                status.includes("✅") ? "bg-green-100 text-green-700" :
                status.includes("❌") ? "bg-red-100 text-red-700" :
                status.includes("⚠️") ? "bg-yellow-100 text-yellow-700" :
                "bg-blue-100 text-blue-700"
              }`}>
                {status}
              </div>
            )}
            
            <button
              onClick={handleCreate}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 transform hover:-translate-y-1"
            >
              <span className="mr-2">⚡</span>
              Upload & Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}