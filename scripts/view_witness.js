const hre = require("hardhat");
const { ethers } = require("ethers");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("Witness");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0x13D6304b0b847BF174F6c32198D4676eB5061391"
    );
    await layerZeroDemo1.setParticipantCount(2);
    const count = await layerZeroDemo1.messageCount();
    const msg = await layerZeroDemo1.message();
    //const map = await LayerZeroDemo1.proofs();
    const pc = await layerZeroDemo1.participantscount();
    const app = await layerZeroDemo1.app();
    console.log("count = " + count);
    console.log("message = " + ethers.utils.toUtf8String(msg));
    //console.log("proofs = " + map);
    console.log("pc = " + pc);
    console.log("approved = " + app);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});