const hre = require("hardhat");
const { ethers } = require("ethers");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("Sender");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0x6Dc1A693647B4e7312a4Ef1B53D7D41e81568561"
    );

    const ret = await layerZeroDemo1.ret();
    console.log("ret= " + ret);
    //console.log("memberpayload= " + memberpayload);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});