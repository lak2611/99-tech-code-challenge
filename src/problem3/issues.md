- Priority is computed again and again -> need a solution to optimize, maybe we can use useCallback to memoize the priority function

- The variable of lhsPriority is not declared or defined in this snippet. Seems that it should be the balancePriority computed in the filter function.

- The formattedBalances computation is currently redundant. I suggest we can compute the formatted value directly when we filter it (applied to the element that is true in the filter function) (when we compute the sortedBalances).

- The blockchain property is not declared in the WalletBalance interface.

- The definition of 2 interfaces is some kind of redundant. We can merge them into one interface with optional formated property.

- We shouldn't put the prices to the dependencies array when we calculate the sortedBalances. It will cause the component to re-render unnecessarily. The prices don't directly affect the sortedBalances.

- In the getPriority function, when the number of blockchain increases (for example: more than 100 blockchains), the code will be very long and hard to maintain. We can use a map to store the priority of each blockchain. And the function only need to return the priority of the blockchain or -99 if the blockchain is not found.

- The computations of rows should also be memoized so that we don't need to compute them again and again. The dependencies should be the sortedBalances and the prices.

- The key of the rows should be the unique identifier of the balance. For example, the currency and the blockchain or wallet address or something else.

- Many things that not declared or defined in this snippet (BoxProps, useWalletBalances, usePrices,...)
