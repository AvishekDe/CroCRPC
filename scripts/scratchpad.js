const { formatBytes32String } = require("ethers/lib/utils");
const { ethers } = require("ethers");
const hre = require("hardhat");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("Scratchpad");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0xf8Bf57eAad5dCef13a1A1d467Fe06CDC3650a1c5"
    );

    // const [a, b] = await layerZeroDemo1.test();
    // console.log(a);
    // console.log(b);
    // await layerZeroDemo1.genHash();
    // const transactionID = '0xb865702177ef98c70d876633e406';
    var hash = 5781909402708589;
    console.log(formatBytes32String(hash.toString()));
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});