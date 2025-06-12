// components/AuctionCard.js
import { useState } from "react";
import { formatBalance } from "../utils/format";
import BidModal from "./BidModal";
import { web3FromAddress } from "@polkadot/extension-dapp";

export default function AuctionCard({
    auction,
    api,
    selectedAccount,
    onUpdate,
}) {
    const [showBidModal, setShowBidModal] = useState(false);
    const [timeLeft, setTimeLeft] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isOwner = selectedAccount?.address === auction.owner;
    const canBid = !auction.ended && !isOwner;
    const hasHighestBid = auction.highestBidder === selectedAccount?.address;

    const resolveAuction = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const injector = await web3FromAddress(selectedAccount.address);

            const collectionId = Number(auction.collectionId[1]); // or parseInt(collectionIdString, 10)
            const itemId = Number(auction.collectionId[3]);

            const extrinsic = api.tx.template.resolveAuction(
                collectionId,
                itemId
            );

            await extrinsic.signAndSend(
                selectedAccount.address,
                { signer: injector.signer },
                ({ status, dispatchError }) => {
                    if (dispatchError) {
                        if (dispatchError.isModule) {
                            const decoded = api.registry.findMetaError(
                                dispatchError.asModule
                            );
                            throw new Error(
                                `${decoded.section}.${
                                    decoded.name
                                }: ${decoded.docs.join(" ")}`
                            );
                        } else {
                            throw new Error(dispatchError.toString());
                        }
                    }

                    if (status.isInBlock) {
                        onSuccess();
                    }
                }
            );
        } catch (error) {
            console.error("Bid failed:", error);
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* NFT Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <div className="text-white text-center">
                        <div className="text-4xl mb-2">🖼️</div>
                        <p className="text-sm opacity-90">
                            Collection: {auction.collectionId}
                        </p>
                        <p className="text-sm opacity-90">
                            Item: {auction.itemId}
                        </p>
                    </div>
                </div>

                <div className="p-6">
                    {/* Auction Status */}
                    <div className="flex items-center justify-between mb-4">
                        <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                                auction.ended
                                    ? "bg-gray-100 text-gray-800"
                                    : "bg-green-100 text-green-800"
                            }`}
                        >
                            {auction.ended ? "Ended" : "Active"}
                        </span>

                        {hasHighestBid && (
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                Your Bid
                            </span>
                        )}
                    </div>

                    {/* Current Bid */}
                    <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">
                            Current Highest Bid
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                            {auction.highestBid === "0"
                                ? "No bids yet"
                                : `${formatBalance(auction.highestBid)} UNIT`}
                        </p>
                        {auction.highestBidder && (
                            <p className="text-sm text-gray-500 font-mono">
                                by {auction.highestBidder.slice(0, 8)}...
                                {auction.highestBidder.slice(-8)}
                            </p>
                        )}
                    </div>

                    {/* Owner */}
                    <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">Owner</p>
                        <p className="text-sm font-mono text-gray-900">
                            {isOwner
                                ? "You"
                                : `${auction.owner.slice(
                                      0,
                                      8
                                  )}...${auction.owner.slice(-8)}`}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                        {canBid && (
                            <button
                                onClick={() => setShowBidModal(true)}
                                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Place Bid
                            </button>
                        )}

                        {isOwner && !auction.ended && auction.highestBidder && (
                            <button
                                onClick={(e) => resolveAuction(e)}
                                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                            >
                                Resolve Auction
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Bid Modal */}
            {showBidModal && (
                <BidModal
                    auction={auction}
                    api={api}
                    selectedAccount={selectedAccount}
                    onClose={() => setShowBidModal(false)}
                    onSuccess={() => {
                        setShowBidModal(false);
                        onUpdate();
                    }}
                />
            )}
        </>
    );
}
