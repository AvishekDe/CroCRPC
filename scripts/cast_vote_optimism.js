const { formatBytes32String } = require("ethers/lib/utils");
const { ethers } = require("ethers");
const hre = require("hardhat");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("Voter");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0xE74Ec8fD2f7A656D101B884e09dfe572456C5cED"
    );
    const fees = await layerZeroDemo1.estimateFees(
        10112,
        "0xb83A33469C1F3CDA3Acb9d1C586315F4fda80339",
        formatBytes32String("statecheck"),
        false,
        []
    );
    console.log(ethers.utils.formatEther(fees[0].toString()));

    console.log(await layerZeroDemo1.castVote("0xb83A33469C1F3CDA3Acb9d1C586315F4fda80339", 10112, 3, { value: ethers.utils.parseEther("0.005") }));

}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});