const { formatBytes32String } = require("ethers/lib/utils");
const { ethers } = require("ethers");
const hre = require("hardhat");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("VoteTopic");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0x9b42A4196CAd84E2Ab7E3f2635532f02D8F1B5ca"
    );

    var alreadyRunning = false;

    const intervalID = setInterval(async () => {
        var results = await layerZeroDemo1.countPending();
        if (results > 0 && !alreadyRunning) {
            alreadyRunning = true;
            console.log(results + " results left to process");
            const [addr, chainID, transactionID] = await layerZeroDemo1.getFirstResult();

            const fees = await layerZeroDemo1.estimateFees(
                chainID,
                addr,
                transactionID,
                false,
                []
            );
            console.log(ethers.utils.formatEther(fees[0].toString()));
            console.log(await layerZeroDemo1.sendMsg(
                chainID,
                addr,
                "0x9b42A4196CAd84E2Ab7E3f2635532f02D8F1B5ca",
                transactionID,
                { value: ethers.utils.parseEther("0.5") }
            ));
            await layerZeroDemo1.deleteFirstResult();
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