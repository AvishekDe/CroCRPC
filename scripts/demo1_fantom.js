const { formatBytes32String } = require("ethers/lib/utils");
const { ethers } = require("ethers");
const hre = require("hardhat");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("LayerZeroDemo1");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0x5A70EDdE9E4a80CF8Ee055C5ffEA6d9892Dc5f12"
    );
    const fees = await layerZeroDemo1.estimateFees(
        10109,
        "0x88C05b7D506578d028773fd7938e123315e16DFC",
        formatBytes32String("Samridhi was here"),
        false,
        []
    );
    console.log(ethers.utils.formatEther(fees[0].toString()));
    await layerZeroDemo1.sendMsg(
        10109,
        "0x88C05b7D506578d028773fd7938e123315e16DFC",
        "0x5A70EDdE9E4a80CF8Ee055C5ffEA6d9892Dc5f12",
        formatBytes32String("Samridhi was here"),
        { value: ethers.utils.parseEther("1") }
    );
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});