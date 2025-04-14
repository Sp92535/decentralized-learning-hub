"use client";

import { useEffect, useState } from "react";
import StreamViewer from "./StreamViewer"; // Make sure this exists

const CourseViewer = ({ link }) => {
  const [courseData, setCourseData] = useState(null);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(link);
      const json = await res.json();
      setCourseData(json);
    };
    fetchData();
  }, [link]);

  const handleSelect = (displayPath, fileName) => {
    const startPath = displayPath.substring(displayPath.indexOf("/")); // after first '/'
    const fullUrl = courseData.directoryGatewayUrl + startPath;
    setSelectedUrl(fullUrl);
    setSelectedFile(fileName);
  };

  if (!courseData) return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-blue-200 mb-3"></div>
        <p className="text-blue-600 font-medium">Loading course content...</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row gap-6 p-2">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-1/4 bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h3 className="text-lg font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 px-2">
          Course Materials
        </h3>

        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
          {courseData.files.map((file, index) => (
            <button
              key={index}
              onClick={() => handleSelect(file.displayPath, file.originalName)}
              className={`w-full px-4 py-3 text-left rounded-lg transition-all duration-200 flex items-center ${
                selectedUrl && file.originalName === selectedFile
                  ? "bg-blue-100 border-l-4 border-blue-500 text-blue-800"
                  : "bg-white hover:bg-gray-100 border border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="mr-2">
                {file.originalName.endsWith(".pdf") ? "📄" : 
                 file.originalName.endsWith(".mp4") ? "🎥" :
                 file.originalName.endsWith(".mp3") ? "🎧" :
                 file.originalName.endsWith(".jpg") || file.originalName.endsWith(".png") ? "🖼️" : "📝"}
              </span>
              <span className="font-medium truncate">{file.originalName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Viewer */}
      <div className="flex-1">
        <div className="bg-white shadow-lg rounded-xl border border-gray-200 h-full">
          {selectedFile && (
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-xl">
              <h4 className="font-medium text-gray-700 flex items-center">
                <span className="mr-2">
                  {selectedFile.endsWith(".pdf") ? "📄" : 
                   selectedFile.endsWith(".mp4") ? "🎥" :
                   selectedFile.endsWith(".mp3") ? "🎧" :
                   selectedFile.endsWith(".jpg") || selectedFile.endsWith(".png") ? "🖼️" : "📝"}
                </span>
                {selectedFile}
              </h4>
            </div>
          )}
          
          <div className="p-4">
            {selectedUrl ? (
              <StreamViewer link={selectedUrl} />
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="text-6xl mb-4">👈</div>
                <p className="text-gray-600">Select a file from the sidebar to begin</p>
                <p className="text-gray-400 text-sm mt-2">Course materials will be displayed here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseViewer;