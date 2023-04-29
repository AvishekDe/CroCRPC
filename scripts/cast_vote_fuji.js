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
        "0x6b7bc100f6715F9D672B2061207E2f6a659Ba3C6",
        formatBytes32String("statecheck"),
        false,
        []
    );
    console.log(ethers.utils.formatEther(fees[0].toString()));

    console.log(await layerZeroDemo1.castVote("0x6b7bc100f6715F9D672B2061207E2f6a659Ba3C6", 10132, 1, { value: ethers.utils.parseEther("0.01") }));

}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});