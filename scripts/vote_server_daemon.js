const { formatBytes32String } = require("ethers/lib/utils");
const { ethers } = require("ethers");
const hre = require("hardhat");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("VoteTopic");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0x572EC30c04581DfcA494E76C645d8510A324b573"
    );

    var alreadyRunning = false;

    const intervalID = setInterval(async () => {
        var results = await layerZeroDemo1.countPending();
        if (results > 0 && !alreadyRunning) {
            alreadyRunning = true;
            console.log(results + " results left to process");
            const [addr, chainID, transactionID] = await layerZeroDemo1.getFirstResult();
            console.log("Transaction ID = " + transactionID);

            const fees = await layerZeroDemo1.estimateFees(
                chainID,
                addr,
                formatBytes32String(transactionID.toNumber().toString()),
                false,
                []
            );
            console.log(ethers.utils.formatEther(fees[0].toString()));
            console.log(await layerZeroDemo1.sendMsg(
                chainID,
                addr,
                "0x572EC30c04581DfcA494E76C645d8510A324b573",
                formatBytes32String(transactionID.toNumber().toString()),
                { value: ethers.utils.parseEther("0.03") }
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