const hre = require("hardhat");
const { ethers } = require("ethers");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("Receiver");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0x331F27Ca74D2d0636335e636F1EBd9257641887E"
    );

    //await layerZeroDemo1.unsetRet();
    const rec = await layerZeroDemo1.rec();
    const ret = await layerZeroDemo1.ret();
    console.log("rec= " + rec);
    console.log("ret= " + ret);
    console.log("ret= " + ret.length);
    console.log("ret= " + ret === "");
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});