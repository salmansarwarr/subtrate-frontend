"use client";

import dynamic from "next/dynamic";

const DynamicAuctionList = dynamic(() => import("./AuctionList.js"), {
    loading: () => <p>Loading...</p>,
    ssr: false,
});

export default function NextjsAuctionList({ api, selectedAccount }) {
    return <DynamicAuctionList api={api} selectedAccount={selectedAccount} />;
}
