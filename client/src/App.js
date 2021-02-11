import React, { Component } from "react";
import BiconomyNftPoc from "./contracts/Biconomy_nft_poc.json";
// import getWeb3 from "./getWeb3";
import Portis from '@portis/web3';
import Web3 from 'web3';
import "./App.css";
import Biconomy from "@biconomy/mexa";

// Connects portis
const portis = new Portis('b63160c9-8f23-4219-b970-9834bfc99b7e', 'mainnet');

// Connects and initialize Biconomy mexa

/* const biconomy = new Biconomy(portis.provider,{apiKey: <API Key>});
web3 = new Web3(biconomy); */

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  //Initialize dapp after mexa initialized
      /* biconomy.onEvent(biconomy.READY, () => {
        // Initialize your dapp here, insert componentDidMount here?
       }).onEvent(biconomy.ERROR, (error, message) => {
        // Handle error while initializing mexa
       }); */

  componentDidMount = async () => {
    try {

      // Get network provider and web3 instance.
      // const web3 = await getWeb3();
      /** 
      *@notice need to change web3 to new Web3(biconomy) once apikey provided.;
      */
      const web3 = new Web3(portis.provider); 
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      this.setState({ account: accounts[0] })
      console.log("Using account: " + this.state.account)

      // Get the contract instance.
      const networkId = await web3.eth.net.getId()
      const deployedNetwork = BiconomyNftPoc.networks[networkId];
      const contract = new web3.eth.Contract(
        BiconomyNftPoc.abi,
        "0xaAf6BDBD9473018718c31DB5Ab1519fEF4d51625"
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      this.setState({ web3, accounts, contract: contract });

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  // calling the contracts mint nft method
  mint = (hash) => {
   this.state.contract.methods.mint(hash).send({ from: this.state.account })
   .once('receipt', (receipt) => {
     this.setState({
      hashes: [...this.state.hashes, hash]
     })
   })
   console.log("mint is done")
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <section className="hero">
          <div className="navbar">
            <h1>Gasless Minter</h1>
            <img id="gasimage" src="./gas.png" ></img>
          </div>
          <div className="landing">
            <div className="landing-left">
                <h1>The hassle-free way to mint NFTs.</h1>
                <br/>
                <p>Using meta-transactions and Ethereum's L2 scaling solution, we enable gas-less and blockchain agnostic NFT minting for mass adoption.</p>
                <br/>
                <p>Already have a Metamask Wallet? Provide the details for your NFT, sign and you're done!</p>
                <br/>
                <p>Be gasless! Try out the demo below!</p>
            </div>
            <div className="landing-right">

                  <img src="./artmuseum.svg" id="landingimage"></img>
                </div>
          </div>
        </section>
        <section className="nft-section">
          <div className="step">

            <h3>Step 1 : Input your NFT's details here.</h3>

            <div className="nft-form">
            <br/>
            <form onSubmit={(event) => {
                event.preventDefault()
                const hash = this.hash.value
                this.mint(hash)
              }}>
              <div>
                <label>
                    NFT Name :
                <input type="text" name="nftName" />
                </label>
                <br/>
              <label>
              NFT Data :
              <textarea name="nftdData" rows="6" cols="45"/>
                </label>
                </div>
                  <br/>
                  <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='enter file hash e.g. ECEA058EF4523'
                    ref={(input) => { this.hash = input }}
                  />
                <button type="submit">Create NFT</button>
            </form>
        </div>
        </div>
        <div className="step">

        <h3>Step 2 : Check your NFT here.</h3>
        <div className="nft-results">

          <div className="results-divider">
            <div className="results-text">
              <label>Matic's Mumbai Testnet</label>
              <h5>Address: 0X12345678790</h5>
            </div>
            <div className="link-button">
          <a href="https://explorer-mumbai.maticvigil.com/" target="_blank">Check</a>
          </div>
          </div>
          </div>
        </div>

        </section>

      </div>
    );
  }
}

export default App;
