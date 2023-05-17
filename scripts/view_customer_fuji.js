const hre = require("hardhat");
const { ethers } = require("ethers");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("Customer");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0xe68507f17880f9CdAC77184d7c5BB06788919b8a"
    );

    const bal = await layerZeroDemo1.balance();
    const name = await layerZeroDemo1.name();
    console.log(name + " Balance = " + bal);
    console.log(await layerZeroDemo1.bank());
    console.log(await layerZeroDemo1.destChainID());
    //console.log("memberpayload= " + memberpayload);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});