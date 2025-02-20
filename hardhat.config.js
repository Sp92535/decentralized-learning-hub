import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";
import "@nomicfoundation/hardhat-ignition";

/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  solidity: "0.8.17",
  networks: {
    ganache: {
      url: "http://127.0.0.1:8545", // Ganache RPC URL
      accounts: [
        process.env.PRIVATE_KEY_1, 
        // process.env.PRIVATE_KEY_2
      ],
    },
  },
};

export default config;
