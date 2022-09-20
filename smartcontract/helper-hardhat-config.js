const networkConfig = {
    default: {
        name: "hardhat",
        keepersUpdateInterval: "30",
    },
    31337: {
        name: "localhost",
        subscriptionId: "588",
        gasLane: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc", // 30 gwei
        keepersUpdateInterval: "30",
        raffleEntranceFee: "100000000000000000", // 0.1 ETH
        callbackGasLimit: "500000", // 500,000 gas
    },
    4: {
        name: "rinkeby",
        subscriptionId: "11780",
        gasLane: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc", // 30 gwei
        keepersUpdateInterval: "30",
        raffleEntranceFee: "100000000000000000", // 0.1 ETH
        callbackGasLimit: "500000", // 500,000 gas
        vrfCoordinatorV2: "0x6168499c0cFfCaCD319c818142124B7A15E857ab",
    },
    5: {
        name: "goerli",
        subscriptionId: "276",
        gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15", // 30 gwei
        keepersUpdateInterval: "30",
        raffleEntranceFee: "100000000000000000", // 0.1 ETH
        callbackGasLimit: "500000", // 500,000 gas
        vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
    },


    97: {
        name: "bnbTest",
        subscriptionId: "1658",
        gasLane: "0xd4bb89654db74673a187bd804519e65e3f71a52bc55f11da7601a13dcf505314", // 30 gwei
        keepersUpdateInterval: "30",
        raffleEntranceFee: "100000000000000000", // 0.1 ETH
        callbackGasLimit: "500000", // 500,000 gas
        vrfCoordinatorV2: "0x6A2AAd07396B36Fe02a22b33cf443582f682c82f",
    },


    80001: {
        name: "mumbai",
        subscriptionId: "1653",
        gasLane: "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f", // 30 gwei
        keepersUpdateInterval: "86400",
        raffleEntranceFee: "100000000000000000", // 0.1 ETH
        callbackGasLimit: "500000", // 500,000 gas
        vrfCoordinatorV2: "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed",
    },
}

const developmentChains = ["hardhat", "localhost"]
const VERIFICATION_BLOCK_CONFIRMATIONS = 6
const frontEndContractsFile = "../raffle_frontend/src/constants/contractAddresses.json"
const frontEndAbiFile = "../raffle_frontend/src/constants/abi.json"

module.exports = {
    networkConfig,
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
    frontEndContractsFile,
    frontEndAbiFile,
}
