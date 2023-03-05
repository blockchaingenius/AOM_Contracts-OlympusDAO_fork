# Basic Sample Hardhat Project for Avalanche
/////////////Configuration/////////////////
npm init
npm install --save-dev hardhat
npx hardhat
npm install dotenv --save
npm install --save-dev @nomiclabs/hardhat-ethers "ethers@^5.0.0" 
npm install --save-dev @nomiclabs/hardhat-etherscan

make .env file to set environment constants.
///////////////////////////////////////////

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```
