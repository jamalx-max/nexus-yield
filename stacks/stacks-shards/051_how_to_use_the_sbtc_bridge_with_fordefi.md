# How to Use the sBTC Bridge with Fordefi

> **WARNING:**
This guide is specifically for entities or teams that use [Fordefi](https://fordefi.com/) as it will demonstrate the flow for a multi-approval transaction policy setup. This assumes you have the Fordefi wallet setup with its browser extension and with its mobile app.

The sBTC Bridge is a web application allowing you to convert your BTC into sBTC on the Stacks chain. If you aren't familiar with sBTC, be sure to check out the [sBTC Conceptual Guide](https://docs.stacks.co/learn/sbtc) to understand how it works.

> **DANGER:**
Ensure that you are using the bridge located at [sbtc.stacks.co](https://sbtc.stacks.co/). This is the only official sBTC bridge.

The sBTC Bridge has been designed to be as simple as possible to use. But specifically for this guide, a **2-of-2 approval transaction policy**, targeting Bitcoin transactions, has already been setup in the Fordefi UI. It is assumed you have a similar setup as this guide will walkthrough the different steps needed to take in such a scenario where multiple parties need to approve a transaction.

If you need assistance in setting up such a transaction policy in Fordefi, check out their dedicated [docs](https://docs.fordefi.com/user-guide/policies).

### Walkthrough for minting sBTC

Here are the necessary steps to convert your BTC to sBTC using Fordefi:

**Confirm your BTC and STX vaults**

First, you'll need to make sure you have a vault for Bitcoin, and a separate vault for Stacks. Both of these vaults will be used later when connecting with the sBTC Bridge app.

**Connect your Fordefi wallet extension**

First, you'll need to connect your Fordefi wallet to the sBTC Bridge app.

**Choose which Bitcoin and Stacks vault you want to use**

Next, the Fordefi extension will want you to select which Bitcoin vault, and then which Stacks vault you'd want to use. The reasoning for this is because you'll be needing to send a bitcoin transaction first from your Bitcoin vault, then you'll be receiving sBTC to your Stacks vault.

**Choose the amount of BTC to deposit**

After your wallet is connected, choose how much BTC you would like to convert to sBTC.

> **NOTE:**
There are two transaction fees required to mint your sBTC. The first is when they initiate the bitcoin deposit transaction within their wallet. The second is a fee used to consolidate the deposit UTXOs into the single Signer's UTXO. This separate transaction fee happens automatically and is set to a max of 80k sats. This is automatically deducted from your minted sBTC. This is not a Signer fee but a regular bitcoin transaction fee.

**Choose the Stacks address to mint the sBTC to**

Next, enter the Stacks address you would like your sBTC minted to. This will just be the Stacks address associated with the Stacks vault that you selected earlier when connecting your Fordefi wallet extension.

**Create initial BTC transfer**

Your Fordefi wallet extension will pop up prompting you to create the BTC transaction. This transaction is the initial peg-in transfer for your BTC to the sBTC Signers. Hit 'Create' after you confirm the transaction details and necessary approval details.

> **NOTE:**
If you have a transaction policy setup with certain approvals required, hitting 'Create' will not initiate the bitcoin transaction, it will simply store this unsigned transaction in your Fordefi wallet until all necessary approvals are met and then finally signed.

**Approve transaction by approvers**

Upon notice of transaction to approvers, each approver will need to approve transaction in their Fordefi mobile wallets before the completion of the final step, which is signing the transaction by the initiator.

Each approver will need to pull up the pending transaction in their Fordefi mobile wallet and hit 'Approve'.

**Sign approved transaction**

Once all transaction policies are satisfied and approved, the initiator will need to officially sign the transaction in their Fordefi mobile wallet.

This mobile signature action will then notify the sBTC Bridge app.

**Receive your sBTC**

Back in the sBTC Bridge app UI, you can monitor the status of your transaction to see when it has been completed, at which point you can see the sBTC in your Fordefi wallet. It will go through three stages:

* Pending - Your [Bitcoin transaction](https://mempool.space/tx/6b5e63fbe4e4a4835dcf096ca2d2a8c112898692e28a4c5b38cb39e3e9837604) is processing
* Minting - Your Bitcoin transaction has processed and the [sBTC signers are minting](https://explorer.hiro.so/txid/a9e232289d2c6e50150b034894182d341343e7064b27c8dccbd25ebca79b2947?chain=mainnet) your sBTC
* Completed - Your sBTC has been minted to your wallet

### Reclaiming BTC

If your sBTC mint fails, you can reclaim your sBTC. You can do this via the bridge by visiting the reclaim page at <https://sbtc.stacks.co/\\>\<TX\_ID>/reclaim and replacing the bracketed text with your transaction ID as shown below:\
<https://sbtc.stacks.co/8f37f750b6646f0a217121201967170bd3cfef5f2ebd4f30f359b5e9308470c4/reclaim>

There is an intermediate step in between depositing BTC and the sBTC signers consolidating it into the single signer UTXO. If the transaction is not picked up by signers, you can reclaim it using this UI. Note there is a 'Lock Time' field on the Reclaim page. That indicates the amount of blocks that must have passed in order to reclaim your BTC.

This initiates a Bitcoin transaction that will transfer your BTC back to you.