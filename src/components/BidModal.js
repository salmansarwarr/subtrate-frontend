import { useState } from "react";
import { formatBalance, parseBalance } from "../utils/format";
import { web3FromAddress } from "@polkadot/extension-dapp";

export default function BidModal({
    auction,
    api,
    selectedAccount,
    onClose,
    onSuccess,
}) {
    const [bidAmount, setBidAmount] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const injector = await web3FromAddress(selectedAccount.address);

            const bidAmountParsed = parseBalance(bidAmount);

            // Validate bid amount
            if (bidAmountParsed <= parseBalance(auction.highestBid)) {
                throw new Error("Bid must be higher than current highest bid");
            }

            const collectionId = Number(auction.collectionId[1]); // or parseInt(collectionIdString, 10)
            const itemId = Number(auction.collectionId[3]);

            console.log(                collectionId,
                itemId,
                bidAmountParsed)
            const extrinsic = api.tx.template.placeBid(
                collectionId,
                itemId,
                bidAmountParsed
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
                        alert("Auction resolved successfully!");
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

    const minBid =
        auction.highestBid === "0"
            ? "0.1"
            : (parseFloat(formatBalance(auction.highestBid)) + 0.1).toString();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Place Your Bid</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="mb-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">
                            Current Highest Bid
                        </p>
                        <p className="text-lg font-semibold">
                            {auction.highestBid === "0"
                                ? "No bids yet"
                                : `${formatBalance(auction.highestBid)} UNIT`}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Bid Amount (UNIT)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            min={minBid}
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={`Minimum: ${minBid}`}
                            required
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Minimum bid: {minBid} UNIT
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    <div className="flex space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !bidAmount}
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? "Placing Bid..." : "Place Bid"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
