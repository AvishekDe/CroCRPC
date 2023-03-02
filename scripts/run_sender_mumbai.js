const { formatBytes32String } = require("ethers/lib/utils");
const { ethers } = require("ethers");
const hre = require("hardhat");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("Sender");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0x6Dc1A693647B4e7312a4Ef1B53D7D41e81568561"
    );
    const fees = await layerZeroDemo1.estimateFees(
        10106,
        "0x7055B1eAE57F6156507ff541B75CFAB9aB2E7a6B",
        formatBytes32String("statecheck"),
        false,
        []
    );
    console.log(ethers.utils.formatEther(fees[0].toString()));
    //await layerZeroDemo1.updateCoordinator("0x7055B1eAE57F6156507ff541B75CFAB9aB2E7a6B", 10106);
    console.log(await layerZeroDemo1.coordinator());
    console.log(await layerZeroDemo1.destChainID());
    console.log(await layerZeroDemo1.client({ value: ethers.utils.parseEther("0.4") }));
    // console.log(await layerZeroDemo1.sendMsg(
    //     10106, //chainID
    //     "0x331F27Ca74D2d0636335e636F1EBd9257641887E", //dest SC
    //     "0x2989CE2364Cf4E5870C99b85e621c8A8AAec648b", //my SC
    //     "0x7374617465636865636b", //args
    //     { value: fees[0] }
    // ));

}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});