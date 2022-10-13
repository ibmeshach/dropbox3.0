const { frontEndContractsFileNft, frontEndAbiFileNft } = require("../helper-hardhat-config")
const fs = require("fs")
const { ethers, network } = require("hardhat")

module.exports = async () => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Writing to front end...")
        updateContractAddresses()
        updateAbi()
        console.log("Front end written!")
    }
}

async function updateAbi() {
    const raffle = await ethers.getContract("NftMint")
    fs.writeFileSync(frontEndAbiFileNft, raffle.interface.format(ethers.utils.FormatTypes.json))
}

async function updateContractAddresses() {
    const raffle = await ethers.getContract("NftMint")
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFileNft, "utf8"))
    if (network.config.chainId.toString() in contractAddresses) {
        if (!contractAddresses[network.config.chainId.toString()].includes(raffle.address)) {
            contractAddresses[network.config.chainId.toString()].push(raffle.address)
        }
    } else {
        contractAddresses[network.config.chainId.toString()] = [raffle.address]
    }
    fs.writeFileSync(frontEndContractsFileNft, JSON.stringify(contractAddresses))
}
module.exports.tags = ["all", "frontend"]
