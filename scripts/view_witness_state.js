const hre = require("hardhat");
const { formatBytes32String } = require("ethers/lib/utils");
const { ethers } = require("ethers");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("WitnessNetworkCoordinator");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0x80A02C5712cB0fdb9F9Fc111989c4042151faf01"
    );

    // await layerZeroDemo1.addPublicKey("0x71C9F6B1315931d941E07A38baE7a991798a18aF", 10106);
    // await layerZeroDemo1.addPublicKey("0x6fBCf4C554FD83A2F2D41a767a1b9aC833a1c767", 10109);
    const pk = await layerZeroDemo1.pk(0);
    console.log("public keys array= " + pk);

    const pk1 = await layerZeroDemo1.pk(1);
    console.log("public keys array= " + pk1);

    //await layerZeroDemo1.authorizeRefund();
    const ms = await layerZeroDemo1.multisign();
    console.log("multisignature = " + ms);

    const state = await layerZeroDemo1.state();
    console.log("state = " + state);

    // const fees = await layerZeroDemo1.estimateFees(
    //     10109,
    //     "0x6fBCf4C554FD83A2F2D41a767a1b9aC833a1c767",
    //     formatBytes32String("statecheck"),
    //     false,
    //     []
    // );
    // console.log(ethers.utils.formatEther(fees[0].toString()));

    console.log(await layerZeroDemo1.multiCastState({ value: ethers.utils.parseEther("0.06") }));
    const rm = await layerZeroDemo1.receivedMsg();
    console.log("message = " + rm);

    // const headers = await layerZeroDemo1.headers();
    // console.log("header = " + headers);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});