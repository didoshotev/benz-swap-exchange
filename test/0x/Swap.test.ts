import { expect } from 'chai'
import hardhat, { ethers, network } from 'hardhat'
import fetch from 'node-fetch'


const ONE_ETHER_BASE_UNITS = '1000000000000000000' // 1 ETH
const MINIMAL_ERC20_ABI = ['function balanceOf(address account) external view returns (uint256)']


describe('0x API integration', function () {
    before(async () => {
        const { deployer, user1} = await hardhat.getNamedAccounts()
        console.log('deployer: ', deployer);
    })

    it('it should be able to use a 0x API mainnet quote', async function () {
        // Quote parameters
        const sellToken = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' // ETH
        const buyToken = '0x6b175474e89094c44da98b954eedeac495271d0f' // DAI
        const sellAmount = ONE_ETHER_BASE_UNITS
        const takerAddress = '0xab5801a7d398351b8be11c439e05c5b3259aec9b' // An account with sufficient balance on mainnet

        const quoteResponse = await fetch(
            `https://api.0x.org/swap/v1/quote?buyToken=${buyToken}&sellAmount=${sellAmount}&sellToken=${sellToken}&takerAddress=${takerAddress}`
        )
        // checking for 0x error
        if (quoteResponse.status !== 200) {
            const body = await quoteResponse.text()
            throw new Error(body)
        }

        const quote = await quoteResponse.json()

        // Impersonate the taker account so that we can submit the quote transaction
        await network.provider.request({
            method: 'hardhat_impersonateAccount',
            params: [takerAddress],
        })

        // Get a signer for the account we are impersonating
        const signer = await ethers.getSigner(takerAddress)
        const dai = new ethers.Contract(buyToken, MINIMAL_ERC20_ABI, signer)

        // Get pre-swap balances for comparison
        const etherBalanceBefore = await signer.getBalance()
        const daiBalalanceBefore = await dai.balanceOf(takerAddress)

        console.log('Ether Balance Before: ', ethers.utils.formatEther(etherBalanceBefore))
        console.log('DAI Balance Before: ', ethers.utils.formatEther(daiBalalanceBefore))

        // Send the transaction
        const txResponse = await signer.sendTransaction({
            from: quote.from,
            to: quote.to,
            data: quote.data,
            value: ethers.BigNumber.from(quote.value || 0),
            gasPrice: ethers.BigNumber.from(quote.gasPrice),
            gasLimit: ethers.BigNumber.from(quote.gas),
        })
        // Wait for transaction to confirm
        const txReceipt = await txResponse.wait()

        // Verify that the transaction was successful
        expect(txReceipt.status).to.equal(1, 'successful swap transaction')

        // Get post-swap balances
        const etherBalanceAfter = await signer.getBalance()
        const daiBalanceAfter = await dai.balanceOf(takerAddress)

        console.log('Ether Balance After: ', ethers.utils.formatEther(etherBalanceAfter));
        console.log('DAI Balance After: ', ethers.utils.formatEther(daiBalanceAfter));
    })
})
