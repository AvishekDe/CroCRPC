const { formatBytes32String } = require("ethers/lib/utils");
const { ethers } = require("ethers");
const hre = require("hardhat");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("Receiver");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0x7eC776dcED598Dc6baA18c5656CdB9603Ce5705B"
    );

    const intervalID = setInterval(async () => {
        var ret = await layerZeroDemo1.ret();
        if (ret != 0) {
            console.log("got return value=" + ret);

            const fees = await layerZeroDemo1.estimateFees(
                10102,
                "0x517F4Be8DFD983f67D401Ef68F6CF18090337162",
                formatBytes32String(ret.toString()),
                false,
                []
            );
            console.log(ethers.utils.formatEther(fees[0].toString()));
            console.log(await layerZeroDemo1.sendMsg(
                10102,
                "0x517F4Be8DFD983f67D401Ef68F6CF18090337162",
                "0x7eC776dcED598Dc6baA18c5656CdB9603Ce5705B",
                formatBytes32String(ret.toString()),
                { value: fees[0] }
            ));
            clearInterval(intervalID);
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