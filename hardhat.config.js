import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";
import "@nomicfoundation/hardhat-ignition";

/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      url: "http://127.0.0.1:8545", // Ganache RPC URL
      accounts: [
        process.env.PRIVATE_KEY, 
      ],
    },
  },
};

export default config;
