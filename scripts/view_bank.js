const hre = require("hardhat");
const { ethers } = require("ethers");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("Bank");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0xe38Ccc452de5aCDde02df626e3AaA55cAf793183"
    );

    var count = await layerZeroDemo1.countPending();
    var m = await layerZeroDemo1.customer_balances("0x90D6A5fa548e1e99d67C26245175849ebF588915");
    var f = await layerZeroDemo1.customer_balances("0x2e16fdF85671F2078939D2F6Bc0B942dfB9C47a1");
    // var c = await layerZeroDemo1.srcChainIDs(0);
    // var ans = await layerZeroDemo1.pendingResultMap(a);
    console.log("count=" + count);
    console.log("Mumbai -> " + m);
    console.log("Fantom -> " + f);
    // console.log("ans=" + ans);
    // var response = await layerZeroDemo1.getAndDeleteFirstResult(false);
    // console.log("first=" + ethers.utils.toUtf8String(response.data));
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
}); 