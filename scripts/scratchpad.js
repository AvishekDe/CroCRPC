const { formatBytes32String } = require("ethers/lib/utils");
const { ethers } = require("ethers");
const hre = require("hardhat");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("WitnessNetworkCoordinator");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0x5812cF72d384c44f629F8c40aCBA2a5FEd66eCb7"
    );
    // const fees = await layerZeroDemo1.estimateFees(
    //     10106,
    //     "0x71BDef2fA732FAEd466F928f1A3262ceFcE9e46A",
    //     formatBytes32String("statecheck"),
    //     false,
    //     []
    // );
    // console.log(ethers.utils.formatEther(fees[0].toString()));
    // console.log(await layerZeroDemo1.sendMsg(
    //     10106,
    //     "0x71BDef2fA732FAEd466F928f1A3262ceFcE9e46A",
    //     "0x4636F305183939141eAa6450e8A033dfA7b0eE8f",
    //     "0x7374617465636865636b", //formatBytes32String("statecheck"),
    //     { value: ethers.utils.parseEther("0.002") }
    // ));
    console.log(await layerZeroDemo1.multiCastState({ value: ethers.utils.parseEther("0.002") }));
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});