"use client";
import { buyCourse, getAllCourses } from "@/utils/course_factory";
import { useEffect, useState } from "react";

const CourseList = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            const data = await getAllCourses();
            setCourses(data);
        };
        fetchCourses();
    }, []);

    const handleBuyCourse = async (course) => {
        try {
            const success = await buyCourse(course.address, course.price);
            if (success) {
                alert(`Successfully bought ${course.name}`);
            }
        } catch (error) {
            console.error("Course purchase failed:", error);
            alert("Course purchase failed!");
        }
    };

    return (
        <div>
            <h2>Available Courses</h2>
            {courses.length > 0 ? (
                courses.map((course, index) => (
                    <div key={index}>
                        <p>Address: {course.address}</p>
                        <p>Name: {course.name}</p>
                        <p>IPFS Link: <a href={course.ipfsLink} target="_blank" rel="noopener noreferrer">{course.ipfsLink}</a></p>
                        <p>Price: {course.price} ETH</p>
                        <button onClick={() => handleBuyCourse(course)}>Buy Course</button>
                        <hr />
                    </div>
                ))
            ) : (
                <p>No courses available</p>
            )}
        </div>
    );
};

export default CourseList;
