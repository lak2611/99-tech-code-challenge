// Fixed version addressing all issues from issues.md

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // Added missing blockchain property
  formatted?: string; // Made optional to merge interfaces
}

// Removed redundant FormattedWalletBalance interface as suggested

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // Use a map object to store the priority of each blockchain for better maintainability when blockchain count increases
  const blockchainPriorities = {
    Osmosis: 100,
    Ethereum: 50,
    Arbitrum: 30,
    Zilliqa: 20,
    Neo: 20,
  };

  // Memoize the priority function to avoid repeated computations
  const getPriority = useCallback((blockchain: string): number => {
    return blockchainPriorities[blockchain] || -99;
  }, []);

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        if (balancePriority > -99) {
          if (balance.amount <= 0) {
            balance.formatted = balance.amount.toFixed();
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
        return 0; // Added missing return for equal priorities
      });
  }, [balances, getPriority]); // Removed prices from dependencies as it doesn't affect sorting

  // Memoize rows computation to avoid repeated calculations
  const rows = useMemo(() => {
    return sortedBalances.map((balance: WalletBalance) => {
      const usdValue = prices[balance.currency] * balance.amount;
      // Use unique identifier for key instead of index
      const uniqueKey = `${balance.currency}-${balance.blockchain}-${balance.amount}`;

      return <WalletRow className={classes.row} key={uniqueKey} amount={balance.amount} usdValue={usdValue} formattedAmount={balance.formatted} />;
    });
  }, [sortedBalances, prices]); // Dependencies: sortedBalances and prices

  return <div {...rest}>{rows}</div>;
};
