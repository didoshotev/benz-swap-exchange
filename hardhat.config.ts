import { HardhatUserConfig } from 'hardhat/config'
import "@typechain/hardhat";
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import "hardhat-deploy";
import '@nomicfoundation/hardhat-toolbox'
import { config as dotenvConfig } from 'dotenv'
import { resolve } from 'path'
import { accounts, namedAccountsCollection } from './hardhat.accounts';


dotenvConfig({ path: resolve(__dirname, './.env') })

const ALCHEMY_URL = `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`


const config: HardhatUserConfig = {
    solidity: '0.8.17',
    defaultNetwork: 'hardhat',
    namedAccounts: namedAccountsCollection,
    networks: {
        hardhat: {
            chainId: 1,
            accounts: accounts,
            forking: {
                url: ALCHEMY_URL,
                enabled: true,
            },
        },
    },
}

export default config
