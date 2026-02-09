# Error Handling Guide

## Overview

ApexYield implements a comprehensive error handling system that provides:
- **Categorized errors** - Errors are classified by type (wallet, network, transaction, etc.)
- **Severity levels** - Each error has a severity rating (low, medium, high, critical)
- **User-friendly messages** - Technical errors are translated to clear, actionable messages
- **Suggested actions** - Errors include guidance on how to resolve them
- **Multiple display modes** - Errors can be shown as toasts, inline alerts, or both

## Error Categories

### Wallet Errors
- User rejected transaction
- Wallet not connected
- Wallet locked
- Wrong wallet connected

### Network Errors
- Wrong network/chain
- Network connection issues
- RPC errors
- Timeout errors

### Transaction Errors
- Insufficient funds
- Insufficient gas
- Transaction reverted
- Nonce issues

### Contract Errors
- Allowance errors
- Contract execution failures

### Bridge Errors
- Deposit failures
- Attestation timeouts
- Mint failures

### Validation Errors
- Invalid amounts
- Invalid addresses
- Amount too low/high

## Usage Examples

### Using the Error Parser

```typescript
import { getParsedError } from '../lib/utils';

try {
  // Some operation
  await writeContract(...);
} catch (error) {
  const parsedError = getParsedError(error);
  console.log(parsedError.category); // ErrorCategory.TRANSACTION
  console.log(parsedError.severity); // ErrorSeverity.HIGH
  console.log(parsedError.message); // "Insufficient funds to complete this transaction."
  console.log(parsedError.suggestedAction); // "Please ensure you have enough funds..."
}
```

### Displaying Toast Notifications

```typescript
import { useToast } from '../providers/ToastProvider';

function MyComponent() {
  const { showError, showSuccess } = useToast();

  const handleSubmit = async () => {
    try {
      await someOperation();
      showSuccess('Operation completed successfully!');
    } catch (error) {
      const parsedError = getParsedError(error);
      showError(parsedError.message, parsedError);
    }
  };
}
```

### Displaying Inline Errors

```typescript
import { ErrorAlert } from '../components/ui/error-alert';
import { getParsedError } from '../lib/utils';

function MyForm() {
  const [error, setError] = useState<ParsedError | null>(null);

  const handleSubmit = async () => {
    try {
      await someOperation();
      setError(null);
    } catch (err) {
      setError(getParsedError(err));
    }
  };

  return (
    <div>
      <ErrorAlert error={error} onDismiss={() => setError(null)} />
      {/* Form content */}
    </div>
  );
}
```

### Custom Error Messages

```typescript
import { ERROR_MESSAGES } from '../lib/errors';

// Validate input
if (!isValidAmount(amount)) {
  throw new Error(ERROR_MESSAGES.INVALID_AMOUNT);
}

if (amount < MIN_AMOUNT) {
  throw new Error(ERROR_MESSAGES.AMOUNT_TOO_LOW);
}
```

## Best Practices

1. **Always use getParsedError()** - Don't use raw error messages
2. **Show suggested actions** - Help users understand how to fix the issue
3. **Use appropriate display method**:
   - Toast: For background operations, confirmations
   - Inline alert: For form validation, immediate feedback
4. **Log errors in dev mode** - The system automatically logs to console in development
5. **Store error state** - Keep track of error category and severity for analytics
6. **Provide recovery paths** - Make sure users can retry or cancel operations

## Error State Management

### In Hooks

```typescript
export interface BridgeState {
  status: BridgeStatus;
  error?: string;              // User-friendly message
  errorCategory?: ErrorCategory; // For categorization
  errorSeverity?: ErrorSeverity; // For UI styling
}
```

### In Components

```typescript
const [error, setError] = useState<ParsedError | null>(null);

// Set error
catch (err) {
  const parsedError = getParsedError(err);
  setError(parsedError);
}

// Clear error
setError(null);
```

## Future Improvements

- [ ] Error analytics and reporting
- [ ] Sentry integration for production error tracking
- [ ] Retry mechanisms for recoverable errors
- [ ] Error rate limiting to prevent spam
- [ ] Localization support for error messages
