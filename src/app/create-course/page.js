"use client";
import { useState } from "react";
import { createCourse } from "@/utils/course_factory";

export default function CreateCourse() {
    const [courseName, setCourseName] = useState("");
    const [ipfsLink, setIpfsLink] = useState("");
    const [price, setPrice] = useState("");
    const [status, setStatus] = useState("");

    const handleCreate = async () => {
        if (!courseName || !ipfsLink || !price) return;
        setStatus("Creating Course...");
        const { success, message } = await createCourse(courseName, ipfsLink, price);
        setStatus(message);
    };

    return (
        <div>
            <h1>Create Course</h1>
            <input type="text" placeholder="Course Name" value={courseName} onChange={(e) => setCourseName(e.target.value)} />
            <input type="text" placeholder="IPFS Link" value={ipfsLink} onChange={(e) => setIpfsLink(e.target.value)} />
            <input type="text" placeholder="Price (ETH)" value={price} onChange={(e) => setPrice(e.target.value)} />
            <button onClick={handleCreate}>Create</button>
            <p>{status}</p>
        </div>
    );
}
