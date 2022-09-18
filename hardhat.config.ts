import { HardhatUserConfig } from 'hardhat/config'
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import '@nomicfoundation/hardhat-toolbox'
require('dotenv').config();

const ALCHEMY_URL = `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`

const config: HardhatUserConfig = {
    solidity: '0.8.17',
    defaultNetwork: 'hardhat',
    networks: {
        hardhat: {
            chainId: 1,
            forking: {
                url: ALCHEMY_URL,
                enabled: true,
            }
        }
    }
}

export default config
