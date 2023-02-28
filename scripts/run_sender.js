const { formatBytes32String } = require("ethers/lib/utils");
const { ethers } = require("ethers");
const hre = require("hardhat");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("Sender");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0x517F4Be8DFD983f67D401Ef68F6CF18090337162"
    );
    const fees = await layerZeroDemo1.estimateFees(
        10106,
        "0x7eC776dcED598Dc6baA18c5656CdB9603Ce5705B",
        formatBytes32String("statecheck"),
        false,
        []
    );
    console.log(ethers.utils.formatEther(fees[0].toString()));
    //await layerZeroDemo1.updateCoordinator("0x7eC776dcED598Dc6baA18c5656CdB9603Ce5705B", 10106);
    console.log(await layerZeroDemo1.coordinator());
    console.log(await layerZeroDemo1.destChainID());
    console.log(await layerZeroDemo1.client({ value: fees[0] * 4 }));
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