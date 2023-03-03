const { formatBytes32String } = require("ethers/lib/utils");
const { ethers } = require("ethers");
const hre = require("hardhat");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("Sender");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0xb7803aBF615428Bf503D70F45e152De4C6AfB314"
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
    console.log(await layerZeroDemo1.client("prod", 10, 7, { value: ethers.utils.parseEther("0.5") }));

}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});