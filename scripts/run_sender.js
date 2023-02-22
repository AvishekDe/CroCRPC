const { formatBytes32String } = require("ethers/lib/utils");
const { ethers } = require("ethers");
const hre = require("hardhat");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("Sender");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0x77a011a65F32573C6B60b83bF785bA97c2285528"
    );
    const fees = await layerZeroDemo1.estimateFees(
        10106,
        "0x331F27Ca74D2d0636335e636F1EBd9257641887E",
        formatBytes32String("statecheck"),
        false,
        []
    );
    console.log(ethers.utils.formatEther(fees[0].toString()));
    console.log(await layerZeroDemo1.sendMsg(
        10106,
        "0x331F27Ca74D2d0636335e636F1EBd9257641887E",
        "0x77a011a65F32573C6B60b83bF785bA97c2285528",
        "0x7374617465636865636b", //formatBytes32String("statecheck"),
        { value: fees[0] }
    ));
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});