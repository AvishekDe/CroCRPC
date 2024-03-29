const hre = require("hardhat");
const { ethers } = require("ethers");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("Customer");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0xC63c0C3ac22F2b765fF28627c5C9ceb2aa42F67A"
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