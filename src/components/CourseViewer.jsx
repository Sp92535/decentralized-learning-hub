"use client";

import { useEffect, useState } from "react";
import StreamViewer from "./StreamViewer"; // Make sure this exists

const CourseViewer = ({ link }) => {
  const [courseData, setCourseData] = useState(null);
  const [selectedUrl, setSelectedUrl] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(link);
      const json = await res.json();
      setCourseData(json);
    };
    fetchData();
  }, [link]);

  const handleSelect = (displayPath) => {
    const startPath = displayPath.substring(displayPath.indexOf("/")); // after first '/'
    const fullUrl = courseData.directoryGatewayUrl + startPath;
    setSelectedUrl(fullUrl);
  };

  if (!courseData) return <p className="text-center p-4">Loading...</p>;

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      {/* Sidebar Buttons */}
      <div className="w-full md:w-1/4 space-y-2">
        {courseData.files.map((file, index) => (
          <button
            key={index}
            onClick={() => handleSelect(file.displayPath)}
            className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-left rounded shadow"
          >
            {file.displayPath?.split("/").pop() || file.originalName}
          </button>
        ))}
      </div>

      {/* Stream Viewer */}
      <div className="flex-1 bg-white shadow-md rounded p-4">
        {selectedUrl ? (
          <StreamViewer link={selectedUrl} />
        ) : (
          <p>Select a file to preview</p>
        )}
      </div>
    </div>
  );
};

export default CourseViewer;
