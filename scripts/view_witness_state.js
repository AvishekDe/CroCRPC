const hre = require("hardhat");
const { ethers } = require("ethers");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("WitnessNetworkCoordinator");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0x6c33350fF3439F875ACE65338C178b8BFb0b29fa"
    );

    // const pk = await layerZeroDemo1.pk()[0];
    // console.log("public keys array= " + pk);

    await layerZeroDemo1.authorizeRefund();
    const ms = await layerZeroDemo1.multisign();
    console.log("multisignature = " + ms);

    const state = await layerZeroDemo1.state();
    console.log("state = " + state);

    // const headers = await layerZeroDemo1.headers();
    // console.log("header = " + headers);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});