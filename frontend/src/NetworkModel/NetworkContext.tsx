import {createContext, ReactNode, useContext, useState} from 'react';
import {Network} from "./network.ts";

interface NetworkContextType {
  network: Network | null;
  setNetwork: (network: Network | null) => void;
  highlightedChannelId: string | null;
  setHighlightedChannelId: (channelId: string | null) => void;
  selectedNodeId: string | null;
  setSelectedNodeId: (nodeId: string | null) => void;
  selectedEdgeId: string | null;
  setSelectedEdgeId: (edgeId: string | null) => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider = ({children}: { children: ReactNode }) => {
  const [network, setNetwork] = useState<Network | null>(null);
  const [highlightedChannelId, setHighlightedChannelId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  return (
    <NetworkContext.Provider value={{
      network,
      setNetwork,
      highlightedChannelId,
      setHighlightedChannelId,
      selectedNodeId,
      setSelectedNodeId,
      selectedEdgeId,
      setSelectedEdgeId
    }}>
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
