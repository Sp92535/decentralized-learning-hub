import { ethers } from "ethers";
import { getContracts } from "./contracts";


export const registerUser = async (username) => {
    
    try {
        const { courseMarketplace, signer } = await getContracts();

        const tx = await courseMarketplace.registerUser(username); // ✅ Signer already attached
        await tx.wait();

        console.log("User registered successfully!");
        return true;
    } catch (error) {
        console.error("Registration failed:", error);
        return false;
    }
};

export const loginUser = async () => {
    
    try {
        const { courseMarketplace, signer } = await getContracts();

        const userData = await courseMarketplace.loginUser();

        console.log(userData);

        console.log("Login successful!", userData);
        return {
            address: userData[0],
            name: userData[1]
        };

    } catch (error) {
        console.error("Login failed:", error);
        return null;
    }
};


export const createCourse = async (name, ipfsLink, price) => {
    
    try {
        const { courseMarketplace, signer } = await getContracts();

        const tx = await courseMarketplace.createCourse(name, ipfsLink, ethers.parseEther(price));
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
        const { courseMarketplace, signer } = await getContracts();

        const courses = await courseMarketplace.getAllCourses();

        return courses[0].map((_, index) => ({
            courseId: courses[0][index],
            name: courses[1][index],
            price: ethers.formatEther(courses[2][index]), // Convert from Wei to Ether
            instructor: courses[3][index],
        }));
    } catch (error) {
        console.error("Fetching Courses Failed:", error);
        return [];
    }
};

export const buyCourse = async (courseId, price) => {
    
    try {
        const { courseMarketplace, signer } = await getContracts();

        const tx = await courseMarketplace.connect(signer).purchaseCourse(courseId, {
            value: ethers.parseEther(price),
        });
        await tx.wait();
        return true;
    } catch (error) {
        console.error("Buying Course Failed:", error);
        return false;
    }
};

export const getOwnedCourses = async () => {
    
    try {
        const { courseMarketplace, signer } = await getContracts();

        const courses = await courseMarketplace.getCreatedCourses();
        return courses[0].map((_, index) => ({
            courseId: courses[0][index],
            name: courses[1][index],
            price: ethers.formatEther(courses[2][index]), // Convert from Wei to Ether
            instructor: courses[3][index],
            ipfsLink: courses[4][index],
        }));
    } catch (error) {
        console.error("Failed to fetch owned courses:", error);
        return [];
    }
};

export const getBoughtCourses = async () => {
    
    try {
        const { courseMarketplace, signer } = await getContracts();

        const courses = await courseMarketplace.getPurchasedCourses();
        return courses[0].map((_, index) => ({
            courseId: courses[0][index],
            name: courses[1][index],
            price: ethers.formatEther(courses[2][index]), // Convert from Wei to Ether
            instructor: courses[3][index],
            ipfsLink: courses[4][index],
        }));
    } catch (error) {
        console.error("Fetching Bought Courses Failed:", error);
        return [];
    }
};