const { formatBytes32String } = require("ethers/lib/utils");
const { ethers } = require("ethers");
const hre = require("hardhat");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("Permissionless");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0x49B2214f40652E31f6a65dB1964AD8bFeE7262B3"
    );
    const fees = await layerZeroDemo1.estimateFees(
        10102,
        "0xD81Fd1F663Ef2702B9a504D7208eBecd29d21129",
        formatBytes32String("statecheck"),
        false,
        []
    );
    console.log(ethers.utils.formatEther(fees[0].toString()));
    console.log(await layerZeroDemo1.sendMsg(
        10102,
        "0xD81Fd1F663Ef2702B9a504D7208eBecd29d21129",
        "0x49B2214f40652E31f6a65dB1964AD8bFeE7262B3",
        "0x7374617465636865636b", //formatBytes32String("statecheck"),
        { value: ethers.utils.parseEther("1") }
    ));
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});