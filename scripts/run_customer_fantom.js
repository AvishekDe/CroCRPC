const { formatBytes32String } = require("ethers/lib/utils");
const { ethers } = require("ethers");
const hre = require("hardhat");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("Customer");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0x2e16fdF85671F2078939D2F6Bc0B942dfB9C47a1"
    );
    const fees = await layerZeroDemo1.estimateFees(
        10106,
        "0xe38Ccc452de5aCDde02df626e3AaA55cAf793183",
        formatBytes32String("statecheck"),
        false,
        []
    );
    console.log(ethers.utils.formatEther(fees[0].toString()));
    // await layerZeroDemo1.updateBankAddress("0xe38Ccc452de5aCDde02df626e3AaA55cAf793183", 10106);
    console.log(await layerZeroDemo1.makeDeposit(100, { value: ethers.utils.parseEther("1") }));

}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});