const { formatBytes32String } = require("ethers/lib/utils");
const { ethers } = require("ethers");
const hre = require("hardhat");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("Sender");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0xFc8dFF0426a113f769867603Ea075a138937366B"
    );
    const fees = await layerZeroDemo1.estimateFees(
        10106,
        "0x7055B1eAE57F6156507ff541B75CFAB9aB2E7a6B",
        formatBytes32String("statecheck"),
        false,
        []
    );
    console.log(ethers.utils.formatEther(fees[0].toString()));
    //await layerZeroDemo1.updateCoordinator("0x7055B1eAE57F6156507ff541B75CFAB9aB2E7a6B", 10106);
    console.log(await layerZeroDemo1.coordinator());
    console.log(await layerZeroDemo1.destChainID());
    console.log(await layerZeroDemo1.client("sum", 54, 43, { value: fees[0] * 4 }));

}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});