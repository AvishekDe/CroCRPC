const LZ_ENDPOINTS = require("../constants/layerzeroEndpoints.json")

module.exports = async function ({ deployments, getNamedAccounts }) {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    console.log(`>>> your address: ${deployer}`)

    // get the Endpoint address
    const endpointAddr = LZ_ENDPOINTS[hre.network.name]
    console.log(`[${hre.network.name}] Endpoint address: ${endpointAddr}`)

    await deploy(
        "NbWitnessNetworkCoordinator", {
        from: deployer,
        args: [endpointAddr, [], "0x266550babbb7bd394ab653e15b80471735127d82e68a76fdc2dd7dadcfe667d8", []],
        log: true,
        waitConfirmations: 1,
    })
}

module.exports.tags = ["NbWitnessNetworkCoordinator"]
