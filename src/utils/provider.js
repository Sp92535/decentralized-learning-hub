import { BrowserProvider } from "ethers";

const getEthereumProvider = () => {
    if (typeof window !== "undefined" && window.ethereum) {
        return new BrowserProvider(window.ethereum);
    } else {
        console.error("Metamask not detected");
        return null;
    }
};

export default getEthereumProvider;
