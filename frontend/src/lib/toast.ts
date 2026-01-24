import toast from 'react-hot-toast';

/**
 * Toast utility wrapper for consistent styling and behavior
 * Configured for terminal/cyber aesthetic
 */

export const showToast = {
  /**
   * Success toast - Green with checkmark
   */
  success: (message: string) => {
    toast.success(message, {
      duration: 4000,
      position: 'top-center',
      style: {
        background: '#0a0a0a',
        color: '#10b981',
        border: '1px solid #10b981',
        padding: '12px 16px',
        fontSize: '14px',
        fontFamily: 'monospace',
      },
      iconTheme: {
        primary: '#10b981',
        secondary: '#0a0a0a',
      },
    });
  },

  /**
   * Error toast - Red with X icon
   */
  error: (message: string) => {
    toast.error(message, {
      duration: 6000, // Longer duration for errors
      position: 'top-center',
      style: {
        background: '#0a0a0a',
        color: '#ef4444',
        border: '1px solid #ef4444',
        padding: '12px 16px',
        fontSize: '14px',
        fontFamily: 'monospace',
      },
      iconTheme: {
        primary: '#ef4444',
        secondary: '#0a0a0a',
      },
    });
  },

  /**
   * Loading toast - Shows until dismissed or resolved
   */
  loading: (message: string) => {
    return toast.loading(message, {
      position: 'top-center',
      style: {
        background: '#0a0a0a',
        color: '#94a3b8',
        border: '1px solid #334155',
        padding: '12px 16px',
        fontSize: '14px',
        fontFamily: 'monospace',
      },
    });
  },

  /**
   * Info toast - Neutral blue/gray
   */
  info: (message: string) => {
    toast(message, {
      duration: 4000,
      position: 'top-center',
      icon: 'ℹ️',
      style: {
        background: '#0a0a0a',
        color: '#60a5fa',
        border: '1px solid #60a5fa',
        padding: '12px 16px',
        fontSize: '14px',
        fontFamily: 'monospace',
      },
    });
  },

  /**
   * Promise toast - Automatically transitions from loading to success/error
   */
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      {
        position: 'top-center',
        style: {
          background: '#0a0a0a',
          color: '#94a3b8',
          border: '1px solid #334155',
          padding: '12px 16px',
          fontSize: '14px',
          fontFamily: 'monospace',
        },
        success: {
          style: {
            background: '#0a0a0a',
            color: '#10b981',
            border: '1px solid #10b981',
          },
          iconTheme: {
            primary: '#10b981',
            secondary: '#0a0a0a',
          },
        },
        error: {
          style: {
            background: '#0a0a0a',
            color: '#ef4444',
            border: '1px solid #ef4444',
          },
          iconTheme: {
            primary: '#ef4444',
            secondary: '#0a0a0a',
          },
        },
      }
    );
  },

  /**
   * Dismiss a specific toast by ID
   */
  dismiss: (toastId: string) => {
    toast.dismiss(toastId);
  },

  /**
   * Dismiss all active toasts
   */
  dismissAll: () => {
    toast.dismiss();
  },
};

/**
 * Helper to format transaction hashes for toasts
 */
export function shortenTxHash(hash: string, chars = 6): string {
  if (!hash) return '';
  return `${hash.substring(0, chars + 2)}...${hash.substring(hash.length - chars)}`;
}

/**
 * Helper to create explorer link for transaction
 */
export function getTxExplorerUrl(txId: string, chain: 'ethereum' | 'stacks'): string {
  if (chain === 'ethereum') {
    return `https://sepolia.etherscan.io/tx/${txId}`;
  }
  return `https://explorer.hiro.so/txid/${txId}?chain=testnet`;
}
