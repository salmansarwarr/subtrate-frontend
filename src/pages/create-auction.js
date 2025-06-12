import { useState } from 'react';
import Layout from '@/components/Layout';

export default function CreateAuction() {
  return (
    <Layout>
      {({ api, selectedAccount }) => (
        <CreateAuctionForm api={api} selectedAccount={selectedAccount} />
      )}
    </Layout>
  );
}

function CreateAuctionForm({ api, selectedAccount }) {
  const [collectionId, setCollectionId] = useState('');
  const [itemId, setItemId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const { web3FromAddress } = await import('@polkadot/extension-dapp');
      const injector = await web3FromAddress(selectedAccount.address);

      const extrinsic = api.tx.template.listNftForAuction(
        collectionId,
        itemId
      );

      await extrinsic.signAndSend(
        selectedAccount.address,
        { signer: injector.signer },
        ({ status, dispatchError }) => {
          if (dispatchError) {
            if (dispatchError.isModule) {
              const decoded = api.registry.findMetaError(dispatchError.asModule);
              throw new Error(`${decoded.section}.${decoded.name}: ${decoded.docs.join(' ')}`);
            } else {
              throw new Error(dispatchError.toString());
            }
          }

          if (status.isInBlock) {
            setSuccess(true);
            setCollectionId('');
            setItemId('');
          }
        }
      );
    } catch (error) {
      console.error('Failed to create auction:', error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Auction</h1>

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Auction created successfully! Your NFT is now listed for auction.
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="collectionId" className="block text-sm font-medium text-gray-700">
              Collection ID
            </label>
            <input
              type="number"
              id="collectionId"
              value={collectionId}
              onChange={(e) => setCollectionId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="itemId" className="block text-sm font-medium text-gray-700">
              Item ID
            </label>
            <input
              type="number"
              id="itemId"
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Creating Auction...' : 'Create Auction'}
          </button>
        </form>
      </div>
    </div>
  );
}