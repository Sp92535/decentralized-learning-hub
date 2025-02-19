import { Contract } from "ethers";
import getEthereumProvider from "./provider";
import UserFactoryABI from "./UserFactory.json";
import CourseFactoryABI from "./CourseFactory.json";

// Deployed contract addresses from Hardhat deployment
const USER_FACTORY_ADDRESS = "0xd2bB87aa9B274F3F5E7fB81C402A1bf4448d4eC0";
const COURSE_FACTORY_ADDRESS = "0xc517f6AE6fdA5Fc7948D5D6fd81cA6Baf01CEFCb";

export const getContracts = async () => {
  const provider = getEthereumProvider();
  if (!provider) return null;

  const signer = await provider.getSigner(); // ✅ Await signer for ethers v6

  const userFactory = new Contract(
    USER_FACTORY_ADDRESS,
    UserFactoryABI.abi,
    signer
  );

  const courseFactory = new Contract(
    COURSE_FACTORY_ADDRESS,
    CourseFactoryABI.abi,
    signer
  );

  return { userFactory, courseFactory, signer };
};

export const registerUser = async (username) => {
  try {
    const { userFactory, signer } = await getContracts();
    if (!userFactory || !signer) return;

    const tx = await userFactory.register(username); // ✅ Signer already attached
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
    const { userFactory, signer } = await getContracts();
    if (!userFactory) return;

    // Call the contract function to check if the user exists
    const userData = await userFactory.login();
    
    console.log(userData);
    
    
    // if (userData.userAddress === "0x0000000000000000000000000000000000000000") {
    //   console.error("User not registered!");
    //   return null;
    // }

    console.log("Login successful!", userData);
    return userData;
  } catch (error) {
    console.error("Login failed:", error);
    return null;
  }
};
