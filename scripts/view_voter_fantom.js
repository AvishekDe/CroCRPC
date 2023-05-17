const hre = require("hardhat");
const { ethers } = require("ethers");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("Voter");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0x4F156D8Ad3dF2A64286cbC940b89A3c6cD86D681"
    );

    const tID = await layerZeroDemo1.transactionID();
    console.log("Last transaction ID = " + tID);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});