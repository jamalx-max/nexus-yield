# How to Use the sBTC Bridge with Asigna

> **WARNING:**
This guide is specifically for entities or teams that use [Asigna](https://www.asigna.io/) as it will demonstrate the flow for a multi-signature setup. This assumes you have the Asigna web wallet setup with its browser extension.

The sBTC Bridge is a web application allowing you to convert your BTC into sBTC on the Stacks chain. If you aren't familiar with sBTC, be sure to check out the [sBTC Conceptual Guide](https://docs.stacks.co/learn/sbtc) to understand how it works.

> **DANGER:**
Asigna has the sBTC Bridge as an embedded app within its web wallet. This guide will be using that embedded app.

The sBTC Bridge has been designed to be as simple as possible to use. But specifically for this guide, a **2-of-2 multi-signature setup of a Bitcoin vault AND a separate Stacks vault**. It is assumed you have a similar setup as this guide will walkthrough the different steps needed to take in such a scenario where 2 parties of this 2-of-2 multi-signature setup need to sign transactions.

### Walkthrough for minting sBTC

Here are the necessary steps to convert your BTC to sBTC using Asigna:

**Confirm your BTC and STX vaults**

First, you'll need to make sure you have a vault for Bitcoin, and a separate vault for Stacks. In this scenario, the same 2-of-2 signature setup are applied for both vaults. Throughout the guide, we'll refer to each party of this setup as Member\_1 and Member\_2.

**Navigate and open the embedded sBTC Bridge app in Bitcoin vault**

Click into the Bitcoin vault and scroll down to the 'Trending Apps' section where you'll locate the sBTC Bridge embedded app. Open this embedded app and choose the 'Asigna Multisig' wallet to connect with.

**Choose the amount of BTC to deposit**

After your Bitcoin vault is connected, choose how much BTC you would like to convert to sBTC.

> **NOTE:**
There are two transaction fees required to mint your sBTC. The first is when they initiate the bitcoin deposit transaction within their wallet. The second is a fee used to consolidate the deposit UTXOs into the single Signer's UTXO. This separate transaction fee happens automatically and is set to a max of 80k sats. This is automatically deducted from your minted sBTC. This is not a Signer fee but a regular bitcoin transaction fee.

**Choose the Stacks address from the Stacks vault**

Next, enter the Stacks address you would like your sBTC minted to. For this guide, we'll be using the Stacks address of the Stacks vault that is assumed to be setup by both Member\_1 and Member\_2.

**Select Fee Rate**

Depending on congestion of the Bitcoin network, choose the appropriate fee rate based on your vault's preferences for timely confirmation.

**Confirm the transaction creation**

Whomever member, of the 2-of-2 multi-signature setup, is currently acting as the context of the sBTC Bridge embedded app, a popup modal of that member's wallet will appear for confirmation. In this guide, is it Member\_1 that is acting as the context and is currently connected with the Bitcoin vault using Xverse. Therefore, the Xverse wallet popup will appear for confirmation.

Remember, this transaction is the initial peg-in transfer for your BTC to the sBTC Signers.

> **NOTE:**
If you have a multi-signature setup with certain signatures required, hitting 'Confirm' will not broadcast the bitcoin transaction, it will simply store this partially signed transaction in your Bitcoin vault until all required signatures are met.

**Sign and approve transaction by other members**

Upon notice of transaction to the other members of the multi-signature setup, each necessary member will need to approve the pending transaction in their own respective Asigna Bitcoin vaults.

In our case, Member\_2 will navigate to their own Bitcoin vault and find the pending partially signed bitcoin transaction waiting for signature.

**Broadcasting of transaction**

Once all transaction policies are satisfied and approved, the sBTC Bridge embedded app will appear with a prompt confirming that all signatures have been gathered successfully which will then automatically prompt the broadcasting of the transaction.

**Receive your sBTC**

Back in the sBTC Bridge app UI, you can monitor the status of your transaction to see when it has been completed, at which point you can see the sBTC in your Fordefi wallet. It will go through three stages:

* Pending - Your [Bitcoin transaction](https://mempool.space/tx/838ebd2c78091ca805ff00c2a2182d2e9c652bd9b43ef286c3af33d1a414f587) is processing
* Minting - Your Bitcoin transaction has processed and the [sBTC signers are minting](https://explorer.hiro.so/txid/fef3dd3f6d4e6c89f3482fdec3816822261f29739ee81d1af6deb01d11e43961?chain=mainnet) your sBTC
* Completed - Your sBTC has been minted to your Asigna Stacks vault wallet

### Reclaiming BTC

If your sBTC mint fails, you can reclaim your sBTC. You can do this via the bridge by visiting the reclaim page at <https://sbtc.stacks.co/\\>\<TX\_ID>/reclaim and replacing the bracketed text with your transaction ID as shown below:\
<https://sbtc.stacks.co/8f37f750b6646f0a217121201967170bd3cfef5f2ebd4f30f359b5e9308470c4/reclaim>

There is an intermediate step in between depositing BTC and the sBTC signers consolidating it into the single signer UTXO. If the transaction is not picked up by signers, you can reclaim it using this UI. Note there is a 'Lock Time' field on the Reclaim page. That indicates the amount of blocks that must have passed in order to reclaim your BTC.

This initiates a Bitcoin transaction that will transfer your BTC back to you.