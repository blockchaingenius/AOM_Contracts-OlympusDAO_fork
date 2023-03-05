const { ethers } = require("hardhat");

var addresses = {

    DAI_ADDRESS: "0x6341f5C463017E98a3FB9a5d59CC898a5443e65B",
    USDC_ADDRESS: "0x9BF72e2A50f203662a0eDE314C68818708d371eD",
    MIM_ADDRESS: "0xa6d68596564079D1f91c108c40bB72E6b03f152a",
    DAILP_ADDRESS: "0x8740a89657C9756b451eb214aecb4ca81C310a43",
    USDCLP_ADDRESS: "0x3C1A0433D093B6FF58F75991db725f356B28E4AA",
    
    DAI_BONDDEPOSITORY_ADDRESS: "0x88F43086d6bA8163b8aFb398907aFB6E55a4CCce",
    DAI_BONDSTAKEDEPOSITORY_ADDRESS: "0x040471a82d30a2e7d57F2540CD0B44988DBE440d",
    USDC_BONDDEPOSITORY_ADDRESS: "0x41f17E12a931eF12aF1c30679eb229c6A98083D8",
    USDC_BONDSTAKEDEPOSITORY_ADDRESS: "0x3490Bf477D0B407687988C5eC16189E4FF03f3B2",
    MIM_BONDDEPOSITORY_ADDRESS: "0xaCFD290fC50eB1B1fd4efE6cbe2dd45756F26E7b",
    MIM_BONDSTAKEDEPOSITORY_ADDRESS: "0xa02887a9f9564674086ef991C6345578007CD6A2",
    // DAILP_BONDDEPOSITORY_ADDRESS: "0xfeD78D18505c75f0342D9d3029F3ED211E8dE5E3",
    // DAILP_BONDSTAKEDEPOSITORY_ADDRESS: "0x5029BB5A68E293901a4C84B7d8ee5a9c602479E3",
    // USDCLP_BONDDEPOSITORY_ADDRESS: "0xA6838Fa77cb8fa4FABaa045befc009E2D9A96e20",
    // USDCLP_BONDSTAKEDEPOSITORY_ADDRESS: "0xb39d0834F141a30242664Ce9A5DF21C59c7De1D8",

    // DAILP_BONDDEPOSITORY_ADDRESS: "",
    // DAILP_BONDSTAKEDEPOSITORY_ADDRESS: "",
    // USDCLP_BONDDEPOSITORY_ADDRESS: "",
    // USDCLP_BONDSTAKEDEPOSITORY_ADDRESS: "",

    AOM_ADDRESS: "0x2A5C9E486C07179dc39466A2948957655381d8DB",
    SAOM_ADDRESS: "0x5255718b98b7E16F55940B966418c830B3EA750F",
    TREASURY_ADDRESS: "0x5Aa6D268Ef55c6b7ac97C9559F6221866c5bc3a8",
    BPHWITHPREMIUM_ADDRESS: "0xC586E80844e1d715E8c7Fd2d1F9656bBC69AcCfD",
    BONDINGCALCULATOR_ADDRESS: "0xAcb8908d6515fac64267abDC750e888C23e34d9A",

    AGGREAGTOR_ADDRESS: "0xE94a16b814EF90ebEB3278a1f03278658dB45cD2",
    REDEEMHELPER_ADDRESS: "0xa89042fBF83c2870f8A6B0e14E66fC191C3cAEbA",
    PRICEHELPER_ADDRESS: "0xd3746D6249bB3B4D0ABC69F03dcF82ab6B1Ca6A6",

    //Not FAIR
    DAILP_BONDDEPOSITORY_ADDRESS: "0x5BbdF6364B2e2FF9ac32A14299CCC1bb18AC6db9",
    DAILP_BONDSTAKEDEPOSITORY_ADDRESS: "0xd125c11A0ae701736F5BFd54E78436B7FAab5d7b",
    USDCLP_BONDDEPOSITORY_ADDRESS: "0xE597a3F7Bafe36C64160e1e05f42DA976D80fb25",
    USDCLP_BONDSTAKEDEPOSITORY_ADDRESS: "0x060Deb6Ad9f4bc4e07062A97d34d6E316FdC3673",
  
    BACKINGCALCULATOR_ADDRESS: "0x29BeBa4074946348bf4e797345ef52C33c4128Ae",
};

async function main() {
  const [owner] = await ethers.getSigners();

  const DAO = "0x70ce6821b7c38c8878ca971b4718c957f0566a4f";
  const owner_address = "0x70ce6821b7c38c8878ca971b4718c957f0566a4f";
  const ADDRESS_0 = "0x0000000000000000000000000000000000000000";


  const BONDDEPOSITORY_FACTORY = await ethers.getContractFactory("AOMBondDepository");
  let BONDDEPOSITORY_PARAMS = ["name", addresses.AOM_ADDRESS, 0, 18, addresses.TREASURY_ADDRESS, DAO, addresses.BPHWITHPREMIUM_ADDRESS, ADDRESS_0];
  let BONDDEPOSITORY_CONTRACTS = [0,0,0,0,0];

  const BONDSTAKEDEPOSITORY_FACTORY = await ethers.getContractFactory("AOMBondStakeDepository");
  let BONDSTAKEDEPOSITORY_PARAMS = ["name", addresses.AOM_ADDRESS,addresses.SAOM_ADDRESS, 0, 18, addresses.TREASURY_ADDRESS, DAO, addresses.BPHWITHPREMIUM_ADDRESS, ADDRESS_0];
  let BONDSTAKEDEPOSITORY_CONTRACTS = [0,0,0,0,0];

  const names = ["DAI", "USDC", "MIM", "DAILP", "USDCLP"];
  const depositAddresses = [addresses.DAI_ADDRESS, addresses.USDC_ADDRESS, addresses.MIM_ADDRESS, addresses.DAILP_ADDRESS, addresses.USDCLP_ADDRESS];
/*
  for( let i = 3; i < 5; i++)
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
      BONDDEPOSITORY_PARAMS[7] = addresses.BONDINGCALCULATOR_ADDRESS;
      BONDSTAKEDEPOSITORY_PARAMS[8] = addresses.BONDINGCALCULATOR_ADDRESS;
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

    //BackingCaculator Contract Initialize
    console.log("============BackingCalculator Contract Setting============//Must be redeployed because of constants");

    //BackingCalculator Contract - Redeploy
    const BACKINGCALCULATOR_FACTORY = await ethers.getContractFactory("BackingCalculator");
    const BACKINGCALCULATOR_PARAMS = [];
    const BACKINGCALCULATOR_CONTRACT = await BACKINGCALCULATOR_FACTORY.deploy(...BACKINGCALCULATOR_PARAMS);
    console.log("BACKINGCALCULATOR_ADDRESS:", BACKINGCALCULATOR_CONTRACT.address);
*/

  const BPHWITHPREMIUM_JSON = require("../artifacts/contracts/utils/BPHWithPremium.sol/BPHWithPremium.json");
  const PRICEHELPER_JSON = require("../artifacts/contracts/PriceHelper.sol/BondPriceHelper.json");
  const AGGREGATOR_JSON = require("../artifacts/contracts/Aggregator.sol/Aggregator.json");
  const REDEEMHELPER_JSON = require("../artifacts/contracts/RedeemHelper.sol/RedeemHelper.json");


    //BPHWithPremium Contract Initialize
    console.log("============BPHWithPremium Contract Setting============//Maybe set Premium");
    const BPHWithPremiumContract = new ethers.Contract(addresses.BPHWITHPREMIUM_ADDRESS, BPHWITHPREMIUM_JSON.abi, owner);
    console.log("setBackingCalculator(address _backingCalculator-redeployed)");
    tx = await BPHWithPremiumContract.setBackingCalculator(addresses.BACKINGCALCULATOR_ADDRESS);
    await tx.wait();

    //RedeemHelper Initialize
    console.log("============RedeemHelper Setting============");
    const RedeemHelperContract = new ethers.Contract(addresses.REDEEMHELPER_ADDRESS,REDEEMHELPER_JSON.abi, owner);
    bond11contracts = [addresses.DAILP_BONDDEPOSITORY_ADDRESS,
                        addresses.USDCLP_BONDDEPOSITORY_ADDRESS
                    ];
    bond44contracts = [addresses.DAILP_BONDSTAKEDEPOSITORY_ADDRESS,
                       addresses.USDCLP_BONDSTAKEDEPOSITORY_ADDRESS
                    ];
    console.log("Add11BondContracts : addBondContracts(address _bonds)");
    tx = await RedeemHelperContract.addBondContracts(bond11contracts);
    await tx.wait();
    console.log("Add44BondContracts : addBondContracts(address _bonds)");
    tx = await RedeemHelperContract.addBondContracts(bond44contracts);
    await tx.wait();

    //PriceHelper Initialize
    console.log("============PriceHelper Setting============");
    const PriceHelperContract = new ethers.Contract(addresses.PRICEHELPER_ADDRESS,PRICEHELPER_JSON.abi, owner);
    console.log("Add11BondContracts : addBondContracts(address _bonds)");
    tx = await PriceHelperContract.addBondContracts(bond11contracts);
    await tx.wait();
    console.log("Add44BondContracts : addBondContracts(address _bonds)");
    tx = await PriceHelperContract.addBondContracts(bond44contracts);
    await tx.wait();

    //Aggregator Initialize
    console.log("============Aggregator Setting============");
    const AggregatorContract = new ethers.Contract(addresses.AGGREAGTOR_ADDRESS, AGGREGATOR_JSON.abi, owner);
    console.log("Add11BondContracts : addBondContracts(address _bonds)");
    tx = await AggregatorContract.add11BondContracts(bond11contracts);
    await tx.wait();
    console.log("Add44BondContracts : addBondContracts(address _bonds)");
    tx = await AggregatorContract.add44BondContracts(bond44contracts);
    await tx.wait();
}

main()
.then(() => process.exit(0))
.catch(error => {
  console.error(error);
  process.exit(1);
});