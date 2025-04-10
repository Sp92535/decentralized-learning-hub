"use client";

import { useState, useRef } from "react";
import { uploadToIPFS } from "@/utils/upload";
import { createCourse } from "@/utils/course_factory";
import { Sidebar } from "@/components/Sidebar/sidebar";

export default function CreateCourse() {
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [category, setCategory] = useState("development");
  const [language, setLanguage] = useState("english");
  const [tags, setTags] = useState("");
  const [isPaid, setIsPaid] = useState(true);
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [directoryName, setDirectoryName] = useState("");

  const [files, setFiles] = useState([]);
  const [fileRenames, setFileRenames] = useState({});
  const [removedFiles, setRemovedFiles] = useState([]);
  const [status, setStatus] = useState("");
  const [metaLink, setMetaLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  // ✅ Handle file selection
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...newFiles]);

    // Set default directory name based on first upload if not set
    if (!directoryName && newFiles.length > 0) {
      const path = newFiles[0].webkitRelativePath;
      const dirName = path.split("/")[0];
      setDirectoryName(dirName);
    }
  };

  // ✅ Handle thumbnail selection
  const handleThumbnailChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  // ✅ Toggle remove/add file
  const toggleFile = (file) => {
    if (files.includes(file)) {
      setFiles((prev) => prev.filter((f) => f !== file));
      setRemovedFiles((prev) => [...prev, file]);
    } else {
      setRemovedFiles((prev) => prev.filter((f) => f !== file));
      setFiles((prev) => [...prev, file]);
    }
  };

  // ✅ Handle file rename
  const handleFileRename = (file, newName) => {
    setFileRenames((prev) => ({
      ...prev,
      [file.webkitRelativePath || file.name]: newName,
    }));
  };

  // ✅ Create course logic
  const handleCreate = async () => {
    if (
      !courseName ||
      (!price && isPaid) ||
      files.length === 0 ||
      !courseDescription ||
      !category ||
      !language
    ) {
      setStatus("⚠️ Please fill all required fields and select files.");
      return;
    }

    try {
      setIsLoading(true);
      setStatus("🚀 Uploading files...");

      const actualPrice = isPaid ? price : "0";
      const tagsList = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      const { success, ipfsLink } = await uploadToIPFS(
        files,
        courseName,
        actualPrice,
        directoryName,
        fileRenames,
        courseDescription,
        category,
        language,
        tagsList,
        thumbnail
      );

      if (!success) {
        setStatus(`❌ Upload failed`);
        setIsLoading(false);
        return;
      }

      setStatus("⛓️ Creating Course on Blockchain...");

      const {
        success: courseSuccess,
        message: courseMessage,
        transactionHash,
      } = await createCourse(courseName, ipfsLink, actualPrice);

      if (courseSuccess) {
        setMetaLink(ipfsLink);
        setStatus(`✅ Course created! Tx: ${transactionHash}`);
      } else {
        setStatus(`❌ ${courseMessage}`);
      }
    } catch (error) {
      console.error("Error creating course:", error);
      setStatus(`❌ ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Sidebar />
      <div className="flex flex-col items-center justify-center flex-1 p-8">
        <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-2xl border border-gray-200 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-center mb-6">
            <span className="text-green-600 text-3xl mr-2">📚</span>
            <h1 className="text-3xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Create Course
            </h1>
          </div>

          <div className="space-y-6">
            {/* Course Name */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="courseName"
              >
                Course Name *
              </label>
              <input
                id="courseName"
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                placeholder="Course Name"
                disabled={isLoading}
              />
            </div>

            {/* Course Description */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="courseDescription"
              >
                Course Description *
              </label>
              <textarea
                id="courseDescription"
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                placeholder="Description"
                rows="3"
                disabled={isLoading}
              />
            </div>

            {/* Two Columns for Category and Language */}
            <div className="grid grid-cols-2 gap-4">
              {/* Category Dropdown */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="category"
                >
                  Category *
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                  disabled={isLoading}
                >
                  <option value="development">Development</option>
                  <option value="development">Technology</option>
                  <option value="business">Business</option>
                  <option value="finance">Finance</option>
                  <option value="design">Design</option>
                  <option value="marketing">Marketing</option>
                  <option value="music">Music</option>
                  <option value="photography">Photography</option>
                  <option value="health">Health</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Language Dropdown */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="language"
                >
                  Language *
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                  disabled={isLoading}
                >
                  <option value="english">English</option>
                  <option value="arabic">Hindi</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                  <option value="chinese">Chinese</option>
                  <option value="japanese">Japanese</option>
                  <option value="korean">Korean</option>
                  <option value="arabic">Arabic</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Tags/Keywords */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="tags"
              >
                Tags/Keywords (comma-separated)
              </label>
              <input
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                placeholder="e.g. blockchain, programming, web3"
                disabled={isLoading}
              />
            </div>

            {/* Thumbnail Input */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="courseThumbnail"
              >
                Course Thumbnail
              </label>
              <div className="relative">
                <input
                  id="courseThumbnail"
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  ref={thumbnailInputRef}
                  className="hidden"
                  disabled={isLoading}
                />
                <label
                  htmlFor="courseThumbnail"
                  className="flex items-center justify-center w-full px-4 py-3 rounded-lg border border-dashed border-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                >
                  <span className="mr-2">🖼️</span>
                  {thumbnail ? thumbnail.name : "Choose thumbnail image"}
                </label>
              </div>
            </div>

            {/* Directory Name */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="directoryName"
              >
                Directory Name
              </label>
              <input
                id="directoryName"
                type="text"
                value={directoryName}
                onChange={(e) => setDirectoryName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                placeholder="Directory Name"
                disabled={isLoading}
              />
            </div>

            {/* File Input */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="courseFiles"
              >
                Course Files *
              </label>
              <div className="relative">
                <input
                  id="courseFiles"
                  type="file"
                  multiple
                  webkitdirectory="true"
                  directory="true"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                  disabled={isLoading}
                />
                <label
                  htmlFor="courseFiles"
                  className="flex items-center justify-center w-full px-4 py-3 rounded-lg border border-dashed border-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                >
                  <span className="mr-2">📂</span>
                  {files.length + removedFiles.length
                    ? `${files.length} of ${
                        files.length + removedFiles.length
                      } file(s) selected`
                    : "Choose files"}
                </label>
              </div>
            </div>

            {/* File List with rename capabilities */}
            {files.length + removedFiles.length > 0 && (
              <div className="max-h-40 overflow-y-auto bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800">
                <ul className="list-disc pl-4 space-y-1">
                  {[...files, ...removedFiles].map((file, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <span className="truncate max-w-[150px]">
                          {file.webkitRelativePath || file.name}
                        </span>
                        <span className="mx-2">→</span>
                        <input
                          type="text"
                          value={
                            fileRenames[file.webkitRelativePath || file.name] ||
                            ""
                          }
                          onChange={(e) =>
                            handleFileRename(file, e.target.value)
                          }
                          placeholder="New name (optional)"
                          className="text-xs py-1 px-2 border border-gray-300 rounded w-32"
                          disabled={isLoading || !files.includes(file)}
                        />
                      </div>
                      <button
                        onClick={() => toggleFile(file)}
                        className={`ml-2 text-sm font-semibold ${
                          files.includes(file)
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                        disabled={isLoading}
                      >
                        {files.includes(file) ? "Remove" : "Add"}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Price Toggle & Input */}
            <div>
              <div className="flex items-center mb-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPaid}
                    onChange={() => setIsPaid(!isPaid)}
                    className="sr-only peer"
                    disabled={isLoading}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    {isPaid ? "Paid" : "Free"}
                  </span>
                </label>
              </div>

              {isPaid && (
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor="coursePrice"
                  >
                    Price (ETH) *
                  </label>
                  <input
                    id="coursePrice"
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                    placeholder="Price (ETH)"
                    disabled={isLoading}
                  />
                </div>
              )}
            </div>

            {/* Status Message */}
            {status && (
              <div
                className={`p-3 rounded-lg text-center ${
                  status.includes("✅")
                    ? "bg-green-100 text-green-700"
                    : status.includes("❌")
                    ? "bg-red-100 text-red-700"
                    : status.includes("⚠️")
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {status}
              </div>
            )}

            {/* Metadata Link */}
            {metaLink && (
              <div className="p-4 bg-gray-100 rounded-lg text-sm text-gray-800 border border-gray-200">
                <p className="font-semibold">📦 Course Metadata IPFS Link:</p>
                <a
                  href={metaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 break-all hover:underline"
                >
                  {metaLink}
                </a>
                <p className="mt-2 text-xs text-gray-500">
                  This link contains your course's metadata and uploaded files.
                </p>
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleCreate}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 transform hover:-translate-y-1"
              disabled={isLoading}
            >
              <span className="mr-2">⚡</span>
              {isLoading ? "Processing..." : "Upload & Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
