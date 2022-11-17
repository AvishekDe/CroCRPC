const { formatBytes32String } = require("ethers/lib/utils");
const { ethers } = require("ethers");
const hre = require("hardhat");
async function main() {
    const Participants = await hre.ethers.getContractFactory("Participants");
    const contract = await Participants.attach(
        //"0x45B659C263780143CE2b64943bfB222Fd529C841" // fuji
        "0x6b7bc100f6715F9D672B2061207E2f6a659Ba3C6" // mumbai
    );
    const fees = await contract.estimateFees(
        10112,
        "0x13D6304b0b847BF174F6c32198D4676eB5061391",
        formatBytes32String("RandomHashMessageFromFuji"),
        false,
        []
    );
    console.log(ethers.utils.formatEther(fees[0].toString()));
    await contract.sendMsg(
        10112,
        "0x13D6304b0b847BF174F6c32198D4676eB5061391",
        // "0x45B659C263780143CE2b64943bfB222Fd529C841", // fuji
        "0x6b7bc100f6715F9D672B2061207E2f6a659Ba3C6", //mumbai
        formatBytes32String("RandomHashMessageFromFuji"),
        { value: ethers.utils.parseEther("0.0002") }
    );
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});