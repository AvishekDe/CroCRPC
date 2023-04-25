const hre = require("hardhat");
const { ethers } = require("ethers");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("Customer");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0xF65a72a44fc83E29522AF9A5547aA77cBDf1C762"
    );

    const bal = await layerZeroDemo1.balance();
    console.log("Balance = " + bal);
    console.log(await layerZeroDemo1.bank());
    console.log(await layerZeroDemo1.destChainID());
    //console.log("memberpayload= " + memberpayload);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});