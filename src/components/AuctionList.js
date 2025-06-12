import { useState, useEffect } from 'react';
import AuctionCard from './AuctionCard';

export default function AuctionList({ api, selectedAccount }) {
  const [auctions, setAuctions] = useState([]);
  const [unfilteredAuctions, setUnfilteredAuctions] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active'); 

  useEffect(() => {
    if (api) {
      loadAuctions();
    }
  }, [api, filter]);

  const loadAuctions = async () => {
    try {
      setLoading(true);
      const auctionEntries = await api.query.template.auctions.entries();
      console.log(auctionEntries)
      
      const auctionData = await Promise.all(
        auctionEntries.map(async ([key, value]) => {
          const [collectionId, itemId] = key.args;
          const auctionInfo = value.toHuman();
          
          // Get NFT metadata if available
          let nftData = null;
          try {
            const nftInfo = await api.query.uniques.asset(collectionId, itemId);
            nftData = nftInfo.toHuman();
          } catch (error) {
            console.warn('Could not fetch NFT data:', error);
          }

          return {
            collectionId: collectionId.toString(),
            itemId: itemId?.toString(),
            ...auctionInfo,
            nftData
          };
        })
      );

      // Filter auctions based on selected filter
      const filteredAuctions = auctionData.filter(auction => {
        if (filter === 'active') return !auction.ended;
        if (filter === 'ended') return auction.ended;
        return true;
      });

      setAuctions(filteredAuctions);
      setUnfilteredAuctions(auctionData);
    } catch (error) {
      console.error('Failed to load auctions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-48 bg-gray-300 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { key: 'active', label: 'Active Auctions', count: unfilteredAuctions.filter(a => !a.ended).length },
          { key: 'ended', label: 'Ended Auctions', count: unfilteredAuctions.filter(a => a.ended).length },
          { key: 'all', label: 'All Auctions', count: unfilteredAuctions.length }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === tab.key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Auction Grid */}
      {auctions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-gray-600">No auctions found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction) => (
            <AuctionCard
              key={`${auction.collectionId}-${auction.itemId}`}
              auction={auction}
              api={api}
              selectedAccount={selectedAccount}
              onUpdate={loadAuctions}
            />
          ))}
        </div>
      )}
    </div>
  );
}