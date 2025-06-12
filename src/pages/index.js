import NextjsAuctionList from "@/components/DynamicAuctionList";
import Layout from "@/components/Layout";

export default function Home() {
    return (
        <Layout>
            {({ api, selectedAccount }) => (
                <NextjsAuctionList
                    api={api}
                    selectedAccount={selectedAccount}
                />
            )}
        </Layout>
    );
}
