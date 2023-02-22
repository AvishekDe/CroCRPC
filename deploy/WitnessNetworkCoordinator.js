const LZ_ENDPOINTS = require("../constants/layerzeroEndpoints.json")

module.exports = async function ({ deployments, getNamedAccounts }) {
    const owner = (await ethers.getSigners())[0]
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    console.log(`>>> your address: ${deployer}`)

    // get the Endpoint address
    const endpointAddr = LZ_ENDPOINTS[hre.network.name]
    console.log(`[${hre.network.name}] Endpoint address: ${endpointAddr}`)

    let wnc = await deploy(
        "WitnessNetworkCoordinator", {
        from: deployer,
        args: [endpointAddr, 2, [], "0x266550babbb7bd394ab653e15b80471735127d82e68a76fdc2dd7dadcfe667d8", []],
        log: true,
        waitConfirmations: 1,
    })

    // let eth = "0.1"
    // let tx = await (
    //     await owner.sendTransaction({
    //         to: wnc.address,
    //         value: ethers.utils.parseEther(eth),
    //         gasLimit: 50000000,
    //     })
    // ).wait()
    // console.log(`send it [${eth}] ether | tx: ${tx.transactionHash}`)
}

module.exports.tags = ["WitnessNetworkCoordinator"]
