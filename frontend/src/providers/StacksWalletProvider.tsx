import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { showConnect } from '@stacks/connect';
import { userSession, stacksAuthOptions } from '../config/stacks';

interface StacksWalletContextType {
  isConnected: boolean;
  address: string | null;
  connect: () => void;
  disconnect: () => void;
}

const StacksWalletContext = createContext<StacksWalletContextType>({
  isConnected: false,
  address: null,
  connect: () => {},
  disconnect: () => {},
});

export function useStacksWallet() {
  return useContext(StacksWalletContext);
}

interface StacksWalletProviderProps {
  children: React.ReactNode;
}

export function StacksWalletProvider({ children }: StacksWalletProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      setIsConnected(true);
      setAddress(userData.profile.stxAddress.testnet);
    }
  }, []);

  const handleConnect = useCallback(() => {
    showConnect({
      ...stacksAuthOptions,
      onFinish: () => {
        if (userSession.isUserSignedIn()) {
          const userData = userSession.loadUserData();
          setIsConnected(true);
          setAddress(userData.profile.stxAddress.testnet);
        }
      },
    });
  }, []);

  const handleDisconnect = useCallback(() => {
    userSession.signUserOut();
    setIsConnected(false);
    setAddress(null);
  }, []);

  return (
    <StacksWalletContext.Provider
      value={{
        isConnected,
        address,
        connect: handleConnect,
        disconnect: handleDisconnect,
      }}
    >
      {children}
    </StacksWalletContext.Provider>
  );
}
