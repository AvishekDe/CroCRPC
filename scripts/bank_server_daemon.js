const { formatBytes32String } = require("ethers/lib/utils");
const { ethers } = require("ethers");
const hre = require("hardhat");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("Bank");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0xe38Ccc452de5aCDde02df626e3AaA55cAf793183"
    );

    var alreadyRunning = false;

    const intervalID = setInterval(async () => {
        var results = await layerZeroDemo1.countPending();
        if (results > 0 && !alreadyRunning) {
            alreadyRunning = true;
            console.log(results + " results left to process");
            const [addr, chainID, ans] = await layerZeroDemo1.getFirstResult();

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
                "0xe38Ccc452de5aCDde02df626e3AaA55cAf793183",
                formatBytes32String(ans.toNumber().toString()),
                { value: ethers.utils.parseEther("0.0005") }
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