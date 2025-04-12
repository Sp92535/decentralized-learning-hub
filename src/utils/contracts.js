import { Contract } from "ethers";
import getEthereumProvider from "./provider";
import CourseMarketplaceABI from "./abi/CourseMarketplace.json";

// Deployed contract addresses from Hardhat deployment
const COURSE_MARKETPLACE_ADDRESS = process.env.NEXT_PUBLIC_COURSE_MARKETPLACE_ADDRESS;

export const getContracts = async () => {
  const provider = getEthereumProvider();
  if (!provider) return null;

  const signer = await provider.getSigner(); // ✅ Await signer for ethers v6

  const courseMarketplace = new Contract(
    COURSE_MARKETPLACE_ADDRESS,
    CourseMarketplaceABI.abi,
    signer
  );

  return { courseMarketplace, signer };
};
