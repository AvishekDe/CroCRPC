const { formatBytes32String } = require("ethers/lib/utils");
const { ethers } = require("ethers");
const hre = require("hardhat");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("VoteTopic");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0x6b7bc100f6715F9D672B2061207E2f6a659Ba3C6"
    );
    let num = 123456789012345;
    // Optimism, Mumbai, Fuji, Fantom, BSC
    const chainIDs = [10132, 10109, 10106, 10112, 10102];
    const addrs = ["0xF65a72a44fc83E29522AF9A5547aA77cBDf1C762",
        "0x90D6A5fa548e1e99d67C26245175849ebF588915",
        "0xCE83398eCDa7624f83ccEdB47e59e3987E2d6b5c",
        "0x2e16fdF85671F2078939D2F6Bc0B942dfB9C47a1",
        "0x7ac53cFC15ED9456bcE88781697a839F2a87226b"];
    for (var i = 0; i < 5; i++) {
        const fees = await layerZeroDemo1.estimateFees(
            chainIDs[i],
            addrs[i],
            formatBytes32String(num.toString()),
            false,
            []
        );
        console.log(ethers.utils.formatEther(fees[0].toString()));
    }

}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});