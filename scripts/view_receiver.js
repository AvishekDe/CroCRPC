const hre = require("hardhat");
const { ethers } = require("ethers");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("Receiver");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0xDF69257894D7087B7d7353b6C5CE9C9BfD4DBb16"
    );

    var count = await layerZeroDemo1.countPending();
    var a = await layerZeroDemo1.pendingAddresses(0);
    var c = await layerZeroDemo1.srcChainIDs(0);
    var ans = await layerZeroDemo1.pendingResultMap(a);
    console.log("count=" + count);
    console.log(a + "->" + c);
    console.log("ans=" + ans);
    var response = await layerZeroDemo1.getAndDeleteFirstResult(false);
    console.log("first=" + ethers.utils.toUtf8String(response.data));
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});