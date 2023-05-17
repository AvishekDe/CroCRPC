const hre = require("hardhat");
const { ethers } = require("ethers");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("Customer");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0xeDa5eCA0bEe4CD122c95FFab974Ef810dC30981a"
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