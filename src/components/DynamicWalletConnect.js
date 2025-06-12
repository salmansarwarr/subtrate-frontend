"use client";

import dynamic from "next/dynamic";

const DynamicWalletConnect = dynamic(() => import("./WalletConnect.js"), {
    loading: () => <p>Loading...</p>,
    ssr: false,
});

export default function NextjsWalletConnect({ onAccountSelect }) {
    return <DynamicWalletConnect onAccountSelect={onAccountSelect} />;
}
