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
    const imagescount = await photolla.methods.imageCount().call()
    this.setState({ imagescount })
    for (var i = 1; i <= imagescount; i++) {
      const image = await photolla.methods.images(i).call()
      this.setState({
        images: [...this.state.images, image]
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
     this.state.photolla.methods.uploadImage(result[0].hash, description).send({ from: this.state.account }).on('transactionHash', (hash) => { this.setState({ loading: false })
      })
    })
  }
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      photolla: null,
      images: [],
      loading: true
    }
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              images={this.state.images}
              captureFile={this.captureFile}
              uploadImage={this.uploadImage}
            />
          }
        }
      </div>
    );
  }
}

export default App;