# Real-Time Transaction Status Tracking

## Overview

ApexYield provides real-time transaction status tracking to keep users informed about their blockchain operations. The system automatically polls for transaction confirmations and updates the UI with live status information.

## Features

- ✅ **Real-time tracking** - Automatically polls transactions for status updates
- ✅ **Multi-chain support** - Tracks both Ethereum and Stacks transactions
- ✅ **Confirmation counting** - Shows block confirmations progress (e.g., 1/2)
- ✅ **Status badges** - Color-coded visual indicators for each state
- ✅ **Pending indicator** - Floating badge showing pending transaction count
- ✅ **Transaction list** - Filterable list with full transaction details
- ✅ **Block explorer links** - Direct links to Etherscan/Hiro Explorer
- ✅ **Error handling** - Displays errors with helpful messages
- ✅ **Estimated time** - Shows approximate time remaining for confirmation

## Transaction Status States

### TransactionStatus Enum

- **PENDING** - Transaction submitted to mempool
- **CONFIRMING** - Transaction included in block, awaiting confirmations
- **CONFIRMED** - Transaction fully confirmed (2+ blocks on ETH, 1+ on STX)
- **FAILED** - Transaction reverted or failed
- **CANCELLED** - User cancelled the transaction

### Transaction Types

- **APPROVE** - Token approval transaction
- **BRIDGE_DEPOSIT** - Ethereum → Stacks bridge deposit
- **BRIDGE_WITHDRAW** - Stacks → Ethereum bridge withdrawal
- **VAULT_DEPOSIT** - Deposit into yield vault
- **VAULT_WITHDRAW** - Withdrawal from yield vault

## Usage

### Using the Transaction Tracker

```typescript
import { useTransactionTrackerContext } from '../providers/TransactionTrackerProvider';
import { TransactionType, TransactionStatus } from '../lib/transactions';

function MyComponent() {
  const { addTransaction, trackTransaction } = useTransactionTrackerContext();

  const handleApprove = async () => {
    const hash = await writeContract(...);
    
    // Add transaction to tracker
    const txId = addTransaction({
      type: TransactionType.APPROVE,
      status: TransactionStatus.PENDING,
      hash,
      chain: 'ethereum',
      amount: '100',
      token: 'USDC',
    });

    // Start tracking (auto-polls for confirmations)
    const transaction = transactions.find(tx => tx.id === txId);
    if (transaction) {
      await trackTransaction(transaction);
    }
  };
}
```

### Displaying Transaction Status

```typescript
import { TransactionStatusBadge } from '../components/ui/transaction-status-badge';
import { TransactionItem } from '../components/ui/transaction-item';
import { TransactionList } from '../components/ui/transaction-list';

// Single badge
<TransactionStatusBadge 
  status={transaction.status}
  confirmations={transaction.confirmations}
  requiredConfirmations={2}
/>

// Single transaction item
<TransactionItem 
  transaction={transaction}
  onViewDetails={(tx) => console.log(tx)}
/>

// List of transactions
<TransactionList 
  transactions={transactions}
  showFilters={true}
  maxItems={10}
/>
```

### Pending Transactions Indicator

```typescript
import { PendingTransactionsIndicator } from '../components/ui/pending-transactions-indicator';

// In your app layout
<PendingTransactionsIndicator position="bottom-right" />
```

The indicator:
- Auto-shows when there are pending transactions
- Displays animated spinner and count
- Expands to show recent transactions on click
- Auto-hides when all transactions complete

## How It Works

### Transaction Lifecycle

1. **Submit** - User initiates transaction (approve, bridge, etc.)
2. **Add** - Transaction added to tracker with PENDING status
3. **Poll** - System automatically polls blockchain for status
4. **Update** - Status updates in real-time as confirmations increase
5. **Complete** - Final status (CONFIRMED or FAILED) displayed

### Polling Strategy

**Ethereum:**
- Polls every 3 seconds
- Checks receipt and block number
- Requires 2 confirmations for CONFIRMED status
- Timeout after 5 minutes

**Stacks:**
- Polls every 3 seconds
- Checks Hiro API for tx status
- Requires 1 confirmation for CONFIRMED status
- Timeout after 5 minutes

### Confirmation Requirements

```typescript
const REQUIRED_CONFIRMATIONS = {
  ethereum: 2, // 2 blocks (~24 seconds)
  stacks: 1,   // 1 block (~10 minutes)
};
```

## Components

### TransactionStatusBadge
Color-coded badge showing transaction status with optional confirmation count.

**Props:**
- `status` - TransactionStatus enum value
- `confirmations?` - Current confirmation count
- `requiredConfirmations?` - Total confirmations needed

### TransactionItem
Card displaying full transaction details with explorer link.

**Props:**
- `transaction` - Transaction object
- `onViewDetails?` - Callback for details button
- `showChain?` - Show chain badge (ETH/STX)
- `compact?` - Compact mode for lists

### TransactionList
Filterable list of transactions with empty states.

**Props:**
- `transactions` - Array of transactions
- `onViewDetails?` - Details callback
- `showFilters?` - Show status/type filters
- `maxItems?` - Limit number displayed
- `compact?` - Compact item mode
- `emptyMessage?` - Custom empty state message

### PendingTransactionsIndicator
Floating indicator showing pending count with expandable panel.

**Props:**
- `className?` - Additional CSS classes
- `position?` - 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

## Integration with Hooks

The transaction tracker integrates seamlessly with existing hooks:

```typescript
// In useBridge.ts
const { addTransaction, trackTransaction } = useTransactionTrackerContext();

// After approval
const hash = await writeApprove(...);
const txId = addTransaction({
  type: TransactionType.APPROVE,
  status: TransactionStatus.PENDING,
  hash,
  chain: 'ethereum',
  amount,
  token: 'USDC',
});

// Start tracking
const tx = transactions.find(t => t.id === txId);
if (tx) trackTransaction(tx);
```

## Error Handling

The tracker gracefully handles:
- Network errors during polling
- Transaction reverts
- Timeouts (5-minute max)
- Invalid transaction hashes
- RPC failures

Errors are displayed in the transaction item with suggestions for resolution.

## Best Practices

1. **Always track transactions** - Add every blockchain operation to tracker
2. **Set correct chain** - Ensure 'ethereum' or 'stacks' is set correctly
3. **Include metadata** - Add amount, token, addresses for better UX
4. **Handle errors** - Check for tracking failures and show user feedback
5. **Limit history** - Use `maxItems` to avoid performance issues with long lists

## Future Improvements

- [ ] Persistent transaction history across sessions
- [ ] Export transaction history as CSV/JSON
- [ ] Push notifications for transaction completion
- [ ] Advanced filtering (date range, address, amount)
- [ ] Transaction retry mechanism for failed txs
- [ ] Gas price tracking and optimization suggestions
- [ ] Multi-wallet transaction aggregation
