"use client";

import { useState } from "react";
import { useWallet } from "../hooks/useWallet";

export default function WalletConnect({ onAccountSelect }) {
    const { accounts, isLoading, error, connectWallet } = useWallet();
    const [selectedAccount, setSelectedAccount] = useState(null);

    const handleAccountSelect = (account) => {
        setSelectedAccount(account);
        onAccountSelect(account);
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center">
                    <div className="text-red-500 mb-4">
                        <svg
                            className="mx-auto h-12 w-12"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Connection Error
                    </h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={connectWallet}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Connect Your Wallet
            </h2>

            {accounts.length === 0 ? (
                <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">
                        <svg
                            className="mx-auto h-12 w-12"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                    </div>
                    <p className="text-gray-600 mb-4">
                        No accounts found. Please install Polkadot extension.
                    </p>
                    <button
                        onClick={connectWallet}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Connect Wallet
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {accounts.map((account) => (
                        <button
                            key={account.address}
                            onClick={() => handleAccountSelect(account)}
                            className={`w-full p-4 rounded-lg border-2 transition-all ${
                                selectedAccount?.address === account.address
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="text-left">
                                    <p className="font-medium text-gray-900">
                                        {account.meta.name}
                                    </p>
                                    <p className="text-sm text-gray-500 font-mono">
                                        {account.address.slice(0, 8)}...
                                        {account.address.slice(-8)}
                                    </p>
                                </div>
                                {selectedAccount?.address ===
                                    account.address && (
                                    <div className="text-blue-500">
                                        <svg
                                            className="h-5 w-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
