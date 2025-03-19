"use client";

import { useState, useRef } from "react";
import { uploadToIPFS } from "@/utils/upload";
import { createCourse } from "@/utils/course_factory";

export default function CreateCourse() {
  const [courseName, setCourseName] = useState("");
  const [price, setPrice] = useState("");
  const [files, setFiles] = useState([]);
  const [removedFiles, setRemovedFiles] = useState([]);
  const [status, setStatus] = useState("");
  const [metaLink, setMetaLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // ✅ Handle File Selection
  const handleFileChange = (e) => {
    setFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files)]);
  };

  // ✅ Toggle File Removal/Addition
  const toggleFile = (file) => {
    if (files.includes(file)) {
      setFiles(files.filter((f) => f !== file));
      setRemovedFiles([...removedFiles, file]);
    } else {
      setRemovedFiles(removedFiles.filter((f) => f !== file));
      setFiles([...files, file]);
    }
  };

  // ✅ Handle Course Creation
  const handleCreate = async () => {
    if (!courseName || !price || files.length === 0) {
      setStatus("Please fill all fields and select files.");
      return;
    }

    try {
      setIsLoading(true);
      setStatus("Uploading files to IPFS...");

      const { success, ipfsLink, gatewayLink, message } = await uploadToIPFS(
        files
      );

      if (!success) {
        setStatus(message);
        setIsLoading(false);
        return;
      }

      setMetaLink(gatewayLink);
      setStatus("Creating Course on Blockchain...");

      const {
        success: courseSuccess,
        message: courseMessage,
        transactionHash,
      } = await createCourse(courseName, ipfsLink, price);

      if (courseSuccess) {
        setStatus(
          `Course created successfully! Transaction: ${transactionHash}`
        );
      } else {
        setStatus(`Failed to create course: ${courseMessage}`);
      }
    } catch (error) {
      console.error("Course creation error:", error);
      setStatus(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Course</h1>
      <input
        type="text"
        placeholder="Course Name"
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
        className="w-full border px-3 py-2 mb-4 rounded"
        disabled={isLoading}
      />
      <input
        type="file"
        multiple
        webkitdirectory="true"
        directory="true"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="w-full border px-3 py-2 mb-4 rounded"
        disabled={isLoading}
      />
      <input
        type="text"
        placeholder="Price (ETH)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full border px-3 py-2 mb-4 rounded"
        disabled={isLoading}
      />
      <p className="text-gray-700 mb-4">
        Selected Files: {files.length}/{files.length + removedFiles.length}
      </p>
      {files.length + removedFiles.length > 0 && (
        <div className="max-h-40 overflow-y-auto mb-4">
          <ul className="list-disc pl-5">
            {[...files, ...removedFiles].map((file, index) => (
              <li
                key={index}
                className="flex justify-between items-center text-sm mb-1"
              >
                <span className="truncate max-w-xs">
                  {file.webkitRelativePath || file.name}
                </span>
                <button
                  onClick={() => toggleFile(file)}
                  className={
                    files.includes(file)
                      ? "text-red-500 ml-2"
                      : "text-green-500 ml-2"
                  }
                  disabled={isLoading}
                >
                  {files.includes(file) ? "Remove" : "Add"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        onClick={handleCreate}
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Upload & Create"}
      </button>
      <p className="text-center text-blue-500 mt-4">{status}</p>
      {metaLink && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          {metaLink && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <p className="font-semibold">Course Metadata IPFS Link:</p>
              <a
                href={metaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 break-all hover:underline text-sm"
              >
                {metaLink}
              </a>
              <p className="mt-2 text-xs text-gray-500">
                Note: This link points to your course metadata and can be used
                to access your course content.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
