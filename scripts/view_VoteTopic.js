const hre = require("hardhat");
const { ethers } = require("ethers");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("VoteTopic");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0xb83A33469C1F3CDA3Acb9d1C586315F4fda80339"
    );

    // console.log(await layerZeroDemo1.recordedVotes('0xb865702177ef98c70d876633e4066fe96932e6898b0374b57041932853945bb0'));
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