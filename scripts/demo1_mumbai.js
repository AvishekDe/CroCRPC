const hre = require("hardhat");
const { ethers } = require("ethers");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("LayerZeroDemo1");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0x88C05b7D506578d028773fd7938e123315e16DFC"
    );
    const count = await layerZeroDemo1.messageCount();
    const msg = await layerZeroDemo1.message();
    console.log(count);
    console.log(ethers.utils.toUtf8String(msg));
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});