import { createContext, useContext, useState, ReactNode } from 'react';
import { Network } from "./network.ts";

interface NetworkContextType {
  network: Network | null;
  setNetwork: (network: Network | null) => void;
  highlightedChannelId: string | null;
  setHighlightedChannelId: (channelId: string | null) => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider = ({ children }: { children: ReactNode }) => {
  const [network, setNetwork] = useState<Network | null>(null);
  const [highlightedChannelId, setHighlightedChannelId] = useState<string | null>(null);

  return (
    <NetworkContext.Provider value={{ network, setNetwork, highlightedChannelId, setHighlightedChannelId }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = (): NetworkContextType => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};
