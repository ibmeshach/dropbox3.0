require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const RINKEBY_RPC_URL =
    process.env.RINKEBY_RPC_URL || "https://eth-rinkeby.alchemyapi.io/v2/1SdjRGVmmybehyzguYdXJqgFgSzcH_rH"

const GOERLI_RPC_URL =
    process.env.GOERLI_RPC_URL || "https://eth-goerli.g.alchemy.com/v2/tZfdsDmoyUdSRRrQWVwOptuQPSFMEuZ2"

    const BNBTEST_RPC_URL =
    process.env.BNBTEST_RPC_URL || "https://data-seed-prebsc-2-s1.binance.org:8545/"


    const MUMBAI_RPC_URL =
    process.env.MUMBAI_RPC_URL || "https://polygon-mumbai.g.alchemy.com/v2/60Ho1oDHoGAhK5mYAuOjX1IdD6I6_aUS"

const PRIVATE_KEY = process.env.PRIVATE_KEY

module.exports = {
    defaultNetwork: "localhost",
    networks: {
        hardhat: {
            chainId: 31337,
            blockConfirmation: 2,
        },

        localhost: {
            chainId: 31337,
            blockConfirmation: 2,
        },

        rinkeby: {
            url: RINKEBY_RPC_URL,
            accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],

            blockConfirmation: 2,
            chainId: 4,
        },

        goerli: {
            url: GOERLI_RPC_URL,
            accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],

            blockConfirmation: 2,
            chainId: 5,
        },

        bnbTest: {
            url: BNBTEST_RPC_URL,
            accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],

            blockConfirmation: 2,
            chainId: 97,
        },

        mumbai: {
            url: MUMBAI_RPC_URL,
            accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],

            blockConfirmation: 2,
            chainId: 80001,
        },
        
    },

    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
        player: {
            default: 1,
        },
    },
    solidity: {
        compilers: [
            {
                version: "0.8.7",
            },
            {
                version: "0.4.24",
            },
            {
                version: "0.6.0",
            },
            {
                version: "0.8.8",
            },
        ],
    },
    mocha: {
        timeout: 500000, // 500 seconds max for running tests
    },
}
