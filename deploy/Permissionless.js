const LZ_ENDPOINTS = require("../constants/layerzeroEndpoints.json")

module.exports = async function ({ deployments, getNamedAccounts }) {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    console.log(`>>> your address: ${deployer}`)

    // get the Endpoint address
    const endpointAddr = LZ_ENDPOINTS[hre.network.name]
    console.log(`[${hre.network.name}] Endpoint address: ${endpointAddr}`)

    await deploy("Permissionless", {
        from: deployer,
        args: [endpointAddr, "0x39B67e3C44758b87371E235Fa20F6472F7EEa17E", "0x13D6304b0b847BF174F6c32198D4676eB5061391", 6,
            "0x35121efba53e1db63f8ec26b7add13b96d031516a9896294bffb48ab5172464a"],
        log: true,
        waitConfirmations: 1,
    })
}

module.exports.tags = ["Permissionless"]
