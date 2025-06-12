import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import { useState, useEffect } from "react";

export const useWallet = () => {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const loadWallet = async () => {
            try {
                const extensions = await web3Enable("My Substrate App");

                if (extensions.length === 0) {
                    setError("No Polkadot extension found");
                    setIsLoading(false);
                    return;
                }

                const allAccounts = await web3Accounts();

                if (isMounted) {
                    setAccounts(allAccounts);
                    setIsLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message);
                    setIsLoading(false);
                }
            }
        };

        loadWallet();

        return () => {
            isMounted = false;
        };
    }, []);

    const selectAccount = (account) => {
        setSelectedAccount(account);
    };

    return {
        accounts,
        selectedAccount,
        selectAccount,
        isLoading,
        error,
    };
};
