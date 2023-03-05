require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

const {PRIVATE_KEY } = process.env;
const {BSCSCAN_API_KEY, SNOWTRACE_API_KEY} = process.env;

module.exports = {
  solidity: {
    version: "0.7.5",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      }
    }
  },
  defaultNetwork: "fuji",
  networks: {
      hardhat: {},
      fuji: {
        url: 'https://api.avax-test.network/ext/bc/C/rpc',
        gas: 1000000000,
        gasPrice: 50000000000,
        chainId: 43113,
        accounts: [`0x${PRIVATE_KEY}`],
        timeout: 600000
      },
      mainnet: {
        url: 'https://api.avax.network/ext/bc/C/rpc',
        gas: 1000000000,
        gasPrice: 30000000000,
        chainId: 43114,
        accounts: [`0x${PRIVATE_KEY}`],
        timeout: 600000
      },
      bsctestnet: {
        url: "https://data-seed-prebsc-1-s1.binance.org:8545",
        chainId: 97,
        gasPrice: 10000000000,
        accounts: [`0x${PRIVATE_KEY}`],
      }
  },
  etherscan:{
    apiKey: SNOWTRACE_API_KEY
  }
};