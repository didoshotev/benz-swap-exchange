import { HardhatUserConfig } from 'hardhat/config'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import '@nomicfoundation/hardhat-toolbox'
import { config as dotenvConfig } from 'dotenv'
import { resolve } from 'path'

dotenvConfig({ path: resolve(__dirname, './.env') })

const ALCHEMY_URL = `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`

const config: any = {
    solidity: '0.8.17',
    defaultNetwork: 'hardhat',
    namedAccounts: {
        deployer: {
            default: process.env.DEPLOYER_ADDRESS
        }
    },
    networks: {
        hardhat: {
            chainId: 1,
            forking: {
                url: ALCHEMY_URL,
                enabled: true,
            },
        },
    },
}

export default config
