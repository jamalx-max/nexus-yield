// Custom hook for USDCx withdrawal operations (Stacks -> Ethereum)
import { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { useStacksWallet } from '../providers/StacksWalletProvider';
import { 
  ADDRESSES,
  ETHEREUM_DOMAIN,
  type WithdrawState,
  MIN_WITHDRAW_AMOUNT,
} from '../lib/bridge';
import { getFriendlyErrorMessage } from '../lib/utils';

export function useWithdraw() {
  const { address: ethAddress } = useAccount();
  const { address: stacksAddress, isConnected: stacksConnected } = useStacksWallet();
  const [withdrawState, setWithdrawState] = useState<WithdrawState>({ status: 'idle' });

  /**
   * Withdraw USDCx from Stacks to USDC on Ethereum.
   * Calls the burn function on the usdcx-v1 contract.
   * @param amount - Amount of USDCx to withdraw
   * @param ethRecipient - Optional Ethereum recipient address (defaults to connected wallet)
   */
  const withdrawToEthereum = useCallback(async (amount: string, ethRecipient?: string) => {
    if (!stacksAddress) throw new Error('Stacks wallet not connected');
    
    const recipient = ethRecipient || ethAddress;
    if (!recipient) throw new Error('Ethereum recipient address required');

    const amountNum = Number(amount);
    if (amountNum < MIN_WITHDRAW_AMOUNT) {
      throw new Error(`Minimum withdrawal amount is ${MIN_WITHDRAW_AMOUNT} USDCx`);
    }

    setWithdrawState({ status: 'burning', amount, ethRecipient: recipient });

    try {
      const { openContractCall } = await import('@stacks/connect');
      const { 
        uintCV, 
        bufferCV,
        PostConditionMode, 
        makeStandardFungiblePostCondition,
        FungibleConditionCode,
        createAssetInfo 
      } = await import('@stacks/transactions');
      const network = await import('@stacks/network');

      // Convert amount to micro USDCx (6 decimals)
      const amountMicroUsdc = Math.floor(amountNum * 1_000_000);
      
      // Get contract addresses
      const [usdcxV1Address, usdcxV1Name] = ADDRESSES.USDCX_V1.split('.');
      const [tokenAddress, tokenName] = ADDRESSES.USDCX_TOKEN.split('.');

      // Pad Ethereum address to 32 bytes (left-padded)
      const recipientHex = recipient.replace('0x', '').toLowerCase();
      const paddedRecipient = recipientHex.padStart(64, '0');
      
      // Convert to Uint8Array for bufferCV
      const recipientBuffer = new Uint8Array(32);
      for (let i = 0; i < 32; i++) {
        recipientBuffer[i] = parseInt(paddedRecipient.slice(i * 2, i * 2 + 2), 16);
      }

      // Build function arguments for the burn call
      // burn(amount: uint, native-domain: uint, native-recipient: (buff 32))
      const functionArgs = [
        uintCV(amountMicroUsdc),
        uintCV(ETHEREUM_DOMAIN),
        bufferCV(recipientBuffer),
      ];

      // Post condition: user will send exactly the withdrawal amount in USDCx
      const postCondition = makeStandardFungiblePostCondition(
        stacksAddress,
        FungibleConditionCode.Equal,
        amountMicroUsdc,
        createAssetInfo(tokenAddress, tokenName, 'usdcx-token')
      );

      await openContractCall({
        network: network.STACKS_TESTNET,
        contractAddress: usdcxV1Address,
        contractName: usdcxV1Name,
        functionName: 'burn',
        functionArgs,
        postConditionMode: PostConditionMode.Deny,
        postConditions: [postCondition],
        onFinish: (data) => {
          console.log(`Withdrawal (burn) submitted! TX: ${data.txId}`);
          setWithdrawState({
            status: 'pending_attestation',
            stacksTxId: data.txId,
            amount,
            ethRecipient: recipient,
          });
        },
        onCancel: () => {
          console.log('Withdrawal cancelled');
          setWithdrawState({ status: 'idle' });
        },
      });

    } catch (error: any) {
      console.error('Withdrawal failed:', error);
      setWithdrawState({ 
        status: 'failed', 
        error: getFriendlyErrorMessage(error),
        amount,
        ethRecipient: recipient,
      });
      throw error;
    }
  }, [stacksAddress, ethAddress]);

  /**
   * Reset withdrawal state
   */
  const reset = useCallback(() => {
    setWithdrawState({ status: 'idle' });
  }, []);

  /**
   * Check if user can withdraw (has Stacks wallet connected and valid ETH address)
   */
  const canWithdraw = stacksConnected && !!ethAddress;

  return {
    withdrawState,
    withdrawToEthereum,
    reset,
    canWithdraw,
    minWithdrawAmount: MIN_WITHDRAW_AMOUNT,
  };
}
