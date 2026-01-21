# Wallets & Accounts

> **NOTE:**
For the technical breakdown and standard for how wallets/accounts are generated in Stacks, check out [**SIP-005 standard**](https://github.com/stacksgov/sips/blob/main/sips/sip-005/sip-005-blocks-and-transactions.md) that outlines all of this.

### Introduction

Stacks wallets are software or hardware tools for storing cryptocurrencies, NFTs, and other digital assets. They are also used for establishing on-chain identity in decentralized applications (dApps). These wallets cryptographically store and manage each user’s identity and funds through a single blockchain address, which leverage public-key cryptography. 

#### Purpose of a Stacks wallet

* Establish User Identity
* Store Assets
* Display Balances
* Sign Transactions
* Sign Messages
* Participate in the Bitcoin Economy

Wallets in Stacks consists of accounts, which uses an accounts-based model, rather than a UTXO model like Bitcoin. This model is simpler than the UTXO model and has a more traditional concept of “balance”, similar to what you would encounter at a bank. In this model, each address has a single “balance” figure for a given token that increases/decreases as transactions are sent to/from that account. This is what most Web3 ecosystems use. In a UTXO model, the network operates as a ledger, with each UTXO being analogous to a cash bill.

#### Components of a Stacks account

* **Private Key** - The private key is an alphanumeric code that is paired to a single public key on a 1:1 basis. Never share your private key with anyone. A private key is how you prove ownership of a public key and how you can spend assets held by that particular key-pair.\
  \
  Example private key in Stacks (32 bytes appended with a 0x01 byte):\
  `5a4133fec2cf923d37238d3ba2fcd2ee9c8dce882c22218fd210d8a02ceb2c7401`
* **Public Key** - The public key is derived mathematically from the private key. It can be shared safely and is used by the network to verify signatures created by the private key, without revealing the private key itself.\
  \
  Example public key in Stacks (compressed format):\
  `02e8eb87862945d369511fdcce326ffef9a01b68c7d070e3ce685a5cbb9b1ecfc5`
* **Address (Principal)** - The address is a shorter, user-friendly representation derived from the public key. It’s what you share to receive sBTC, STX, tokens, or NFTs on Stacks, and it acts as the on-chain identifier for the user.\
  \
  Example public address in Stacks (c32check encoding):\
  `SPM9G3CNGSCTB4956290NESM0MR9W9CCEPVEPSQC`

> **NOTE:**
The private/public key generation uses the cryptographic **secp256k1** curve.

The cryptographic signature algorithm used in Stacks is **ECDSA** over **secp256k1**.

Stacks accounts are entities that own assets, like Stacks (STX) tokens. An account has an address, private key, nonce, and one or more asset balances. Assets cannot leave an account without an action from the account owner. All changes to assets (and the balances of the account) require a corresponding transaction.

All Stacks wallets also support Bitcoin addresses, enabling seamless participation across both the Stacks and Bitcoin ecosystems.

***

### Creation

An wallet's accounts are generated from a 24-word mnemonic phrase conforming to the BIP39 standard. This is often referred to as the **seed phrase**. The seed phrase provides access to Stacks accounts.

> **DANGER:**
If the seed phrase is lost, access to the associated account cannot be restored. No person or organization can recover a lost seed phrase.

The easiest way to generate a new Stacks account is to use the [Stacks CLI](https://github.com/stx-labs/stacks.js/tree/master/packages/cli):

```bash