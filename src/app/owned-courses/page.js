"use client";
import { useState, useEffect } from "react";
import { getOwnedCourses } from "@/utils/user_factory";

export default function OwnedCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            const data = await getOwnedCourses();
            setCourses(data);
            setLoading(false);
        };
        fetchCourses();
    }, []);

    return (
        <div>
            <h1>Owned Courses</h1>
            {loading ? <p>Loading...</p> : (
                courses.length > 0 ? (
                    <ul>
                        {courses.map((course, index) => (
                            <li key={index}>{course}</li>
                        ))}
                    </ul>
                ) : <p>No courses found.</p>
            )}
        </div>
    );
}
