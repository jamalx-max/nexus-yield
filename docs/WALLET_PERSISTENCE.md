# Wallet Connection State Persistence

## Overview

ApexYield automatically persists wallet connection state across browser sessions, allowing users to stay connected when they return to the app. This feature improves UX by eliminating the need to reconnect wallets on every visit.

## Features

- ✅ **Auto-reconnect** - Automatically restores wallet connection on app load
- ✅ **Dual wallet support** - Persists both Ethereum and Stacks wallet connections
- ✅ **Stale connection detection** - Clears connections older than 7 days
- ✅ **Address validation** - Ensures saved address matches current connection
- ✅ **User preferences** - Respects auto-connect preference setting
- ✅ **Cross-tab sync** - Syncs connection state across browser tabs
- ✅ **Type-safe storage** - Type-safe localStorage utilities with error handling

## How It Works

### Ethereum Wallets

1. User connects wallet via RainbowKit/WalletConnect
2. `useWalletPersistence` hook saves connection state to localStorage
3. On next app load, hook checks for saved connection
4. If valid and not stale, automatically reconnects using saved connector
5. On disconnect, clears saved state

### Stacks Wallets

1. User connects Stacks wallet (Hiro, Xverse, etc.)
2. `useStacksWalletPersistence` hook saves connection state
3. On next app load, hook checks for saved connection
4. If valid and not stale, automatically reconnects
5. On disconnect, clears saved state

### Storage Keys

All wallet state is stored in localStorage using namespaced keys:

- `apexYield_walletConnected` - Boolean flag for Ethereum wallet
- `apexYield_walletType` - Type of Ethereum wallet connector
- `apexYield_lastConnectedAddress` - Last connected Ethereum address
- `apexYield_stacksWalletConnected` - Boolean flag for Stacks wallet
- `apexYield_stacksLastConnectedAddress` - Last connected Stacks address
- `apexYield_connectionTimestamp` - When connection was established
- `apexYield_userPreferences` - User preference settings

## Usage

### Automatic Integration

The hooks are automatically integrated into the wallet providers:

```typescript
// WalletProvider.tsx
<WalletPersistenceWrapper>
  {children}
</WalletPersistenceWrapper>

// StacksWalletProvider.tsx
useStacksWalletPersistence({
  address,
  isConnected,
  connect: handleConnect,
  disconnect: handleDisconnect,
});
```

### Manual Control

You can manually clear persisted connections:

```typescript
import { useWalletPersistence } from '../hooks/useWalletPersistence';

function MyComponent() {
  const { clearPersistedConnection } = useWalletPersistence();

  const handleClearConnection = () => {
    clearPersistedConnection(); // Clears state and disconnects
  };
}
```

### User Preferences

Users can control auto-connect behavior via preferences:

```typescript
import { useUserPreferences } from '../hooks/useUserPreferences';

function SettingsPanel() {
  const { preferences, updatePreference } = useUserPreferences();

  return (
    <label>
      <input
        type="checkbox"
        checked={preferences.autoConnectWallet}
        onChange={(e) => updatePreference('autoConnectWallet', e.target.checked)}
      />
      Auto-connect wallet on app load
    </label>
  );
}
```

## Storage Utilities

### Safe Read/Write

```typescript
import { getStorageItem, setStorageItem } from '../lib/storage';

// Get item (with type safety)
const value = getStorageItem<string>('myKey');

// Set item (auto JSON stringify)
setStorageItem('myKey', { foo: 'bar' });

// Remove item
removeStorageItem('myKey');
```

### Storage Availability Check

```typescript
import { isStorageAvailable } from '../lib/storage';

if (!isStorageAvailable()) {
  console.warn('localStorage not available');
}
```

## Security Considerations

1. **No sensitive data** - Only stores addresses and connection state, no private keys
2. **Address validation** - Validates saved address matches current connection
3. **Stale detection** - Auto-clears connections older than 7 days
4. **Error handling** - Gracefully handles localStorage quota/access errors
5. **User control** - Users can disable auto-connect via preferences

## Edge Cases Handled

- **localStorage unavailable** - Gracefully degrades, no persistence
- **Quota exceeded** - Catches and logs errors
- **Stale connections** - Auto-clears connections >7 days old
- **Address mismatch** - Updates saved address if different
- **Provider not ready** - Delays restoration to ensure providers initialized
- **Connection failure** - Clears saved state on failed reconnection

## Best Practices

1. **Always respect preferences** - Check `autoConnectWallet` before restoring
2. **Handle errors gracefully** - Don't throw on storage failures
3. **Validate addresses** - Ensure saved address matches current
4. **Clear on disconnect** - Always clear state when user disconnects
5. **Log in dev mode** - Log storage operations for debugging

## Future Improvements

- [ ] Support for multiple connected wallets
- [ ] Session-based storage as fallback
- [ ] Encrypted storage for additional security
- [ ] Analytics on connection restoration success rate
- [ ] User notification when auto-connect occurs
