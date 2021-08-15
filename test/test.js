const { assert } = require('chai')

const Photolla = artifacts.require('./Photolla.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Photolla', ([deployer, author, tipper]) => {
  let photolla

  before(async () => {
    photolla = await Photolla.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await photolla.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await photolla.name()
      assert.equal(name, 'Photolla')
    })
  })
  describe('images', async () => {
    let result, imageCount
    const hash = 'Qma97qQBv7Hzg4ZLMykx4cx44GG22oYbUN1xHv2z2ic1Jz'
    before(async () => {
      result = await photolla.uploadImage(hash, 'Image description', {from: author})
      imageCount = await photolla.imageCount()
    })

    it('creates images', async () => {
      //sucesss
      assert.equal(imageCount, 1)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id is correct')
      assert.equal(event.hashes, hash,  'Hash is correct')
      assert.equal(event.description, 'Image description', 'description is correct')
      assert.equal(event.tipAmount, '0', 'tip amount is correct')
      assert.equal(event.author, author, 'author is correct')
      console.log(result.logs[0].args);

      await photolla.uploadImage('Image hash', '', {from: author}).should.be.rejected;
    })

    it('list images', async () => {
      const image = await photolla.images(imageCount)
      assert.equal(image.id.toNumber(), imageCount.toNumber(), 'id is correct')
      assert.equal(image.hashes, hash,  'Hash is correct')
      assert.equal(image.description, 'Image description', 'description is correct')
      assert.equal(image.tipAmount, '0', 'tip amount is correct')
      assert.equal(image.author, author, 'author is correct')
    })
  })
})