import Link from "next/link";
import { useRouter } from "next/router";

export default function Navigation({ selectedAccount, isConnected }) {
    const router = useRouter();

    const navItems = [
        { name: "Auctions", href: "/", icon: "🏛️" },
        { name: "Create Auction", href: "/create-auction", icon: "➕" },
    ];

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <Link
                            href="/"
                            className="text-xl font-bold text-blue-600"
                        >
                            NFT Auction
                        </Link>

                        {isConnected && (
                            <div className="flex space-x-6">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                                            router.pathname === item.href
                                                ? "bg-blue-100 text-blue-700"
                                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                        }`}
                                    >
                                        <span>{item.icon}</span>
                                        <span>{item.name}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {selectedAccount && (
                        <div className="flex items-center space-x-4">
                            <div className="bg-gray-100 rounded-lg px-3 py-2">
                                <p className="text-sm font-medium text-gray-900">
                                    {selectedAccount.meta.name}
                                </p>
                                <p className="text-xs text-gray-500 font-mono">
                                    {selectedAccount.address.slice(0, 8)}...
                                    {selectedAccount.address.slice(-8)}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
