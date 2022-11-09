const { formatBytes32String } = require("ethers/lib/utils");
const { ethers } = require("ethers");
const hre = require("hardhat");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("LayerZeroDemo1");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0x46e88Dc0e9bd0DcA3c8572Ed0CC86CA27f59079f"
    );
    const fees = await layerZeroDemo1.estimateFees(
        10109,
        "0x88C05b7D506578d028773fd7938e123315e16DFC",
        formatBytes32String("Hello LayerZero"),
        false,
        []
    );
    console.log(ethers.utils.formatEther(fees[0].toString()));
    await layerZeroDemo1.sendMsg(
        10109,
        "0x88C05b7D506578d028773fd7938e123315e16DFC",
        formatBytes32String("Hello LayerZero"),
        { value: ethers.utils.parseEther("0.00032774") }
    );
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});