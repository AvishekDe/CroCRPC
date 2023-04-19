const hre = require("hardhat");
const { ethers } = require("ethers");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("Customer");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0x90D6A5fa548e1e99d67C26245175849ebF588915"
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