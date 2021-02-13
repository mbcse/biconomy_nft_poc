# Gasless Chain Agnostic Minter

To test smart contracts you need to first install ganache-cli, then run commands:
1. npm install
2. ganache-cli
3. truffle test

## The problem Gasless Chain Agnostic Minter solves
At present, Ethereum users experience very high gas fees and operational complexity, which causes people to lose money and discourages them from using the network. Layer two solutions exist, but the user experience is difficult due to customizing wallet RPC nodes, switching networks, and understanding how layer two solutions relate to Ethereum mainnet.

Our Gasless Chain Agnostic Minter makes the user experience fast and simple when creating an NFT. The user simply inputs NFT data, clicks a button, and approves the transaction in Portis wallet. We take care of the gas payment with Biconomy and the layer two connection with a chain agnostic relay, giving the user a simple UX while taking advantage of speed and cost savings.

We see much potential for building beyond this proof of concept. We could offer gasless, agnostic functions to NFT marketplaces so they would improve their speed and expand their user base. We could also allow marketplaces to import existing NFTs with easy composability between Ethereum and layer two solutions. In addition, we see the possibility to make the user experience even easier by integrating social account logins (ex. Google, Facebook, etc.). There is also the possibility of adding NFT income streams to the gasless, agnostic experience with superfluid, enabling artists and other creators to give and receive payment streams.

We are enthusiastic about this proof of concept and see much potential for building upon the foundation we have laid with Gasless Chain Agnostic Minter.

## Tech Stack
- Biconomy
- Portis wallet
- Truffle suite
- NodeJS
- React
- Ethereum
- Matic Mumbai Testnet
