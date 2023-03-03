const { formatBytes32String } = require("ethers/lib/utils");
const { ethers } = require("ethers");
const hre = require("hardhat");
async function main() {
    // const LayerZeroDemo1 = await hre.ethers.getContractFactory("Scratchpad");
    // const layerZeroDemo1 = await LayerZeroDemo1.attach(
    //     "0x57aa6dd99E7E180C589176bB64e8C94A89E9a939"
    // );

    // const [a, b] = await layerZeroDemo1.test();
    // console.log(a);
    // console.log(b);
    var counter = 4;
    var val = 1;
    function myfunc() {
        console.log(counter);
    }

    const id = setInterval(async () => {
        console.log("A");
    }, 4000);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});