const { formatBytes32String } = require("ethers/lib/utils");
const { ethers } = require("ethers");
const hre = require("hardhat");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("Receiver");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0x331F27Ca74D2d0636335e636F1EBd9257641887E"
    );

    const intervalID = setInterval(async () => {
        var ret = await layerZeroDemo1.ret();
        if (ret !== "") {
            console.log("got return value=" + ret);

            const fees = await layerZeroDemo1.estimateFees(
                10102,
                "0x77a011a65F32573C6B60b83bF785bA97c2285528",
                formatBytes32String("taylor"),
                false,
                []
            );
            console.log(ethers.utils.formatEther(fees[0].toString()));
            console.log(await layerZeroDemo1.sendMsg(
                10102,
                "0x77a011a65F32573C6B60b83bF785bA97c2285528",
                "0x331F27Ca74D2d0636335e636F1EBd9257641887E",
                "0x7461796c6f72",
                { value: fees[0] }
            ));
            clearInterval(intervalID);
        }
        else {
            console.log("...");
        }

    }, 7000);
    console.log("Finished");
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});