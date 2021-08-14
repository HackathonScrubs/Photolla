import React, { Component, useCallback } from 'react';
import Web3 from 'web3';
import Identicon from 'identicon.js';
import './App.css';
import Photolla from '../abis/Photolla.json'
import Navbar from './Navbar'
import Main from './Main'

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https'})

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }
  async loadWeb3() {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum)
    await window.ethereum.enable()
  }
  else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider)
  }
  else {
    window.alert('Non-Ethereum browser detected. Please install Metamask and try again!')
  }
}

async loadBlockchainData() {
  const web3 = window.web3
  const accounts = await web3.eth.getAccounts()
  this.setState({account: accounts[0]})
  const networkId = await web3.eth.net.getId()
  const networkData = Photolla.networks[networkId]
  if(networkData) {
    const photolla = web3.eth.Contract(Photolla.abi, networkData.address)
    this.setState({ photolla: photolla })
    const creatorcount = await photolla.methods.creatorCount().call()
    this.setState({ creatorcount })
    const creatorID = await photolla.methods.creatorIDs(this.state.account).call()
    this.setState({ creatorID: creatorID})
    for (var i = 1; i <= creatorcount; i++) {
      const creator = await photolla.methods.creators(i).call()
      this.setState({
        creators: [...this.state.creators, creator]
      })
      const images = []
      if (creator.imageCount > 0) {
        images = await photolla.methods.getImages(creator.creatorAddress).call()
        console.log(images)
      }
      const creatorImages = this.state.images
      creatorImages[creator.creatorAddress] = images
      console.log(creatorImages)
      this.setState({
        images: creatorImages
      })
    }
    this.setState({ loading: false})
  }
  else {
    window.alert('Photolla contract not deployed.')
  }

}
  captureFile = event => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  uploadImage = description => {
    console.log("Uploading file to ipfs...")
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('Ipfs result', result)
      if(error) {
        console.error(error)
        return
      }
     this.setState({ loading: true })
     this.state.photolla.methods.uploadImage(result[0].hash, description).send({ from: this.state.account }).on('confirmation', (receipt) => {
       window.location.reload()
      }).on('error', (error) => {
        this.setState({ transactionRejected: true })
        window.location.reload()
      })
    })
  }
  setup = (name, bio) => {
    const defaultProfile = new Identicon(this.state.account, 30).toString()
    this.state.photolla.methods.newCreator(name, "", defaultProfile, bio).send({ from: this.state.account }).on('confirmation', (receipt) => {
      window.location.reload()
     }).on('error', (error) => {
       this.setState({ transactionRejected: true })
       window.location.reload() })
  }

  loadprofile = (creatorAddress, creatorName) => {
    this.setState({ profileAddress: creatorAddress })
    this.setState({ profileName: creatorName })
  }

  tipImageOwner = (creatorAddress, id, tipAmount) => {
    this.setState({ loading: true })
    this.state.photolla.methods.tipImageOwner(creatorAddress, id).send({ from: this.state.account, value: tipAmount }).on('confirmation', (receipt) => {
      window.location.reload()
     }).on('error', (error) => {
       this.setState({ transactionRejected: true })
       window.location.reload()
    })
  }


  onKeyDown = (keycode) => {
    if (keycode.key === 'Enter') {
      this.setState({ searchInput: document.getElementById("searchbar").value })
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      photolla: null,
      creatorID: 0,
      creators: [],
      images: {},
      loading: true,
      searchInput: '',
      profileAddress: '',
      profileName: '',
    }
  }

  render() {
    return (
      <div>
        <Navbar
          account={this.state.account}
          onKeyDown={this.onKeyDown}
          loadprofile={this.loadprofile}
        />
        { this.state.transactionRejected
          ? <div className="text-center mt-5"><p>Transaction rejected...</p></div>
          : this.state.loading
            ? <div className="loader-wrapper"><img src="../logo.png" className="loader"></img></div>
            : <Main
                creators={this.state.creators}
                creatorID={this.state.creatorID}
                images={this.state.images}
                tips={this.state.tipsAmount}
                profileAddress={this.state.profileAddress}
                profileName={this.state.profileName}
                captureFile={this.captureFile}
                uploadImage={this.uploadImage}
                setup={this.setup}
                tipImageOwner={this.tipImageOwner}
                loadprofile={this.loadprofile}
              />
        }
      </div>
    );
  }
}

export default App;
