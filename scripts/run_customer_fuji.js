const { formatBytes32String } = require("ethers/lib/utils");
const { ethers } = require("ethers");
const hre = require("hardhat");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("Customer");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0xe68507f17880f9CdAC77184d7c5BB06788919b8a"
    );
    const fees = await layerZeroDemo1.estimateFees(
        10109,
        "0xAe698678D03a5a80157fEA976fDF321f1b94e156",
        formatBytes32String("statecheck"),
        false,
        []
    );
    console.log(ethers.utils.formatEther(fees[0].toString()));
    await layerZeroDemo1.updateBankAddress("0xAe698678D03a5a80157fEA976fDF321f1b94e156", 10109);
    //console.log(await layerZeroDemo1.makeDeposit(123, { value: ethers.utils.parseEther("0.02") }));

}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});