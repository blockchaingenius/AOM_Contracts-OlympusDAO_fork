const { ethers } = require("hardhat");

async function main() {

  const DAO = "0x70ce6821b7c38c8878ca971b4718c957f0566a4f";
  const owner_address = "0x70ce6821b7c38c8878ca971b4718c957f0566a4f";
  const ADDRESS_0 = "0x0000000000000000000000000000000000000000";

  const DAI_ADDRESS = "0x6341f5C463017E98a3FB9a5d59CC898a5443e65B";
  const USDC_ADDRESS = "0x9BF72e2A50f203662a0eDE314C68818708d371eD";
  const MIM_ADDRESS = "0xa6d68596564079D1f91c108c40bB72E6b03f152a";
  var DAILP_ADDRESS = "0xB24F5AB557d99D58E4437d225BF71F2C890c790D";
  var USDCLP_ADDRESS = "0x81CC2Fe481226a1594a603eBc24F65Adf1a0F37F";

  //Initialize for Create JoeLP
  const JOEROUTER_JSON = require("../3rdparty/joerouterv2.json");
  const JOEFACTORY_JSON = require("../3rdparty/joefactory.json");
  const [owner] = await ethers.getSigners();
  const JoeRouter = new ethers.Contract(JOEROUTER_JSON.address_test,JOEROUTER_JSON.abi, owner);
  const JoeFactory = new ethers.Contract(JOEFACTORY_JSON.address_test, JOEFACTORY_JSON.abi, owner);
//  const ret = await JoeRouter.factory();
//  console.log("Factory:", ret);

  // Start deployment, returning a promise that resolves to a contract object
  //AOM Token
  const AOM_FACTORY = await ethers.getContractFactory("AOMToken");
  const AOM_PARAMS = [];
  const AOM_CONTRACT = await AOM_FACTORY.deploy(...AOM_PARAMS);
  await AOM_CONTRACT.deployed();
  console.log("AOM_ADDRESS:", AOM_CONTRACT.address);

  //DAILP
  var tx = await JoeFactory.createPair(AOM_CONTRACT.address, DAI_ADDRESS);
  var ret = await tx.wait();
//  console.log("retval:",ret);
  DAILP_ADDRESS = ret.events[0].args[2];
  console.log("DAILP_ADDRESS:", DAILP_ADDRESS);
  // console.log("ret_log_data:",ret.logs[0].data);
  // console.log("ret_log_topics:",ret.logs[0].topics);
  // console.log("ret_event_topics:",ret.events[0].topics);
  // console.log("ret_event_args:", ret.events[0].args);

  //USDCLP
  tx = await JoeFactory.createPair(AOM_CONTRACT.address, USDC_ADDRESS);
  ret = await tx.wait();
  USDCLP_ADDRESS = ret.events[0].args[2];
  console.log("USDCLP_ADDRESS:", USDCLP_ADDRESS);

  //SAOM Token
  const SAOM_FACTORY = await ethers.getContractFactory("sAOMToken");
  const SAOM_PARAMS = [];
  const SAOM_CONTRACT = await SAOM_FACTORY.deploy(...SAOM_PARAMS);
  await SAOM_CONTRACT.deployed();
  console.log("SAOM_ADDRESS:", SAOM_CONTRACT.address);

  //wsAOM Token
  const WSAOM_FACTORY = await ethers.getContractFactory("wsAOM");
  const WSAOM_PARAMS = [SAOM_CONTRACT.address];
  const WSAOM_CONTRACT = await WSAOM_FACTORY.deploy(...WSAOM_PARAMS);
  await WSAOM_CONTRACT.deployed();
  console.log("WSAOM_ADDRESS:", WSAOM_CONTRACT.address);

  //Staking Contract
  const STAKING_FACTORY = await ethers.getContractFactory("AOMStaking");
  const STAKING_PARAMS = [AOM_CONTRACT.address, SAOM_CONTRACT.address, 28800, 0, 5317470];
  const STAKING_CONTRACT = await STAKING_FACTORY.deploy(...STAKING_PARAMS);
  await STAKING_CONTRACT.deployed();
  console.log("STAKING_ADDRESS:", STAKING_CONTRACT.address);

  //StakingHelper Contract
  const STAKINGHELPER_FACTORY = await ethers.getContractFactory("StakingHelper");
  const STAKINGHELPER_PARAMS = [STAKING_CONTRACT.address, SAOM_CONTRACT.address];
  const STAKINGHELPER_CONTRACT = await STAKINGHELPER_FACTORY.deploy(...STAKINGHELPER_PARAMS);
  await STAKINGHELPER_CONTRACT.deployed();
  console.log("STAKINGHELPER_ADDRESS:", STAKINGHELPER_CONTRACT.address);

  //StakingWarmup Contract
  const STAKINGWARMUP_FACTORY = await ethers.getContractFactory("StakingWarmup");
  const STAKINGWARMUP_PARAMS = [STAKING_CONTRACT.address, SAOM_CONTRACT.address];
//  const STAKINGWARMUP_PARAMS = ["0xaa83aF1b63b87d572b02b052abFde4731c710A5F", "0x1eC39611A30432CaD0dF6AAB94bE1Cb247f8BF0C"];
  const STAKINGWARMUP_CONTRACT = await STAKINGWARMUP_FACTORY.deploy(...STAKINGWARMUP_PARAMS);
  await STAKINGWARMUP_CONTRACT.deployed();
  console.log("STAKINGWARMUP_ADDRESS:", STAKINGWARMUP_CONTRACT.address);

  //AOMBondingCalculator Contract
  const AOMBONDINGCALCULATOR_FACTORY = await ethers.getContractFactory("AOMBondingCalculator");
  const AOMBONDINGCALCULATOR_PARAMS = [AOM_CONTRACT.address];
  const AOMBONDINGCALCULATOR_CONTRACT = await AOMBONDINGCALCULATOR_FACTORY.deploy(...AOMBONDINGCALCULATOR_PARAMS);
  await AOMBONDINGCALCULATOR_CONTRACT.deployed();
  console.log("BONDINGCALCULATOR_ADDRESS:", AOMBONDINGCALCULATOR_CONTRACT.address);

  //AOMTreasury Contract
  const AOMTREASURY_FACTORY = await ethers.getContractFactory("AOMTreasury");
  const AOMTREASURY_PARAMS = [AOM_CONTRACT.address, DAI_ADDRESS, 0];
  const AOMTREASURY_CONTRACT = await AOMTREASURY_FACTORY.deploy(...AOMTREASURY_PARAMS);
  await AOMTREASURY_CONTRACT.deployed();
  console.log("TREASURY_ADDRESS:", AOMTREASURY_CONTRACT.address);

  //MigrateDistributor Contract
  const DISTRIBUTOR_FACTORY = await ethers.getContractFactory("MigrateDistributor");
  const DISTRIBUTOR_PARAMS = [AOMTREASURY_CONTRACT.address, AOM_CONTRACT.address,28800, 5346270, STAKING_CONTRACT.address, SAOM_CONTRACT.address];
  const DISTRIBUTOR_CONTRACT = await DISTRIBUTOR_FACTORY.deploy(...DISTRIBUTOR_PARAMS);
  await DISTRIBUTOR_CONTRACT.deployed();
  console.log("DISTRIBUTOR_ADDRESS:", DISTRIBUTOR_CONTRACT.address);

  //RedeemHelper Contract
  const REDEEMHELPER_FACTORY = await ethers.getContractFactory("RedeemHelper");
  const REDEEMHELPER_PARAMS = [];
  const REDEEMHELPER_CONTRACT = await REDEEMHELPER_FACTORY.deploy(...REDEEMHELPER_PARAMS);
  await REDEEMHELPER_CONTRACT.deployed();
  console.log("REDEEMHELPER_ADDRESS:", REDEEMHELPER_CONTRACT.address);

  //Aggregator Contract
  const AGGREGATOR_FACTORY = await ethers.getContractFactory("Aggregator");
  const AGGREGATOR_PARAMS = [];
  const AGGREGATOR_CONTRACT = await AGGREGATOR_FACTORY.deploy(...AGGREGATOR_PARAMS);
  await AGGREGATOR_CONTRACT.deployed();
  console.log("AGGREAGTOR_ADDRESS:", AGGREGATOR_CONTRACT.address);

  //CirculatingSupply Contract
  const CIRCULATING_FACTORY = await ethers.getContractFactory("CirculatingSupply");
  const CIRCULATING_PARAMS = [owner_address]; //owner address
  const CIRCULATING_CONTRACT = await CIRCULATING_FACTORY.deploy(...CIRCULATING_PARAMS);
  await CIRCULATING_CONTRACT.deployed();
  console.log("CIRCULATING_ADDRESS:", CIRCULATING_CONTRACT.address);

  //BackingCalculator Contract
  const BACKINGCALCULATOR_FACTORY = await ethers.getContractFactory("BackingCalculator");
  const BACKINGCALCULATOR_PARAMS = [];
  const BACKINGCALCULATOR_CONTRACT = await BACKINGCALCULATOR_FACTORY.deploy(...BACKINGCALCULATOR_PARAMS);
  await BACKINGCALCULATOR_CONTRACT.deployed();
  console.log("BACKINGCALCULATOR_ADDRESS:", BACKINGCALCULATOR_CONTRACT.address);

  //BPHWithPremium Contract
  const BPHWITHPREMIUM_FACTORY = await ethers.getContractFactory("BPHWithPremium");
  const BPHWITHPREMIUM_PARAMS = [BACKINGCALCULATOR_CONTRACT.address];
  const BPHWITHPREMIUM_CONTRACT = await BPHWITHPREMIUM_FACTORY.deploy(...BPHWITHPREMIUM_PARAMS);
  await BPHWITHPREMIUM_CONTRACT.deployed();
  console.log("BPHWITHPREMIUM_ADDRESS:", BPHWITHPREMIUM_CONTRACT.address);

  //BondPriceHelper Contract
  const PRICEHELPER_FACTORY = await ethers.getContractFactory("BondPriceHelper");
  const PRICEHELPER_PARAMS = [owner_address];  //realowner address
  const PRICEHELPER_CONTRACT = await PRICEHELPER_FACTORY.deploy(...PRICEHELPER_PARAMS);
  await PRICEHELPER_CONTRACT.deployed();
  console.log("PRICEHELPER_ADDRESS:", PRICEHELPER_CONTRACT.address);

  /*
  AOM_CONTRACT = {address: "0x5D2D0eFB091DBE304BA73D3De7d90ca8C5d09409"};
  AOMTREASURY_CONTRACT = {address: "0xA6e639e2A1b680caa319560bC33E5bb877B01111"};
  BACKINGCALCULATOR_CONTRACT = {address: "0x2DfC036edDdF79A3682Ca6188d2752511a912b82"};
  SAOM_CONTRACT = {address: "0x7A8138BDA2A9Daa3cd20E8854192971d0a8E536f"};
  AOMBONDINGCALCULATOR_CONTRACT = {address: "0x56026B6F1b4d2E0f3e765F2e230C8Fff2c1ACB1C"};
  */

  const BONDDEPOSITORY_FACTORY = await ethers.getContractFactory("AOMBondDepository");
  let BONDDEPOSITORY_PARAMS = ["name", AOM_CONTRACT.address, 0, 18, AOMTREASURY_CONTRACT.address, DAO, BPHWITHPREMIUM_CONTRACT.address, ADDRESS_0];
  let BONDDEPOSITORY_CONTRACTS = [0,0,0,0,0];

  const BONDSTAKEDEPOSITORY_FACTORY = await ethers.getContractFactory("AOMBondStakeDepository");
  let BONDSTAKEDEPOSITORY_PARAMS = ["name", AOM_CONTRACT.address,SAOM_CONTRACT.address, 0, 18, AOMTREASURY_CONTRACT.address, DAO, BPHWITHPREMIUM_CONTRACT.address, ADDRESS_0];
  let BONDSTAKEDEPOSITORY_CONTRACTS = [0,0,0,0,0];

  const names = ["DAI", "USDC", "MIM", "DAILP", "USDCLP"];
  const depositAddresses = [DAI_ADDRESS, USDC_ADDRESS, MIM_ADDRESS, DAILP_ADDRESS, USDCLP_ADDRESS];

  for( let i = 0; i < 5; i++)
  {
    BONDDEPOSITORY_PARAMS[0] = names[i] + "_11_bond";
    BONDDEPOSITORY_PARAMS[2] = depositAddresses[i];
//    console.log(BONDDEPOSITORY_PARAMS);
    BONDSTAKEDEPOSITORY_PARAMS[0] = names[i] + "_44_bond";
    BONDSTAKEDEPOSITORY_PARAMS[3] = depositAddresses[i];
    
    if(i == 1){
      BONDDEPOSITORY_PARAMS[3] = 9;
      BONDSTAKEDEPOSITORY_PARAMS[4] = 9;
    }
    else{
      BONDDEPOSITORY_PARAMS[3] = 18;
      BONDSTAKEDEPOSITORY_PARAMS[4] = 18;
    }
    if(i > 2){
      BONDDEPOSITORY_PARAMS[7] = AOMBONDINGCALCULATOR_CONTRACT.address;
      BONDSTAKEDEPOSITORY_PARAMS[8] = AOMBONDINGCALCULATOR_CONTRACT.address;
    }
    BONDDEPOSITORY_CONTRACTS[i] = await BONDDEPOSITORY_FACTORY.deploy(...BONDDEPOSITORY_PARAMS);
    await BONDDEPOSITORY_CONTRACTS[i].deployed();
    console.log(names[i],"_BONDDEPOSITORY_ADDRESS:", BONDDEPOSITORY_CONTRACTS[i].address);

    BONDSTAKEDEPOSITORY_CONTRACTS[i] = await BONDSTAKEDEPOSITORY_FACTORY.deploy(...BONDSTAKEDEPOSITORY_PARAMS);
    await BONDSTAKEDEPOSITORY_CONTRACTS[i].deployed();
    console.log(names[i],"_BONDSTAKEDEPOSITORY_ADDRESS:", BONDSTAKEDEPOSITORY_CONTRACTS[i].address);

//    await hre.run("verify:verify", {address: BONDDEPOSITORY_CONTRACTS[i].address, constructorArguments: BONDDEPOSITORY_PARAMS});
//    await hre.run("verify:verify", {address: BONDSTAKEDEPOSITORY_CONTRACTS[i].address, constructorArguments: BONDSTAKEDEPOSITORY_PARAMS});
  }

  // await hre.run("verify:verify", {address: AOM_CONTRACT.address, constructorArguments: AOM_PARAMS});
  // await hre.run("verify:verify", {address: SAOM_CONTRACT.address, constructorArguments: SAOM_PARAMS});
  // await hre.run("verify:verify", {address: WSAOM_CONTRACT.address, constructorArguments: WSAOM_PARAMS});
  // await hre.run("verify:verify", {address: STAKING_CONTRACT.address, constructorArguments: STAKING_PARAMS});
  // await hre.run("verify:verify", {address: STAKINGHELPER_CONTRACT.address , constructorArguments: STAKINGHELPER_PARAMS});
  await hre.run("verify:verify", {address: STAKINGWARMUP_CONTRACT.address , constructorArguments: STAKINGWARMUP_PARAMS});
  // await hre.run("verify:verify", {address: AOMBONDINGCALCULATOR_CONTRACT.address , constructorArguments: AOMBONDINGCALCULATOR_PARAMS});
  await hre.run("verify:verify", {address: AOMTREASURY_CONTRACT.address , constructorArguments: AOMTREASURY_PARAMS});
  await hre.run("verify:verify", {address: DISTRIBUTOR_CONTRACT.address , constructorArguments: DISTRIBUTOR_PARAMS});
  await hre.run("verify:verify", {address: REDEEMHELPER_CONTRACT.address , constructorArguments: REDEEMHELPER_PARAMS});
  // await hre.run("verify:verify", {address: AGGREGATOR_CONTRACT.address , constructorArguments: AGGREGATOR_PARAMS});
  // await hre.run("verify:verify", {address: CIRCULATING_CONTRACT.address , constructorArguments: CIRCULATING_PARAMS});
  // await hre.run("verify:verify", {address: BACKINGCALCULATOR_CONTRACT.address , constructorArguments: BACKINGCALCULATOR_PARAMS});
  await hre.run("verify:verify", {address: BPHWITHPREMIUM_CONTRACT.address, constructorArguments: BPHWITHPREMIUM_PARAMS});
  await hre.run("verify:verify", {address: PRICEHELPER_CONTRACT.address , constructorArguments: PRICEHELPER_PARAMS});

  await hre.run("verify:verify", {address: BONDDEPOSITORY_CONTRACTS[4].address, constructorArguments: BONDDEPOSITORY_PARAMS});
  await hre.run("verify:verify", {address: BONDSTAKEDEPOSITORY_CONTRACTS[4].address, constructorArguments: BONDSTAKEDEPOSITORY_PARAMS});

}
 
 main()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });