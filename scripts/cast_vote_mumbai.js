const { formatBytes32String } = require("ethers/lib/utils");
const { ethers } = require("ethers");
const hre = require("hardhat");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("Voter");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0x4F156D8Ad3dF2A64286cbC940b89A3c6cD86D681"
    );
    const fees = await layerZeroDemo1.estimateFees(
        10112,
        "0x00AedC685690DFD34f77B3d12cd16Bf02A087B44",
        formatBytes32String("statecheck"),
        false,
        []
    );
    console.log(ethers.utils.formatEther(fees[0].toString()));

    console.log(await layerZeroDemo1.castVote("0x00AedC685690DFD34f77B3d12cd16Bf02A087B44", 10112, 2, { value: ethers.utils.parseEther("0.3") }));

}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});