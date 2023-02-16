const hre = require("hardhat");
const { ethers } = require("ethers");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("Permissionless");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0x6fBCf4C554FD83A2F2D41a767a1b9aC833a1c767"
    );

    const memberpayload = await layerZeroDemo1.memberpayload();
    const state = await layerZeroDemo1.state();
    console.log("state= " + state);
    console.log("memberpayload= " + memberpayload);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});