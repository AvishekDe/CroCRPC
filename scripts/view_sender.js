const hre = require("hardhat");
const { ethers } = require("ethers");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("Sender");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0xFc8dFF0426a113f769867603Ea075a138937366B"
    );

    const ret = await layerZeroDemo1.ret();
    console.log("ret= " + ret);
    //console.log("memberpayload= " + memberpayload);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});