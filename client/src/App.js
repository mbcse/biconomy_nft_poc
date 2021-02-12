import React, { Component } from "react";
import BiconomyNftPoc from "./contracts/Biconomy_nft_poc.json";
// import getWeb3 from "./getWeb3";
import Portis from '@portis/web3';
import Web3 from 'web3';
import "./App.css";
import {Biconomy} from "@biconomy/mexa";
let sigUtil = require("eth-sig-util");

// Connects portis
const portis = new Portis('b63160c9-8f23-4219-b970-9834bfc99b7e', 'kovan');
const biconomy = new Biconomy(new Web3.providers.HttpProvider("https://rpc-mumbai.maticvigil.com/"),{apiKey: "lO1-9jiPG.f336a50c-ff5f-468e-a254-65b2ed72b955", debug: true });

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
      this.setState({ web3: web3 });

      biconomy.onEvent(biconomy.READY, async() => {
        const bicoweb3 = new Web3(biconomy);
        this.setState({ bicoweb3: bicoweb3 });
        const contract = new bicoweb3.eth.Contract(
          BiconomyNftPoc.abi,
          "0x53854205072224425B02E82d6C396CAc2Ac14484"
        );
        console.log(contract);
        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();
        this.setState({ account: accounts[0] });
        console.log("Using account: " + this.state.account);

        // Set web3, accounts, and contract to the state, and then proceed with an
        this.setState({ accounts:accounts, contract: contract });

      }).onEvent(biconomy.ERROR, (error, message) => {
        console.log("Biconomy Initialization Error");
      });
      
      
      console.log("State is",this.state);
      // Get the contract instance.
      // const networkId = await web3.eth.net.getId()
      // const deployedNetwork = BiconomyNftPoc.networks[networkId];
      

      

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  // calling the contracts mint nft method
  mint = async(hash) => {
    console.log(this.state.web3.utils.toHex(210000));
    let privateKey="1c4179968de4655ebe40e9cf90c2b94c5cb8b14dd6ada4a8e8f3a85228ab515f";
    let txParams = {
      "from": this.state.account,
      "gasLimit": this.state.web3.utils.toHex(210000),
      "to": "0x53854205072224425B02E82d6C396CAc2Ac14484",
      "value": "0x0",
      "data": this.state.contract.methods.mint(hash).encodeABI()
    }; 
    
    const signedTx = await this.state.web3.eth.accounts.signTransaction(
      txParams,
      `0x${privateKey}`
    );
    console.log(signedTx);

    const dataToSign = await biconomy.getForwardRequestAndMessageToSign(
      signedTx.rawTransaction
    );

    
    const signature = sigUtil.signTypedMessage(
      new Buffer.from(privateKey, "hex"),
      {
        data: dataToSign.eip712Format, // option to get personalFormat also 
      },
      "V4"
    );
    

    let rawTransaction = signedTx.rawTransaction;
    
    
    let data = {
      forwardRequest: dataToSign.request,
      signature: signature,
      rawTransaction: rawTransaction,
      signatureType: "EIP712_SIGN",
    };

    // Use any one of the methods below to check for transaction confirmation
    // USING PROMISE
    /*let receipt = await web3.eth.sendSignedTransaction(data, (error, txHash) => {
            if (error) {
                return console.error(error);
            }
            console.log(txHash);
        })*/

    // USING event emitter    
    
    let tx = this.state.bicoweb3.eth.sendSignedTransaction(data);
    console.log("Getting Signature");
    tx.on("transactionHash", function (hash) {
      console.log(`Transaction hash is ${hash}`);
    }).once("confirmation", function (confirmationNumber, receipt) {
      console.log(receipt);
    });

    tx.on("error",(err)=>{
      console.log(err);
    });
  
  //  this.state.contract.methods.mint(hash).send({ from: this.state.account })
  //  .once('receipt', (receipt) => {
  //    this.setState({
  //     hashes: [...this.state.hashes, hash]
  //    })
  //  })
  //  console.log("mint is done")
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <section className="hero">
          <div className="navbar">
            <h1>Gasless Chain Agnostic Minter</h1>
            <img id="gasimage" src="./gas.png" ></img>
          </div>
          <div className="landing">
            <div className="landing-left">
                <h1>The hassle-free way to mint NFTs.</h1>
                <br/>
                <p>Using meta-transactions and Ethereum's L2 scaling solution, we enable gas-less and blockchain agnostic NFT minting for mass adoption.</p>
                <br/>
                <p>Already have a Portis Wallet? Provide the details for your NFT, sign and you're done!</p>
                <br/>
                <p>Be gasless and chain agnostic! Try out the demo below!</p>
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
                {/* <label>
                    NFT Name :
                <input type="text" name="nftName" />
                </label>
                <br/> */}
              <label>
              NFT Data :
              <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='enter file hash e.g. ECEA058EF4523'
                    ref={(input) => { this.hash = input }}
                  />
                </label>
                </div>
                  <br/>
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
            <h5>NFT Smart Contract Address: 0x53854205072224425B02E82d6C396CAc2Ac14484</h5>
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
