# 🏗 Scaffold-ETH 2

<h4 align="center">
  <a href="https://docs.scaffoldeth.io">Documentation</a> |
  <a href="https://scaffoldeth.io">Website</a>
</h4>

🧪 An open-source, up-to-date toolkit for building decentralized applications (dapps) on the Ethereum blockchain. It's designed to make it easier for developers to create and deploy smart contracts and build user interfaces that interact with those contracts.

⚙️ Built using NextJS, RainbowKit, Hardhat, Wagmi, Viem, and Typescript.

- ✅ **Contract Hot Reload**: Your frontend auto-adapts to your smart contract as you edit it.
- 🪝 **[Custom hooks](https://docs.scaffoldeth.io/hooks/)**: Collection of React hooks wrapper around [wagmi](https://wagmi.sh/) to simplify interactions with smart contracts with typescript autocompletion.
- 🧱 [**Components**](https://docs.scaffoldeth.io/components/): Collection of common web3 components to quickly build your frontend.
- 🔥 **Burner Wallet & Local Faucet**: Quickly test your application with a burner wallet and local faucet.
- 🔐 **Integration with Wallet Providers**: Connect to different wallet providers and interact with the Ethereum network.

![Debug Contracts tab](https://github.com/scaffold-eth/scaffold-eth-2/assets/55535804/b237af0c-5027-4849-a5c1-2e31495cccb1)

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

To get started with Scaffold-ETH 2, follow the steps below:

1. Clone this repo & install dependencies

```
git clone https://github.com/scaffold-eth/scaffold-eth-2.git
cd scaffold-eth-2
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `hardhat.config.ts`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

**What's next**:

- Edit your smart contract `YourContract.sol` in `packages/hardhat/contracts`
- Edit your frontend homepage at `packages/nextjs/app/page.tsx`. For guidance on [routing](https://nextjs.org/docs/app/building-your-application/routing/defining-routes) and configuring [pages/layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts) checkout the Next.js documentation.
- Edit your deployment scripts in `packages/hardhat/deploy`
- Edit your smart contract test in: `packages/hardhat/test`. To run test use `yarn hardhat:test`

## Documentation

Visit our [docs](https://docs.scaffoldeth.io) to learn how to start building with Scaffold-ETH 2.

To know more about its features, check out our [website](https://scaffoldeth.io).

## Contributing to Scaffold-ETH 2

We welcome contributions to Scaffold-ETH 2!

Please see [CONTRIBUTING.MD](https://github.com/scaffold-eth/scaffold-eth-2/blob/main/CONTRIBUTING.md) for more information and guidelines for contributing to Scaffold-ETH 2.

## Explanation Smart Contracts (Inputs/Outputs)

### Fundraise.sol
The `Fundraise` smart contract is designed to facilitate fundraising activities using ERC-20 tokens (QST tokens) and NFTs as rewards.

**Inputs and Outputs**

- **Constructor** - Initializes the contract with the address of the QST token.
  - **Inputs:**
    - `_tokenAddress`: The address of the QSTToken contract.
  - **Outputs:** None

- **createFundraise** - Sets up a new fundraising campaign and deploys a new NFT collection contract.
  - **Inputs:**
    - `_title`: The title of the fundraise.
    - `_description`: The description of the fundraise.
    - `_fundingGoal`: The funding goal in QST tokens.
    - `_duration`: The duration of the fundraise in seconds.
    - `_nftName`: The name of the NFT collection.
    - `_nftSymbol`: The symbol of the NFT collection.
    - `_nftImageURIs`: An array of URIs pointing to the images for the NFTs (must contain exactly 69 URIs).
  - **Outputs:** None (but creates a new fundraise entry and deploys a new NFT contract)

- **contribute** - Allows users to contribute QST tokens to a specific fundraise, possibly earning an NFT.
  - **Inputs:**
    - `_fundraiseId`: The ID of the fundraise to contribute to.
    - `_amount`: The amount of QST tokens to contribute.
    - `_randomId`: The ID of the NFT to mint (uint256).
  - **Outputs:** None (but transfers QST tokens from the contributor to the contract, mints an NFT if the contribution meets the minimum threshold, and updates both the contributions mapping and fundraise details with the new amount and total raised. It returns nothing explicitly but updates the state with these new details).

- **endFundraise** - Concludes the fundraise, transferring the funds to the creator if the deadline has passed.
  - **Inputs:**
    - `_fundraiseId`: The ID of the fundraise to end.
  - **Outputs:** None (but marks the fundraise as inactive and transfers the total raised amount to the creator)

### FundraiseNFT.sol
The `FundraiseNFT` smart contract is an ERC-721 token (NFT) contract. It allows for minting NFTs with predefined image URIs (Uniform Resource Identifiers) and retrieves the token URI based on the token ID.

**Inputs and Outputs**

- **Constructor** - Initializes the NFT contract with the provided name, symbol, and image URIs.
  - **Inputs:**
    - `_name`: The name of the NFT collection.
    - `_symbol`: The symbol of the NFT collection.
    - `_imageURIs`: An array of URIs pointing to the images for the NFTs.
  - **Outputs:** None

- **mint** - Mints a new NFT to the specified address, assigning it a unique token ID.
  - **Inputs:**
    - `_to`: The address to which the NFT will be minted (address).
    - `_nftId`: The ID of the NFT to mint (uint256).
  - **Outputs:** Mints an NFT with the specified ID to the provided address. The NFT is safely minted using OpenZeppelin's `_safeMint` function, ensuring that it can only be called by the contract owner.

- **tokenURI** - Retrieves the URI of the image associated with a specific token ID. The URI is determined by the modulo of the token ID and the length of the image URIs array, ensuring a circular reference to the URIs.
  - **Inputs:**
    - `_tokenId`: The ID of the token for which the URI is requested.
  - **Outputs:**
    - Returns the URI of the token's image as a string.

### MetaTransaction.sol
The `MetaTransaction` smart contract allows the execution of meta-transactions, which enable users to submit transactions that can be relayed by another party (often used to allow users to interact with smart contracts without needing to hold ETH for gas fees).

**Inputs and Outputs**

- **Constructor** - Initializes the contract with the EIP-712 domain details for signing.
  - **Inputs:**
    - `name`: The name of the EIP-712 domain.
    - `version`: The version of the EIP-712 domain.
    - `chainId`: The chain ID of the network on which the contract is deployed.
  - **Outputs:** None (but initializes the domain separator for EIP-712 signing)

- **executeMetaTransaction** - Verifies the signature of the meta-transaction, executes the function call, and returns the result.
  - **Inputs:**
    - `userAddress`: The address of the user who signed the meta-transaction.
    - `functionSignature`: The function signature that the user wants to execute.
    - `sigR, sigS, sigV`: The components of the ECDSA signature.
  - **Outputs:**
    - Returns the result of the function call as bytes.

- **hashMetaTransaction** - Computes the keccak256 hash of the meta-transaction struct.
  - **Inputs:**
    - `metaTx`: A struct containing the meta-transaction details (nonce, from address, and function signature).
  - **Outputs:**
    - Returns the keccak256 hash of the meta-transaction as bytes32.

- **getMessageHash** - Creates the EIP-712 message hash from the meta-transaction hash.
  - **Inputs:**
    - `metaTxHash`: The hash of the meta-transaction.
  - **Outputs:**
    - Returns the EIP-712 message hash as bytes32.

- **verify** - Checks the signature against the computed message hash to ensure it matches the user's address.
  - **Inputs:**
    - `user`: The address of the user who signed the meta-transaction.
    - `metaTx`: A struct containing the meta-transaction details (nonce, from address, and function signature).
    - `sigR, sigS, sigV`: The components of the ECDSA signature.
  - **Outputs:**
    - Returns true if the signature is valid and matches the user, otherwise false.

### QSTToken.sol
The `QSTToken` smart contract is an ERC-20 token contract.

**Inputs and Outputs**

- **Constructor** - Initializes the token with a name, symbol, and initial supply, minting the initial supply to the deployer's address.
  - **Inputs:**
    - `initialSupply`: The initial supply of tokens to be minted.
  - **Outputs:** None (but mints the initial supply of tokens to the deployer's address)

### RandomPhotoFactory.sol
The `RandomPhotoFactory` smart contract manages the creation and interaction with RandomPhoto contracts. 

**Inputs and Outputs**

- **createRandomPhoto**
  - **Inputs:**
    - `id`: The address used as the ID for the new RandomPhoto contract (address).
    - `photoN`: The number of photos to add to the new RandomPhoto contract (uint16).
  - **Outputs:** Creates a new RandomPhoto contract. Stores the address of the new RandomPhoto contract in the randomPhotoContracts mapping. Emits the RandomPhotoCreated event with the ID and the address of the new contract.
   
-	**getRandomPhotoContract**
  - **Inputs:**
    - `id`: The address used as the ID for the RandomPhoto contract (address).
  - **Outputs:** Returns the address of the RandomPhoto contract instance associated with the given ID (address).
-	**readResult** 
  - **Inputs:**
    - None
  - **Outputs:** Returns the most recently generated random photo ID stored in the result variable (uint16).
-	**getRandomPhotoResult** 
  - **Inputs:**
    - `id`: The address used as the ID for the RandomPhoto contract (address).
  - **Outputs:** Calls the getRandomPhoto function in the specified RandomPhoto contract. Updates the result variable with the ID of the randomly selected photo. Emits the RandomPhotoGen event with the ID and the result. Returns the randomly selected photo ID (uint16).

### RandomPhoto.sol

The `RandomPhoto` smart contract manages a collection of photos, allowing new photos to be added and selecting a random available photo.

- **addPhotos** 
  - **Inputs:**
    - `photoN`: The number of photos to add (uint16).
  - **Outputs:** Adds the specified number of photos to the photos array.
Updates the photos array with new Photo structs, each with a unique ID and marked as available.
Returns nothing explicitly but updates the state by adding new photos.

- **randomNumber**
  - **Inputs:**
    - None
  - **Outputs:** Generates a random number using the TFHE library.
Emits the RandomNumberGenerated event with the generated number.
Returns the randomly generated number (uint16).

- **getRandomPhoto** 
  - **Inputs:**
    - None
  - **Outputs:** Calls updateAvailablePhotos to refresh the list of available photos.
Selects a random photo from the availablePhotos array.
Marks the selected photo as unavailable in the photos array.
Updates the result variable with the ID of the selected photo.
Returns the ID of the randomly selected photo (uint16).

- **updateAvailablePhotos** 
  - **Inputs:**
    - None
  - **Outputs:** Refreshes the availablePhotos array by iterating through the photos array and adding only available photos to availablePhotos. Returns nothing explicitly but updates the state by refreshing the list of available photos.


## Explanation of the `randomNumber` Function

The `randomNumber` function in the `RandomPhoto` smart contract is a critical component that leverages Fully Homomorphic Encryption (FHE) to securely generate random numbers on the blockchain. This function ensures the randomness is verifiable and secure, which is essential for applications where fairness and unpredictability are crucial, such as selecting a random photo from a collection.

#### Function Code

```solidity
function randomNumber() public returns (uint16) {
    euint16 enumber = TFHE.randEuint16();
    uint16 rnd = TFHE.decrypt(enumber);
    emit RandomNumberGenerated(rnd);
    return rnd;
}
```

### Next.js API Implementation

The two main functions of the smart contract, creating a random photo collection and retrieving a random photo, are implemented in the Next.js API. These API routes facilitate interaction with the smart contract from a web application, providing a user-friendly interface for managing and accessing photo collections on the blockchain.

- Create Random Photo Collection: An API route to initialize a new photo collection and add a specified number of photos.
- Retrieve Random Photo: An API route to fetch a random photo from an existing collection.

These implementations ensure that users can seamlessly interact with the decentralized photo collection system, leveraging the security and transparency of the Inco Network and FHE technology.

## Deployed Contracts:

### BaseSepolia
  - **QSTToken:** 0xF60be104fB98bDC81E3B0B9525C715a041f60c91
  - **Fundraise:** 0xD832462B1bE2b0c600CC87b734E630408736E875

### ScrollSepolia
  - **QSTToken:** 0xd977422c9eE9B646f64A4C4389a6C98ad356d8C4
  - **Fundraise:** 0x1eB5C49630E08e95Ba7f139BcF4B9BA171C9a8C7

### ArbitrumSepolia
  - **QSTToken:** 0x4EE7c7970a92132F757A1F6dC5e6FCff51E17A21
  - **Fundraise:** 0xd5b82A25b664eec7cfc7EEE580Acfa99Cc753897

### Inco
  - **RandomPhotoFactory:** 0x7bc06c482DEAd17c0e297aFbC32f6e63d3846650


## Workflow

**Create QSTToken** (only once)
### For each Fundraise:
`Fundraise`(func: createFundraise) via `MetaTransaction` → `Fundraise`(func: contribute) via `MetaTransaction` -[if contribution >= 6.09 ]→ `FundraiseNFT`(minting NFTs) 


