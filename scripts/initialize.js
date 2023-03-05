const { ethers } = require("hardhat");
const addresses = {
    AOM_ADDRESS: "0x2A5C9E486C07179dc39466A2948957655381d8DB",
    SAOM_ADDRESS: "0x5255718b98b7E16F55940B966418c830B3EA750F",
    WSAOM_ADDRESS: "0x0847d4bE1b3E9cD12759D23AAa4695f329F87133",
    STAKING_ADDRESS: "0x3be701D3b5Ef52Eb1f14989e54B6CA612D051Ed9",
    STAKINGHELPER_ADDRESS: "0x1B8fda91786AD0A58e406979D45b2A5B1d66D8Fb",
    STAKINGWARMUP_ADDRESS: "0xFFa12911812EfFf02cF06236BCB0359358c3bAA6",
    BONDINGCALCULATOR_ADDRESS: "0xAcb8908d6515fac64267abDC750e888C23e34d9A",
    TREASURY_ADDRESS: "0x5Aa6D268Ef55c6b7ac97C9559F6221866c5bc3a8",
    DISTRIBUTOR_ADDRESS: "0xDE10dce6C320Dcd05DcB334CF1Ec60c95B7EC480",
    REDEEMHELPER_ADDRESS: "0xa89042fBF83c2870f8A6B0e14E66fC191C3cAEbA",
    AGGREAGTOR_ADDRESS: "0xE94a16b814EF90ebEB3278a1f03278658dB45cD2",
    CIRCULATING_ADDRESS: "0x92B1DeA2bCE4205b1b2289426697E271af9A770d",
    BACKINGCALCULATOR_ADDRESS: "0x1503FdD758e0dB5d0F9F90f72974Bd3838375eD5",
    BPHWITHPREMIUM_ADDRESS: "0xC586E80844e1d715E8c7Fd2d1F9656bBC69AcCfD",
    PRICEHELPER_ADDRESS: "0xd3746D6249bB3B4D0ABC69F03dcF82ab6B1Ca6A6",

    DAO_ADDRESS: "0x70ce6821b7c38c8878ca971b4718c957f0566a4f",
    OWNER_ADDRESS: "0x70ce6821b7c38c8878ca971b4718c957f0566a4f",
    ZERO_ADDRESS: "0x0000000000000000000000000000000000000000",
  
    DAI_ADDRESS: "0x6341f5C463017E98a3FB9a5d59CC898a5443e65B",
    USDC_ADDRESS: "0x9BF72e2A50f203662a0eDE314C68818708d371eD",
    MIM_ADDRESS: "0xa6d68596564079D1f91c108c40bB72E6b03f152a",
    DAILP_ADDRESS: "0x90734849453f3dDa0B6F9c8B2f007EC026Ea12Ed",
    USDCLP_ADDRESS: "0xde04486B526194D6a2DC65D051E986397387b8D8",
};

const AOM_JSON = require("../artifacts/contracts/AOM.sol/AOMToken.json");
const SAOM_JSON = require("../artifacts/contracts/sAOM.sol/sAOMToken.json");
const WSAOM_JSON = require("../artifacts/contracts/wsAOM.sol/wsAOM.json");
const STAKING_JSON = require("../artifacts/contracts/AOMStaking.sol/AOMStaking.json");
const DISTRIBUTOR_JSON = require("../artifacts/contracts/MigrateDistributor.sol/MigrateDistributor.json");
const REDEEMHELPER_JSON = require("../artifacts/contracts/RedeemHelper.sol/RedeemHelper.json");
const CIRCULATING_JSON = require("../artifacts/contracts/CirculatingSupply.sol/CirculatingSupply.json");
const BACKINGCALCULATOR_JSON = require("../artifacts/contracts/treasury-manager/BackingCalculator.sol/BackingCalculator.json");
const BPHWITHPREMIUM_JSON = require("../artifacts/contracts/utils/BPHWithPremium.sol/BPHWithPremium.json");
const PRICEHELPER_JSON = require("../artifacts/contracts/PriceHelper.sol/BondPriceHelper.json");
const AGGREGATOR_JSON = require("../artifacts/contracts/Aggregator.sol/Aggregator.json");
const BONDDEPOSITORY_JSON = require("../artifacts/contracts/AOMBondDepository.sol/AOMBondDepository.json");
const BONDSTAKEDEPOSITORY_JSON = require("../artifacts/contracts/AOMBondStakeDepository.sol/AOMBondStakeDepository.json");

/*HEC-DAO : 0x814750c7e8b575b2b3da0d2f90eb689a1d665eb0 
    AOM : owner <- TransferOwnership
    SAOM: manager=owner <-pushManagement(DAO), DAO.pullManagement

HEC-Policy : 0xa89641804eCf7BDC695AAaC068c5994053Bb4164
*/

async function main() {
    const [owner] = await ethers.getSigners();

    //AOM Initialize
    console.log("============AOM Contract Setting============");
    const AOMContract = new ethers.Contract(addresses.AOM_ADDRESS,AOM_JSON.abi, owner);
    console.log("Set Vault (Treasury)");
    tx = await AOMContract.setVault(addresses.TREASURY_ADDRESS);
    await tx.wait();

    //SAOM Initialize
    console.log("============SAOM Contract Setting============");
    const SAOMContract = new ethers.Contract(addresses.SAOM_ADDRESS,SAOM_JSON.abi, owner);
    console.log("initialize (address stakingContract_)");
    tx = await SAOMContract.initialize(addresses.STAKING_ADDRESS);
    await tx.wait();
    console.log("setIndex (INDEX)  //Maybe After First Rebase");
    tx = await SAOMContract.setIndex(1000000000); //SetIndex To 1
    await tx.wait();

    //WSAOM Initialize
    console.log("============WSAOM Contract Setting============ // Nothing to do");

    //AOMStaking Initialize
    console.log("============Staking Contract Setting============");
    const StakingContract = new ethers.Contract(addresses.STAKING_ADDRESS,STAKING_JSON.abi, owner);
    // enum CONTRACTS { DISTRIBUTOR, WARMUP, LOCKER }
    console.log("setContract(0, Distributor)");
    tx = await StakingContract.setContract(0, addresses.DISTRIBUTOR_ADDRESS);
    await tx.wait();
    console.log("setContract(1, StakingWarmupContract)");
    tx = await StakingContract.setContract(1, addresses.STAKINGWARMUP_ADDRESS);
    await tx.wait();
    console.log("setWarmup(3)");
    tx = await StakingContract.setWarmup(3);
    await tx.wait();
    // Locker is Address(0)

    //StakingWarmup Initialize
    console.log("============StakingWarmup Contract Setting============// Nothing to do");

    //StakingHelper Initialize
    console.log("============StakingHelper Contract Setting============// Nothing to do");

    //AOMBondingCalculator Initialize
    console.log("============BondingCalculator Contract Setting============// Nothing to do");

    //Distributor Initialize
    console.log("============Distributor Setting============//Maybe Set rewardRate");
    const DistributorContract = new ethers.Contract(addresses.DISTRIBUTOR_ADDRESS, DISTRIBUTOR_JSON.abi, owner);
    console.log("setRate");
    tx = await DistributorContract.setRate(6250);
    await tx.wait();

    //Treasury Contract Initialize
    console.log("============Treasury Contract Setting============");
    
    //CirculatingSupply Contract Initialize
    console.log("============CirculatingSupply Contract Setting============");
    const CirculatingSupplyContract = new ethers.Contract(addresses.CIRCULATING_ADDRESS,CIRCULATING_JSON.abi, owner);
    console.log("initialize(address _AOM)");
    tx = await CirculatingSupplyContract.initialize(addresses.AOM_ADDRESS);
    await tx.wait();
}

main()
.then(() => process.exit(0))
.catch(error => {
  console.error(error);
  process.exit(1);
});