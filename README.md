# Full-Stack ERC-20 Token Faucet DApp

**Sepolia Testnet | Rate-Limited | Dockerized | Wallet-Integrated**

## Project Overview

This project implements a complete end-to-end Web3 decentralized application (DApp) that distributes ERC-20 tokens via a secure, rate-limited faucet. The system enforces on-chain cooldown periods, lifetime claim limits, and admin-controlled pause functionality.

The application demonstrates production-grade Web3 engineering practices including smart contract security, automated testing, frontend wallet integration, containerized deployment, and deterministic evaluation interfaces.

## Architecture Overview

### High-Level Components

1. **ERC-20 Token Contract**

   * Fixed maximum supply
   * Minting restricted to faucet contract only
   * Fully ERC-20 compliant using OpenZeppelin

2. **Token Faucet Contract**

   * Enforces 24-hour cooldown between claims
   * Enforces lifetime claim limit per address
   * Tracks last claim timestamp and total claimed
   * Admin-controlled pause/unpause functionality

3. **Frontend (React + Vite)**

   * Wallet connection via EIP-1193
   * Real-time balance and eligibility display
   * User-friendly transaction status handling
   * Programmatic evaluation interface exposed on `window.__EVAL__`

4. **Infrastructure**

   * Dockerized frontend using Nginx
   * `/health` endpoint for readiness checks
   * Environment-driven configuration

## Repository Structure

```
submission/
├── contracts/
│   ├── Token.sol
│   ├── TokenFaucet.sol
│   └── test/
│       └── TokenFaucet.test.js
│
├── scripts/
│   └── deploy.js
│
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── health.html
│   ├── package.json
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── utils/
│   │       ├── contracts.js
│   │       ├── wallet.js
│   │       ├── eval.js
│   │       ├── tokenAbi.json
│   │       └── faucetAbi.json
│
├── screenshots/
│   ├── 01-wallet-connect.png
│   ├── 02-wallet-connected.png
│   ├── 03-metamask-confirm.png
│   ├── 04-claim-success.png
│   ├── 05-cooldown.png
│   ├── 06-transaction-details.png
│   └── 07-health.png
│
├── docker-compose.yml
├── hardhat.config.js
├── .env.example
└── README.md
```

## Smart Contract Design

### ERC-20 Token

* Fixed maximum supply defined at deployment
* Minting restricted to faucet contract
* Emits standard `Transfer` events for all balance changes

### Faucet Logic

* Fixed token amount per claim
* 24-hour cooldown enforced on-chain
* Lifetime claim cap enforced on-chain
* Admin-only pause/unpause
* Clear revert reasons for all failure cases

## Deployed Contracts (Sepolia)

### ERC-20 Token

Address:
`0x4d2b1859A9E979258490d60Da835d43d44487274`

Etherscan:
[https://sepolia.etherscan.io/address/0x4d2b1859A9E979258490d60Da835d43d44487274#code](https://sepolia.etherscan.io/address/0x4d2b1859A9E979258490d60Da835d43d44487274#code)

### Faucet Contract

Address:
`0xa4DCc05D776BBB72c8bc3D4Ba16215b6dFAe383C`

Etherscan:
[https://sepolia.etherscan.io/address/0xa4DCc05D776BBB72c8bc3D4Ba16215b6dFAe383C#code](https://sepolia.etherscan.io/address/0xa4DCc05D776BBB72c8bc3D4Ba16215b6dFAe383C#code)


## Frontend Features

* Wallet connect / disconnect
* Real-time token balance display
* Cooldown countdown and eligibility status
* Remaining lifetime allowance display
* Transaction loading states and error handling
* Automatic network switching to Sepolia
* Programmatic evaluation interface


## Evaluation Interface

The frontend exposes a global interface for automated testing:

```js
window.__EVAL__ = {
  connectWallet(),
  requestTokens(),
  getBalance(address),
  canClaim(address),
  getRemainingAllowance(address),
  getContractAddresses()
}
```

All numeric values are returned as strings.


## Dockerized Deployment

### Environment Variables

Create a `.env` file in the repository root using:

```
cp .env.example .env
```

Fill in the values as needed.


### Run Application

From the repository root:

```
docker compose up --build
```


### Access Application

* Frontend:
  [http://localhost:3000](http://localhost:3000)

* Health check:
  [http://localhost:3000/health](http://localhost:3000/health)
  (returns HTTP 200)


## Screenshots

### Wallet Connection

![Wallet Connect](screenshots/01-wallet-connect.png)

### Wallet Connected

![Wallet Connected](screenshots/02-wallet-connected.png)

### MetaMask Transaction Confirmation

![MetaMask Confirm](screenshots/03-metamask-confirm.png)

### Successful Token Claim

![Claim Success](screenshots/04-claim-success.png)

### Cooldown Enforcement

![Cooldown](screenshots/05-cooldown.png)

### Transaction Details

![Transaction Details](screenshots/06-transaction-details.png)

### Health Endpoint

![Health](screenshots/07-health.png)


## Testing Strategy

* Unit tests cover:

  * Successful claims
  * Cooldown enforcement
  * Lifetime limit enforcement
  * Pause/unpause logic
  * Admin access control
  * Multi-user independence
* Tests written using Hardhat and Mocha
* Time manipulation used for cooldown validation


## Security Considerations

* Checks-effects-interactions pattern used
* Minting strictly restricted to faucet
* Admin-only controls enforced
* Solidity 0.8+ overflow protection
* Clear revert reasons for all failure cases


## Known Limitations

* Single testnet deployment (Sepolia)
* No admin UI (pause tested via contract interaction)
* Fixed faucet parameters (can be made configurable)


## Conclusion

This project demonstrates a complete production-ready Web3 application with strong emphasis on security, usability, testability, and deployment reliability. All core requirements are implemented and verified on-chain, with a clean frontend interface and automated evaluation support.