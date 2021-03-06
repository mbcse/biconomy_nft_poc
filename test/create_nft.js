const Web3 = require("web3")
const NFTs = artifacts.require('./Biconomy_nft_poc.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Biconomy_nft_poc', (accounts) => {
  let contract

  before(async () => {
    contract = await NFTs.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = contract.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

  })

  describe('minting', async () => {
    it('creates a new NFT token', async () => {
      const result = await contract.mint('ECEA058EF4523')
      const totalSupply = await contract.balanceOf(accounts[0], 0)
      // is only one NFT of this type created in this account
      assert.equal(totalSupply, 1)
      // check NFT id, from address, to address
      const event = result.logs[0].args
      assert.equal(event.id, 0, 'id is correct')
      assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct')
      assert.equal(event.to, accounts[0], 'to is correct')
      // FAILURE: cannot mint same hash twice
      await contract.mint('ECEA058EF4523').should.be.rejected
    })
  })

  describe('indexing', async () => {
    it('lists hashes', async () => {
      // Mint 3 more NFT tokens
      await contract.mint('5386E4EABC345')
      await contract.mint('FFF567EAB5FFF')
      await contract.mint('234AEC00EFFD0')

      //check number of minted NFTs
      const nftCount = await contract.getNftCount()
      assert.equal(nftCount, 4)


      let hash
      let result = []
      //check indexing and hashes of minted NFTs
      for (var i = 1; i <= nftCount; i++) {
        hash = await contract.hashes(i - 1)
        result.push(hash)
      }

      let expected = ['ECEA058EF4523', '5386E4EABC345', 'FFF567EAB5FFF', '234AEC00EFFD0']
      assert.equal(result.join(','), expected.join(','))
    })
  })

})
