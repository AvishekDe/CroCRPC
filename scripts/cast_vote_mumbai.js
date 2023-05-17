const { formatBytes32String } = require("ethers/lib/utils");
const { ethers } = require("ethers");
const hre = require("hardhat");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("Voter");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0xF92d4Dc9a51A49A14ddEFDf0BA7f9CA00d762F94"
    );
    const fees = await layerZeroDemo1.estimateFees(
        10106,
        "0x572EC30c04581DfcA494E76C645d8510A324b573",
        formatBytes32String("statecheck"),
        false,
        []
    );
    console.log(ethers.utils.formatEther(fees[0].toString()));

    console.log(await layerZeroDemo1.castVote("0x572EC30c04581DfcA494E76C645d8510A324b573", 10106, 2, { value: ethers.utils.parseEther("0.6") }));

}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});