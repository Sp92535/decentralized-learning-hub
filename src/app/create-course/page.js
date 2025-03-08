"use client";
import { useState } from "react";
import { uploadToIPFS } from "@/utils/upload";
import { createCourse } from "@/utils/course_factory";

export default function CreateCourse() {
    const [courseName, setCourseName] = useState("");
    const [price, setPrice] = useState("");
    const [files, setFiles] = useState([]);
    const [status, setStatus] = useState("");

    const handleFileChange = (e) => setFiles(Array.from(e.target.files));

    const handleCreate = async () => {
        if (!courseName || !price || files.length === 0) {
            setStatus("Please fill all fields and select files.");
            return;
        }

        setStatus("Uploading files...");
        const { success, ipfsLink, message } = await uploadToIPFS(files);

        if (!success) {
            setStatus(message);
            return;
        }

        setStatus("Creating Course on Blockchain...");
        const { success: courseSuccess, message: courseMessage } = await createCourse(courseName, ipfsLink, price);

        setStatus(courseMessage);
    };

    return (
        <div>
            <h1>Create Course</h1>
            <input type="text" placeholder="Course Name" value={courseName} onChange={(e) => setCourseName(e.target.value)} />
            <input type="file" multiple onChange={handleFileChange} />
            <input type="text" placeholder="Price (ETH)" value={price} onChange={(e) => setPrice(e.target.value)} />
            <button onClick={handleCreate}>Upload & Create</button>
            <p>{status}</p>
        </div>
    );
}
