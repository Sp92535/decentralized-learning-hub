import { Contract } from "ethers";
import getEthereumProvider from "./provider";
import UserFactoryABI from "./abi/UserFactory.json";
import CourseFactoryABI from "./abi/CourseFactory.json";

// Deployed contract addresses from Hardhat deployment
const USER_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_USER_FACTORY_ADDRESS;
const COURSE_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_COURSE_FACTORY_ADDRESS;

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
