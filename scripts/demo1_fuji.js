const { formatBytes32String } = require("ethers/lib/utils");
const { ethers } = require("ethers");
const hre = require("hardhat");
async function main() {
    const LayerZeroDemo1 = await hre.ethers.getContractFactory("LayerZeroDemo1");
    const layerZeroDemo1 = await LayerZeroDemo1.attach(
        "0x888BA929487EfBC5cc7F07B26315Ecd51155CAe6"
    );
    const fees = await layerZeroDemo1.estimateFees(
        10109,
        "0xf72646a049D6d3C9cfC4F1F3eC2161c89eF7fCD0",
        formatBytes32String("LayerZero Demo Message Divy"),
        false,
        []
    );
    console.log(ethers.utils.formatEther(fees[0].toString()));
    console.log(await layerZeroDemo1.sendMsg(
        10109,
        "0xf72646a049D6d3C9cfC4F1F3eC2161c89eF7fCD0",
        "0x888BA929487EfBC5cc7F07B26315Ecd51155CAe6",
        formatBytes32String("LayerZero Demo Message Divy"),
        { value: ethers.utils.parseEther("0.000087") }
    ));
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});