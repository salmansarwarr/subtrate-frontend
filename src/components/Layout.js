import { useState, useEffect } from 'react';
import { connectToSubstrate } from '../lib/substrate';
import NextjsWalletConnect from './DynamicWalletConnect';
import Navigation from './Navigation';

export default function Layout({ children }) {
  const [api, setApi] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    initializeSubstrate();
  }, []);

  const initializeSubstrate = async () => {
    try {
      const substrateApi = await connectToSubstrate();
      setApi(substrateApi);
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect to Substrate:', error);
      setIsConnected(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        api={api} 
        selectedAccount={selectedAccount} 
        isConnected={isConnected}
      />
      
      <div className="container mx-auto px-4 py-8">
        {!isConnected ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Connecting to Substrate...</p>
            </div>
          </div>
        ) : !selectedAccount ? (
          <div className="max-w-md mx-auto">
            <NextjsWalletConnect onAccountSelect={setSelectedAccount} />
          </div>
        ) : (
          <div className="space-y-6">
            {children({ api, selectedAccount })}
          </div>
        )}
      </div>
    </div>
  );
}