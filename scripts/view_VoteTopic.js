const hre = require("hardhat");
const { ethers } = require("ethers");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("VoteTopic");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0x9b42A4196CAd84E2Ab7E3f2635532f02D8F1B5ca"
    );

    console.log("----VOTING RESULTS----");
    console.log(await layerZeroDemo1.options(0) + " ---> " + await layerZeroDemo1.voteCounter(0));
    console.log(await layerZeroDemo1.options(1) + " ---> " + await layerZeroDemo1.voteCounter(1));
    console.log(await layerZeroDemo1.options(2) + " ---> " + await layerZeroDemo1.voteCounter(2));
    console.log(await layerZeroDemo1.options(3) + " ---> " + await layerZeroDemo1.voteCounter(3));
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
}); 