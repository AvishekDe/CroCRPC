const { formatBytes32String } = require("ethers/lib/utils");
const { ethers } = require("ethers");
const hre = require("hardhat");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("Voter");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0xE91BFcc2A12882aF9CFF75bb048e23Fb8F584892"
    );
    const fees = await layerZeroDemo1.estimateFees(
        10112,
        "0x9b42A4196CAd84E2Ab7E3f2635532f02D8F1B5ca",
        formatBytes32String("statecheck"),
        false,
        []
    );
    console.log(ethers.utils.formatEther(fees[0].toString()));

    console.log(await layerZeroDemo1.castVote("0x9b42A4196CAd84E2Ab7E3f2635532f02D8F1B5ca", 10112, 1, { value: ethers.utils.parseEther("0.01") }));

}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});