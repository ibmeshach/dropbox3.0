const { getNamedAccounts, deployments, network, run } = require("hardhat")
const {
    networkConfig,
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")



module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId


   
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 2
        : VERIFICATION_BLOCK_CONFIRMATIONS

    log("----------------------------------------------------")
    const arguments = [
       
        
    ]
    const nft = await deploy("NftMint", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.waitBlockConfirmations || 1,
    })

    

   

}

module.exports.tags = ["all", "nft"]
