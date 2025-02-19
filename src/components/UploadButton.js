"use client";
import { useState, useRef } from "react";
import FormData from "form-data";
import axios from "axios";

export default function UploadButton() {
  const [files, setFiles] = useState([]);
  const [removedFiles, setRemovedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [jsonLink, setJsonLink] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files)]);
  };

  const toggleFile = (file) => {
    if (files.includes(file)) {
      setFiles(files.filter((f) => f !== file));
      setRemovedFiles([...removedFiles, file]);
    } else {
      setRemovedFiles(removedFiles.filter((f) => f !== file));
      setFiles([...files, file]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      alert("Select at least one file");
      return;
    }

    setLoading(true);
    setUploadComplete(false);
    setJsonLink("");

    // mera key and secret hai env me chahiye to bta
    const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
    const pinataApiSecret = process.env.NEXT_PUBLIC_PINATA_API_SECRET;
    console.log(pinataApiKey);
    console.log(pinataApiSecret);
    try {
      const formData = new FormData();
      files.forEach((file) =>
        formData.append("file", file, file.webkitRelativePath || file.name)
      );

      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataApiSecret,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const directoryHash = response.data.IpfsHash;
      const directoryLink = `https://gateway.pinata.cloud/ipfs/${directoryHash}/`;

      const fileLinks = files.map((file) => ({
        name: file.name,
        path: file.webkitRelativePath,
        link: `${directoryLink}${file.webkitRelativePath.split("/").pop()}`,
      }));

      const jsonData = JSON.stringify({
        directory: directoryLink,
        files: fileLinks,
      });

      const jsonBlob = new Blob([jsonData], { type: "application/json" });
      const jsonFile = new File([jsonBlob], "metadata.json");
      const jsonFormData = new FormData();
      jsonFormData.append("file", jsonFile);

      const jsonResponse = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        jsonFormData,
        {
          headers: {
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataApiSecret,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const jsonIpfsHash = jsonResponse.data.IpfsHash;
      setJsonLink(`https://gateway.pinata.cloud/ipfs/${jsonIpfsHash}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setUploadComplete(true);
      setFiles([]);
      setRemovedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-semibold text-center mb-2">
          Upload Directory
        </h1>
        {loading && (
          <div className="text-center text-blue-500">Uploading...</div>
        )}
        {uploadComplete && !loading && (
          <div className="text-center text-green-500 font-semibold">
            <p>Upload Complete!</p>
            <p>
              <a
                href={jsonLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View JSON File
              </a>
            </p>
          </div>
        )}
        <form className="space-y-4">
          <input
            type="file"
            multiple
            webkitdirectory="true"
            directory="true"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-gray-700">
            Selected Files: {files.length}/{files.length + removedFiles.length}
          </p>
          {files.length + removedFiles.length > 0 && (
            <ul className="list-disc pl-5 text-gray-700">
              {[...files, ...removedFiles].map((file, index) => (
                <li key={index} className="flex justify-between items-center">
                  {file.webkitRelativePath || file.name}
                  <button
                    type="button"
                    onClick={() => toggleFile(file)}
                    className={
                      files.includes(file)
                        ? "text-red-500 hover:underline ml-2"
                        : "text-green-500 hover:underline ml-2"
                    }
                  >
                    {files.includes(file) ? "Remove" : "Add"}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit Directory
          </button>
        </form>
      </div>
    </main>
  );
}
