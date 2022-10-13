const networkConfig = {
    default: {
        name: "hardhat",
        keepersUpdateInterval: "30",
    },
    31337: {
        name: "localhost",
        
    },
    4: {
        name: "rinkeby",
        
        
    },
    5: {
        name: "goerli",
        
       
    },


    97: {
        name: "bnbTest",
        

    },


    80001: {
        name: "mumbai",
        
    },
}

const developmentChains = ["hardhat", "localhost"]
const VERIFICATION_BLOCK_CONFIRMATIONS = 6
const frontEndContractsFile = "../frontend/src/constants/contractAddresses.json"
const frontEndAbiFile = "../frontend/src/constants/abi.json"
const frontEndContractsFileNft = "../frontend/src/constants/contractAddresses_nft.json"
const frontEndAbiFileNft = "../frontend/src/constants/abi_nft.json"



module.exports = {
    networkConfig,
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
    frontEndContractsFile,
    frontEndAbiFile,
    frontEndContractsFileNft,
    frontEndAbiFileNft,
}
