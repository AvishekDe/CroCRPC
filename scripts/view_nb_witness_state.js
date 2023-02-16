const hre = require("hardhat");
const { ethers } = require("ethers");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("NbWitnessNetworkCoordinator");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0xE0b529405843b36ce6f0cD33a11223712c660200"
    );

    // const pk = await layerZeroDemo1.pk()[0];
    // console.log("public keys array= " + pk);

    //await layerZeroDemo1.authorizeRefund();
    const ms = await layerZeroDemo1.multisign();
    console.log("multisignature = " + ms);

    const state = await layerZeroDemo1.state();
    console.log("state = " + state);

    const rm = await layerZeroDemo1.receivedMsg();
    console.log("message = " + rm);

    // const headers = await layerZeroDemo1.headers();
    // console.log("header = " + headers);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});