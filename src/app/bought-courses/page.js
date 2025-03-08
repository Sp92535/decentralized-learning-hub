"use client";
import { useEffect, useState } from "react";
import { getAllCourses } from "@/utils/course_factory";
import { getBoughtCourses } from "@/utils/user_factory";

const BoughtCourses = () => {
    const [courses, setCourses] = useState([]);
    const [allCourses, setAllCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            const bought = await getBoughtCourses();
            const all = await getAllCourses();

            // Filter only the courses that were bought
            const boughtCourses = all.filter(course => bought.includes(course.address));
            setCourses(boughtCourses);
        };
        fetchCourses();
    }, []);

    return (
        <div>
            <h2>Bought Courses</h2>
            {courses.length > 0 ? (
                courses.map((course, index) => (
                    <div key={index}>
                        <p>Address: {course.address}</p>
                        <p>Name: {course.name}</p>
                        <p>IPFS Link: <a href={course.ipfsLink} target="_blank" rel="noopener noreferrer">{course.ipfsLink}</a></p>
                        <p>Price: {course.price} ETH</p>
                        <hr />
                    </div>
                ))
            ) : (
                <p>No courses bought yet</p>
            )}
        </div>
    );
};

export default BoughtCourses;
