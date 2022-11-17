const hre = require("hardhat");
const { ethers } = require("ethers");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("Permissionless");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0xFB747d68E1A32B1D038136e290F9aC8Db6521425"
    );

    await layerZeroDemo1.redeem(23);
    const state = await layerZeroDemo1.state();
    console.log("state= " + state);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});