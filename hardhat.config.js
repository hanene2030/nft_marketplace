// require("@nomiclabs/hardhat-waffle");

// module.exports = {
//   solidity: "0.8.4",
//   paths: {
//     artifacts: "./src/backend/artifacts",
//     sources: "./src/backend/contracts",
//     cache: "./src/backend/cache",
//     tests: "./src/backend/test"
//   },
// };

require("hardhat-tracer");

require("@nomiclabs/hardhat-ethers");


const API_URL = "https://eth-sepolia.g.alchemy.com/v2/ah-4Wq4nc8ulnU-cIiSuBKxWY1wW1kXU"
const PRIVATE_KEY = "cc1b6a0917606bd3923cfa8aabdf7346ef63cba5bf7458423b053a48f3fd4df5"


module.exports = {
  solidity: "0.8.4",
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {},
    sepolia: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  }, paths: {
    artifacts: "./src/backend/artifacts",
    sources: "./src/backend/contracts",
    cache: "./src/backend/cache",
    tests: "./src/backend/test"
  },
}
