import { getContracts } from "./contracts";
import { ethers } from "ethers";

export const createCourse = async (name, ipfsLink, price) => {
    try {
        const { courseFactory, signer } = await getContracts();
        const tx = await courseFactory.createCourse(name, ipfsLink, ethers.parseEther(price));
        const transactionHash = tx.hash;
        await tx.wait();
        return {
            success: true,
            message: "Course Created Successfully!",
            transactionHash,
        };
    } catch (error) {
        console.error("Course Creation Failed:", error);
        return {
            success: false,
            message: "Course Creation Failed.",
            transactionHash: null,
        };
    }
};

export const getAllCourses = async () => {
    try {
        const { courseFactory } = await getContracts();
        const courses = await courseFactory.getAllCourses();

        return courses[0].map((_, index) => ({
            address: courses[0][index],
            name: courses[1][index],
            ipfsLink: courses[2][index],
            price: ethers.formatEther(courses[3][index]), // Convert from Wei to Ether
        }));
    } catch (error) {
        console.error("Fetching Courses Failed:", error);
        return [];
    }
};

export const buyCourse = async (courseAddress, price) => {
    try {
        const { courseFactory, signer } = await getContracts();
        const tx = await courseFactory.connect(signer).buyCourse(courseAddress, {
            value: ethers.parseEther(price),
        });
        await tx.wait();
        return true;
    } catch (error) {
        console.error("Buying Course Failed:", error);
        return false;
    }
};