const { formatBytes32String } = require("ethers/lib/utils");
const { ethers } = require("ethers");
const hre = require("hardhat");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("Receiver");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0x7055B1eAE57F6156507ff541B75CFAB9aB2E7a6B"
    );

    var alreadyRunning = false;

    const intervalID = setInterval(async () => {
        var results = await layerZeroDemo1.countPending();
        if (results > 0 && !alreadyRunning) {
            alreadyRunning = true;
            console.log(results + " results left to process");
            const [addr, chainID, ans] = await layerZeroDemo1.getFirstResult();
            await layerZeroDemo1.deleteFirstResult();

            const fees = await layerZeroDemo1.estimateFees(
                chainID,
                addr,
                formatBytes32String(ans.toNumber().toString()),
                false,
                []
            );
            console.log(ethers.utils.formatEther(fees[0].toString()));
            console.log(await layerZeroDemo1.sendMsg(
                chainID,
                addr,
                "0x7055B1eAE57F6156507ff541B75CFAB9aB2E7a6B",
                formatBytes32String(ans.toNumber().toString()),
                { value: ethers.utils.parseEther("1") }
            ));
            alreadyRunning = false;
        }
        else {
            console.log("...");
        }

    }, 7000);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});