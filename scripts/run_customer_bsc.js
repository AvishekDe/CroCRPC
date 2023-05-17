const { formatBytes32String } = require("ethers/lib/utils");
const { ethers } = require("ethers");
const hre = require("hardhat");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("Customer");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0x944513e94Eb47f449593Ee0995F2f3b85ff78ec2"
    );
    const fees = await layerZeroDemo1.estimateFees(
        10106,
        "0x354Ef09C11b315a82c1B7A250132e0E873f6DA70",
        formatBytes32String("statecheck"),
        false,
        []
    );
    console.log(ethers.utils.formatEther(fees[0].toString()));
    // await layerZeroDemo1.updateBankAddress("0x354Ef09C11b315a82c1B7A250132e0E873f6DA70", 10106);
    console.log(await layerZeroDemo1.makeDeposit(60, { value: ethers.utils.parseEther("0.06") }));

}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});