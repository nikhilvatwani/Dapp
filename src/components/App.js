import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import Marketplace from '../abis/Marketplace.json'
import InfinityToken from '../abis/InfinityToken.json'
import Navbar from './Navbar'
import Main from './Main'
import { load } from 'babel-register/lib/cache';

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
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Marketplace.networks[networkId]
    const infyNetworkData = InfinityToken.networks[networkId]
    if(networkData) {
      const marketplace = new web3.eth.Contract(Marketplace.abi, networkData.address)
      const infyToken = new web3.eth.Contract(InfinityToken.abi, infyNetworkData.address)
      this.setState({ infyToken })
      this.setState({ marketplace })
      const productCount = await marketplace.methods.productCount().call()
      const bal = await infyToken.methods.getTokenBalance(accounts[0]).call()
      console.log(bal)
      this.setState({ balance: bal })
      console.log("after getting balnce from blockchain")
      this.setState({ productCount })
      // Load products
      for (var i = 1; i <= productCount; i++) {
        const product = await marketplace.methods.products(i).call()
        this.setState({
          products: [...this.state.products, product]
        })
      }
      this.setState({ loading: false})
    } else {
      window.alert('Marketplace contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      productCount: 0,
      products: [],
      loading: true
    }

    this.createProduct = this.createProduct.bind(this)
    this.purchaseProduct = this.purchaseProduct.bind(this)
    this.transferFrom = this.transferFrom.bind(this)
    //this.balance = this.balance.bind(this)
    // console.log(this.balance)
  }

  createProduct(name, price) {
    this.setState({ loading: true })
    this.state.marketplace.methods.createProduct(name, price/100).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  transferFrom(from, to, price){
    
    return this.state.infyToken.methods.transferFrom(from, to, price).send({ from: this.state.account})
  }

  // async balance(address) {

  //   const bal = await this.state.infyToken.methods.getTokenBalance(address).call()

  //   // this.state.infyToken.methods.getTokenBalance(address)
  //   //let k =  await this.state.infyToken.methods.getTokenBalance(address)
  //   //console.log(k)
  //   // const x =.001
  //   console.log("inside callback balance")
  //   bal = bal.toNumber()
  //   // const x = this.state.infyToken.methods.getTokenBalance(address).to
  //   // console.log(x)
  //   // return x;
  //   return bal
  // }




  purchaseProduct(id, price) {
    this.setState({ loading: true })
    this.state.marketplace.methods.getSellerAddress(id).call().then(res =>{
      this.state.infyToken.methods.transfer(res, .0000000000000001*price).send({ from: this.state.account}).once('receipt', (result)=>{
        console.log("here")
        this.state.marketplace.methods.purchaseProduct(id).send({ from: this.state.account, value: price/1000 })
        .once('receipt', (receipt) => {
          this.setState({ loading: false })
        })
      })
    })
  
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} balance={this.state.balance}/>
        <br/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex center">
              { this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : <Main
                  products={this.state.products}
                  createProduct={this.createProduct}
                  purchaseProduct={this.purchaseProduct} 
                  account={this.state.account} 
                  transferFrom={this.transferFrom}
                  balance = {this.state.balance}      
                  />
              }
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
