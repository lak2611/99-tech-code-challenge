import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowDownUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './components/ui/form';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';

// Types for API response
interface PriceData {
  currency: string;
  date: string;
  price: number;
}

interface Token {
  code: string;
  price: number;
}

// Form validation schema
const formSchema = z.object({
  fromAmount: z
    .string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Amount must be a positive number',
    }),
  fromCurrency: z.string().min(1, 'Please select a token'),
  toCurrency: z.string().min(1, 'Please select a token'),
});

type FormValues = z.infer<typeof formSchema>;

// Helper function to get token icon URL
const getTokenIconUrl = (tokenCode: string): string => {
  return `https://raw.githubusercontent.com/Switcheo/token-icons/refs/heads/main/tokens/${tokenCode}.svg`;
};

// Token Icon Component
const TokenIcon = ({ tokenCode, className = 'w-5 h-5' }: { tokenCode: string; className?: string }) => {
  const [error, setError] = useState(false);
  const iconUrl = getTokenIconUrl(tokenCode);

  if (error) {
    return (
      <div className={`${className} rounded-full bg-slate-700 flex items-center justify-center text-xs font-medium`}>{tokenCode.slice(0, 2)}</div>
    );
  }

  return <img src={iconUrl} alt={tokenCode} className={className} onError={() => setError(true)} />;
};

function App() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromAmount: '',
      fromCurrency: 'USD',
      toCurrency: 'ETH',
    },
  });
  // log the form values
  console.log(form.getValues());
  // Fetch prices from API
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('https://interview.switcheo.com/prices.json');
        if (!response.ok) {
          throw new Error('Failed to fetch prices');
        }
        const data: PriceData[] = await response.json();

        // Process data: get latest price for each currency
        const tokenMap = new Map<string, { price: number; date: string }>();
        data.forEach((item) => {
          const existing = tokenMap.get(item.currency);
          if (!existing || new Date(item.date) > new Date(existing.date)) {
            tokenMap.set(item.currency, { price: item.price, date: item.date });
          }
        });

        // Convert to array and sort alphabetically
        const tokensList: Token[] = Array.from(tokenMap.entries())
          .map(([code, { price }]) => ({ code, price }))
          .sort((a, b) => a.code.localeCompare(b.code));

        setTokens(tokensList);

        // Set default currencies if available
        if (tokensList.length > 0) {
          const usdToken = tokensList.find((t) => t.code === 'USD');
          const ethToken = tokensList.find((t) => t.code === 'ETH');
          if (usdToken && ethToken) {
            form.setValue('fromCurrency', 'USD');
            form.setValue('toCurrency', 'ETH');
          } else {
            form.setValue('fromCurrency', tokensList[0].code);
            form.setValue('toCurrency', tokensList[Math.min(1, tokensList.length - 1)].code);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load prices');
        console.error('Error fetching prices:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate exchange rate between two tokens
  const calculateExchangeRate = (fromToken: string, toToken: string): number | null => {
    const from = tokens.find((t) => t.code === fromToken);
    const to = tokens.find((t) => t.code === toToken);

    if (!from || !to || from.price === 0) {
      return null;
    }

    // Both prices are in USD, so exchange rate = fromPrice / toPrice
    return from.price / to.price;
  };

  // Calculate estimated output amount
  const calculateEstimatedAmount = (amount: string, fromToken: string, toToken: string): string => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return '0.00';
    }

    const rate = calculateExchangeRate(fromToken, toToken);
    if (rate === null) {
      return '0.00';
    }

    const result = Number(amount) * rate;
    // Format with appropriate decimal places
    if (result < 0.01) {
      return result.toFixed(8);
    } else if (result < 1) {
      return result.toFixed(6);
    } else {
      return result.toFixed(2);
    }
  };

  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data);
    // Logic will be implemented later
  };

  const handleSwapCurrencies = () => {
    const fromCurrency = form.getValues('fromCurrency');
    const toCurrency = form.getValues('toCurrency');
    form.setValue('fromCurrency', toCurrency);
    form.setValue('toCurrency', fromCurrency);
  };

  const fromCurrency = form.watch('fromCurrency');
  const toCurrency = form.watch('toCurrency');
  const fromAmount = form.watch('fromAmount');
  const exchangeRate = calculateExchangeRate(fromCurrency, toCurrency);

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-slate-800">
      <Card className="w-full max-w-md bg-slate-900/80 backdrop-blur-sm border-slate-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Crypto Swap</CardTitle>
          <CardDescription className="text-slate-400">Exchange your assets from one token to another</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-slate-400">Loading prices...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-400">
              <p className="font-medium">Error loading prices</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          ) : tokens.length === 0 ? (
            <div className="text-center py-8 text-slate-400">No tokens available</div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* From Currency Section */}
                <div className="space-y-4 p-4 rounded-lg border bg-slate-800/50 border-slate-700">
                  <FormField
                    control={form.control}
                    name="fromAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-400">From</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="0.00"
                            className="text-lg h-12 bg-slate-800 border-slate-700 focus:ring-offset-slate-900 focus:ring-blue-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fromCurrency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-400">Token</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-slate-800 border-slate-700">
                              {fromCurrency ? (
                                <>
                                  <div className="flex items-center gap-2">
                                    <TokenIcon tokenCode={fromCurrency} className="w-5 h-5" />
                                    <span>{fromCurrency}</span>
                                  </div>
                                </>
                              ) : (
                                <SelectValue placeholder="Select token" />
                              )}
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-900 border-slate-700 text-white">
                            {tokens.map((token) => (
                              <SelectItem key={token.code} value={token.code}>
                                <div className="flex items-center gap-2">
                                  <TokenIcon tokenCode={token.code} className="w-5 h-5" />
                                  <span className="font-medium">{token.code}</span>
                                  <span className="text-xs text-slate-400">${token.price.toFixed(6)}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Swap Button */}
                <div className="flex justify-center -my-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="rounded-full h-10 w-10 border-0 bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/20 hover:opacity-90 transition-opacity"
                    onClick={handleSwapCurrencies}
                  >
                    <ArrowDownUp className="h-4 w-4" />
                  </Button>
                </div>

                {/* To Currency Section */}
                <div className="space-y-4 p-4 rounded-lg border bg-slate-800/50 border-slate-700">
                  <div>
                    <Label className="text-slate-400">To (Estimated)</Label>
                    <div className="mt-2 text-lg h-12 flex items-center px-3 rounded-md border bg-slate-800 text-slate-300 border-slate-700">
                      {calculateEstimatedAmount(fromAmount, fromCurrency, toCurrency)}
                    </div>
                    <p className="text-[0.8rem] text-slate-500 mt-2">Amount you will receive (estimated)</p>
                  </div>
                  <FormField
                    control={form.control}
                    name="toCurrency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-400">Token</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-slate-800 border-slate-700">
                              {toCurrency ? (
                                <>
                                  <div className="flex items-center gap-2">
                                    <TokenIcon tokenCode={toCurrency} className="w-5 h-5" />
                                    <span>{toCurrency}</span>
                                  </div>
                                </>
                              ) : (
                                <SelectValue placeholder="Select token" />
                              )}
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-900 border-slate-700 text-white">
                            {tokens.map((token) => (
                              <SelectItem key={token.code} value={token.code}>
                                <div className="flex items-center gap-2">
                                  <TokenIcon tokenCode={token.code} className="w-5 h-5" />
                                  <span className="font-medium">{token.code}</span>
                                  <span className="text-xs text-slate-400">${token.price.toFixed(6)}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Exchange Rate Display */}
                {fromCurrency && toCurrency && exchangeRate !== null && (
                  <div className="text-sm text-center text-slate-400">
                    1 {fromCurrency} ={' '}
                    {exchangeRate < 0.01 ? exchangeRate.toFixed(8) : exchangeRate < 1 ? exchangeRate.toFixed(6) : exchangeRate.toFixed(4)}{' '}
                    {toCurrency}
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 text-base bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold shadow-lg shadow-blue-500/30"
                  disabled={loading || tokens.length === 0}
                >
                  Swap Tokens
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-xs text-slate-500">
          <p>Exchange rates are based on current market prices and may vary</p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default App;
