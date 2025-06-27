'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ASSETS } from '@/lib/assets/assets';
import { Asset, getTokenPriceBySymbol, getTokenPricesBySymbols } from '@/lib/assets/utils';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowDownToLine, ArrowUpDown, ArrowUpFromLine, ChartLine, Coins, Wallet, Clock, Check, ChevronsUpDown } from 'lucide-react';
import PageContainer from '@/components/page-container';
import { getAccessToken, usePrivy } from '@privy-io/react-auth';
import Image from 'next/image';
import Link from 'next/link';
import InfoTooltip from '@/components/info-tooltip';
import TokenMentions from '@/components/mention/mention';
import { truncateAddress, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const taskFormSchema = z.object({
  frequency: z.enum(['5m', '15m', '30m', '1h', '4h', '12h', 'daily'], {
    required_error: 'Please select a frequency',
  }),
  scheduledTime: z.date().optional(),
  action: z.enum(['buy', 'buy-and-stake', 'stake', 'transfer', 'sell', 'yield-optimization'], {
    required_error: 'Please select an action',
  }),
  asset: z.object({
    symbol: z.string(),
    address: z.string(),
    chain: z.string(),
    decimals: z.number(),
  }),
  baseCurrency: z.enum(['ETHY', 'USDC', 'VIRTUALS'], {
    required_error: 'Please select a base currency',
  }),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Amount must be a positive number',
  }),
  prompt: z.string().min(10, {
    message: 'Prompt must be at least 10 characters long',
  }),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

const baseCurrencyOptions = [
  {
    value: 'USDC',
    label: 'USDC',
    description: 'USD Coin',
    icon: "https://assets.coingecko.com/coins/images/6319/standard/usdc.png?1696506694",
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    decimals: 6,
  },
  {
    value: 'ETHY',
    label: 'ETHY',
    description: 'Ethy AI',
    icon: "/img/icon.png",
    address: "0xC44141a684f6AA4E36cD9264ab55550B03C88643",
    decimals: 18,
  },
  {
    value: 'VIRTUALS',
    label: 'VIRTUALS',
    description: 'Virtuals Protocol',
    icon: "https://assets.coingecko.com/coins/images/34057/standard/LOGOMARK.png?1708356054",
    address: "0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b",
    decimals: 18,
  },
];

function getUsdValue(amount: string, currency: string, prices: Record<string, number>): string {
  const n = parseFloat(amount);
  //console.log(amount, currency, prices);
  if (isNaN(n)) return '$0.00';
  
  const price = prices[currency] || 0;
  return `$${(n * price).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export default function AddTaskPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getAccessToken } = usePrivy();
  const [isLoading, setIsLoading] = useState(true);
  const [agent, setAgent] = useState(null);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [pricesLoading, setPricesLoading] = useState(true);
  const [assetComboboxOpen, setAssetComboboxOpen] = useState(false);
  
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      frequency: '1h',
      action: 'buy',
      asset: ASSETS[0],
      baseCurrency: 'USDC',
      amount: '0.00',
      prompt: '',
    },
    mode: 'onChange',
  });

  // Fetch token prices once at the beginning
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setPricesLoading(true);
        
        // Get all symbols at once
        const symbols = baseCurrencyOptions.map(option => option.value);
        const priceResults = await getTokenPricesBySymbols(symbols);
        
        //console.log('Price results:', priceResults);
        
        const pricesMap = priceResults.reduce((acc, { symbol, price }) => {
          acc[symbol] = price;
          return acc;
        }, {} as Record<string, number>);
        
        setPrices(pricesMap);
      } catch (error) {
        console.error('Error fetching token prices:', error);
        // Fallback to default prices if API fails
        setPrices({
          'ETHY': 0.0004,
          'USDC': 1,
          'VIRTUALS': 1.6,
        });
      } finally {
        setPricesLoading(false);
      }
    };

    fetchPrices();
  }, []);

  useEffect(() => {
    const getAgent = async () => {
      try {
        setIsLoading(true);
        const accessToken = await getAccessToken();
        const response = await fetch(`/api/users/agents`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        const data = await response.json();

        setAgent(data.agent);
      } catch (err) {
        console.error("Error checking namespace mint status:", err);
      } finally {
        setIsLoading(false);
      }
    };

    getAgent();
  }, []);

  const onSubmit = async (data: TaskFormValues) => {
    //console.log('Form submitted with data:', data);
    //console.log('Form errors:', form.formState.errors);
    
    try {
      setIsSubmitting(true);
      const accessToken = await getAccessToken();

      // Generate the full prompt by concatenating prefix + user input for non-yield-optimization actions
      let fullPrompt = data.prompt;
      if (data.action !== 'yield-optimization') {
        const actionText = data.action === 'buy' ? 'Buy' : 
                          data.action === 'buy-and-stake' ? 'Buy and Stake' : 
                          'Perform action on';
        
        const assetSymbol = data.asset?.symbol || '[Select Asset]';
        const currencySymbol = data.baseCurrency || 'USDC';
        const prefix = `${actionText} ${assetSymbol} using ${currencySymbol} if `;
        
        fullPrompt = prefix + data.prompt;
      }

      const response = await fetch('/api/users/agents/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          condition: fullPrompt,
          type: data.action,
          amount: data.amount,
          currency: data.asset,
          frequency: data.frequency,
          baseCurrency: {
            symbol: data.baseCurrency,
            address: baseCurrencyOptions.find(option => option.value === data.baseCurrency)?.address || '',
            chain: 'base',
            decimals: baseCurrencyOptions.find(option => option.value === data.baseCurrency)?.decimals || 18,
          },
          scheduledTime: data.scheduledTime ? data.scheduledTime.toISOString() : undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create task');
      }

      toast({
        title: "Success",
        description: "Smart Automation created successfully",
      });
      router.push('/agent/tasks'); // Redirect to tasks list
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to create task',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const actionOptions = [
    {
      value: 'buy',
      label: 'Buy',
      description: 'Fill your bags with your rules, good for Limit Orders or DCA',
      icon: ChartLine,
    },
    {
      value: 'buy-and-stake',
      label: 'Buy + Stake',
      description: 'Purchase any tokens and stake them instantly on Virtuals*',
      icon: ArrowDownToLine,
    },
    /*{
      value: 'swap',
      label: 'Swap',
      description: 'Buy and sell partially',
      icon: ArrowUpDown,
    },*/
    /*{
      value: 'transfer',
      label: 'Transfer',
      description: 'Transfer tokens to another address',
      icon: Wallet,
    },*/
    {
      value: 'yield-optimization',
      label: 'Yield Optimization',
      description: 'AI-powered yield optimizer for your stablecoins — your agent hunts the best onchain returns, auto-compounds rewards, and reinvests 24/7.',
      icon: ArrowUpFromLine,
    },
    /*{
      value: 'stake',
      label: 'Stake',
      description: 'Stake your tokens for rewards',
      icon: Coins,
    },*/
  ];

  return (
    <PageContainer title="Create Smart Automation" description="Create a new automation for the agent to execute">
      <div className="max-w-2xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className="flex items-center gap-2">
                      Frequency
                      <InfoTooltip message="The frequency of the Smart Automation, to define when the Agent will evaluate the prompt." />
                    </div>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-secondary text-foreground border-0 rounded-md">
                      <SelectItem value="5m" disabled>5 minutes (soon)</SelectItem>
                      <SelectItem value="15m" disabled>15 minutes (soon)</SelectItem>
                      <SelectItem value="30m" disabled>30 minutes (soon)</SelectItem>
                      <SelectItem value="1h">1 hour</SelectItem>
                      <SelectItem value="4h">4 hours</SelectItem>
                      <SelectItem value="12h">12 hours</SelectItem>
                      <SelectItem value="daily">Every day at custom time</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch('frequency') === 'daily' && (
              <FormField
                control={form.control}
                name="scheduledTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Daily Execution Time</FormLabel>
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={field.value ? field.value.toTimeString().slice(0, 5) : "00:00"}
                        onChange={(e) => {
                          const date = field.value || new Date();
                          const [hours, minutes] = e.target.value.split(':');
                          date.setHours(parseInt(hours), parseInt(minutes), 0);
                          field.onChange(date);
                        }}
                        className="bg-background pr-0 w-20 appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                      />
                      <span className="text-sm text-muted-foreground">Your local time</span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="action"
              render={({ field }) => (
                <FormItem className="space-y-3 mt-6">
                  <FormLabel>                      
                    <div className="flex items-center gap-2">
                      Action 
                      <InfoTooltip message="Limited to one action per automation right now. Will be expanded in the future and also being able to define multiple actions on the Agent prompt." />
                    </div>
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {actionOptions.filter(option => option.value !== 'yield-optimization').map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.value} id={option.value} />
                            <label
                              htmlFor={option.value}
                              className="flex-1 cursor-pointer"
                            >
                              <Card className="p-4 bg-secondary/10 hover:bg-secondary/60 transition-colors">
                                <div className="flex items-center space-x-4">
                                  <div className="p-2 bg-primary/10 rounded-lg">
                                    <option.icon className="h-6 w-6 text-violeta" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{option.label}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {option.description}
                                    </p>
                                  </div>
                                </div>
                              </Card>
                            </label>
                          </div>
                        ))}
                      </div>
                      
                      {/* Yield Optimization - Full width */}
                      {actionOptions.filter(option => option.value === 'yield-optimization').map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.value} id={option.value} disabled={true} />
                          <label
                            htmlFor={option.value}
                            className="flex-1 cursor-pointer"
                          >
                            <Card className="p-4 bg-secondary/10 hover:bg-secondary/10">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 max-w-[85%]">
                                  <div className="p-2 bg-primary/10 rounded-lg">
                                    <option.icon className="h-6 w-6 text-violeta" />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium">{option.label}</p>
                                      <Badge className="text-xs bg-transparent border border-white text-white hover:bg-transparent hover:border-white">Soon</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {option.description}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-3xl font-bold text-violeta font-funnel">6.6%</p>
                                  <p className="text-xs text-muted-foreground">Current APY</p>
                                </div>
                              </div>
                            </Card>
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="baseCurrency"
              render={({ field }) => {
                const selectedAction = form.watch('action');
                const isYieldOptimization = selectedAction === 'yield-optimization';
                
                // Auto-select USDC when Yield Optimization is selected
                if (isYieldOptimization && field.value !== 'USDC') {
                  field.onChange('USDC');
                }
                
                return (
                  <FormItem className="space-y-3 mt-6">
                    <FormLabel>
                      <div className="flex items-center gap-2">
                        Base Currency
                        <InfoTooltip message="The base currency to use on this Smart Automation. If buy, you need to ensure you have balance enough. For selling, it will be the output of the action." />
                      </div>
                    </FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {baseCurrencyOptions.map((option) => {
                          const isDisabled = isYieldOptimization && option.value !== 'USDC';
                          return (
                            <div
                              key={option.value}
                              onClick={() => !isDisabled && field.onChange(option.value)}
                              className={`transition-all rounded-2xl ${
                                isDisabled 
                                  ? 'opacity-50 cursor-not-allowed' 
                                  : 'cursor-pointer'
                              } ${
                                field.value === option.value
                                  ? 'ring-2 ring-white/40 bg-secondary/30'
                                  : ''
                              }`}
                            >
                              <Card className={`p-4 bg-secondary/10 transition-colors ${
                                isDisabled 
                                  ? '' 
                                  : 'hover:bg-secondary/60'
                              }`}>
                                <div className="flex items-center space-x-4">
                                  <div className="rounded-full overflow-hidden">
                                    <Image src={option.icon} alt={option.label} className="h-8 w-8" width={40} height={40} />
                                  </div>
                                  <div>
                                    <p className="font-medium">{option.label}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {option.description}
                                    </p>
                                  </div>
                                </div>
                              </Card>
                            </div>
                          );
                        })}
                      </div>
                    </FormControl>
                    <div 
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        field.value === 'ETHY' 
                          ? 'max-h-32 opacity-100 translate-y-0' 
                          : 'max-h-0 opacity-0 -translate-y-2'
                      }`}
                    >
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {form.watch('action') !== 'yield-optimization' && (
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => {
                  const currency = form.watch('baseCurrency');
                  return (
                    <FormItem className="mt-6">
                      <FormLabel>
                        <div className="flex items-center gap-2">
                          Amount 
                          <InfoTooltip message="The max amount used for this automation (range or extra conditions can be defined in the Agent prompt)" />
                        </div>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            step="any"
                            value={field.value}
                            onChange={field.onChange}
                            className="pr-16 bg-background w-full"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium select-none">
                            {currency}
                          </span>
                        </div>
                      </FormControl>
                      <div className="text-xs text-muted-foreground mt-1">
                        {pricesLoading ? (
                          <span>Loading price...</span>
                        ) : (
                          `≈ ${getUsdValue(field.value, currency, prices)}`
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            )}

            {form.watch('action') !== 'yield-optimization' && (
              <FormField
                control={form.control}
                name="asset"
                render={({ field }) => (
                  <FormItem className="flex flex-col mt-8">
                    <FormLabel>
                    <div className="flex items-center gap-2">
                        Asset to perform action on
                        <InfoTooltip message="If buy, is the output of the action. If sell, is the asset selling. Will be expanded in the future to support multiple tokens to be defined in the Agent prompt." />
                      </div>
                    </FormLabel>
                    <Popover open={assetComboboxOpen} onOpenChange={setAssetComboboxOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={assetComboboxOpen}
                            className={cn(
                              "w-full justify-between bg-background",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value?.symbol === 'custom' 
                              ? "Custom or Multiple tokens (to be defined in prompt)"
                              : field.value
                              ? `${field.value.symbol} (${truncateAddress(field.value.address)})`
                              : "Select asset"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0 bg-secondary text-foreground border-0 rounded-md">
                        <Command className="bg-secondary">
                          <CommandInput
                            placeholder="Search asset..."
                            className="h-9 border-0 focus:ring-0 bg-secondary"
                          />
                          <CommandList className="bg-secondary">
                            <CommandEmpty>No asset found.</CommandEmpty>
                            <CommandGroup className="bg-secondary">
                              {ASSETS.map((asset: Asset) => (
                                <CommandItem
                                  value={`${asset.symbol} ${asset.address}`}
                                  key={asset.address}
                                  onSelect={() => {
                                    field.onChange(asset);
                                    setAssetComboboxOpen(false);
                                  }}
                                >
                                  {asset.symbol} ({truncateAddress(asset.address)})
                                  <Check
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      field.value?.address === asset.address
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                              {/*<CommandItem
                                value="custom multiple tokens"
                                onSelect={() => {
                                  field.onChange({
                                    symbol: 'custom',
                                    address: '',
                                    chain: '',
                                    decimals: 18
                                  });
                                  setAssetComboboxOpen(false);
                                }}
                              >
                                Custom or Multiple tokens (to be defined in prompt)
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    field.value?.symbol === 'custom'
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>*/}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {form.watch('action') !== 'yield-optimization' && (
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => {
                  const action = form.watch('action');
                  const baseCurrency = form.watch('baseCurrency');
                  const asset = form.watch('asset');
                  const frequency = form.watch('frequency');

                  // Generate the dynamic prefix based on selections
                  const generatePrefix = () => {
                    const actionText = action === 'buy' ? 'buy' : 
                                    action === 'buy-and-stake' ? 'buy and stake' : 
                                    'perform action on';
                    
                    const assetSymbol = asset?.symbol || '[Select Asset]';
                    const currencySymbol = baseCurrency || 'USDC';
                    
                    // Convert frequency to readable format
                    const getFrequencyText = (freq: string) => {
                      switch (freq) {
                        case '5m': return 'every 5 minutes';
                        case '15m': return 'every 15 minutes';
                        case '30m': return 'every 30 minutes';
                        case '1h': return 'every hour';
                        case '4h': return 'every 4 hours';
                        case '12h': return 'every 12 hours';
                        case 'daily': return 'daily';
                        default: return 'periodically';
                      }
                    };
                    
                    const frequencyText = getFrequencyText(frequency);
                    
                    return `Check ${frequencyText} to ${actionText} ${assetSymbol} using ${currencySymbol} if...`;
                  };

                  const prefix = generatePrefix();

                  return (
                    <FormItem className="mt-6">
                      <div className="flex items-center justify-between">
                        <FormLabel>
                          <div className="flex items-center gap-2">
                            Agent Prompt
                            <InfoTooltip message="The prompt/condition for your Agent to evaluate before performing the action. When ACP is integrated, your agent will be able to request insights from other Agents." />
                          </div>
                        </FormLabel>
                        <span className="text-sm font-medium text-muted-foreground">ACP integration in progress</span>
                      </div>
                      {/* Display prefix above textarea */}
                      <div className="mb-1 p-3 py-1 bg-secondary/20 rounded-md border border-dashed border-secondary">
                        <span className="text-sm font-medium text-violeta">{prefix}</span>
                      </div>
                      <FormControl>
                        <Textarea
                            value={field.value}
                            onChange={field.onChange}
                            rows={9}
                            placeholder={`Enter the condition you want your agent to evaluate. Ethy has access to technical analysis, social sentiment and mindshare.

For example:
...price drops below $0.01
...volume is growing in the last 24h
...mindshare is trending up and social sentiment is positive
...RSI is below 30 and price has dropped 20% this week`}
                            className="min-h-[100px] w-full placeholder:text-secondary rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            )}

            <div className="flex items-center justify-between gap-4 !pb-0 mt-6">
              <span className="text-sm font-medium text-muted-foreground">Cost:</span>
              <div className="flex items-center gap-1">
                <Image 
                  src="/img/ETHY_coin_2.png" 
                  alt="ETHY Credits" 
                  width={25} 
                  height={25} 
                />
                <span className="text-sm font-medium text-muted-foreground">50 credits ($ETHY) per execution</span>
              </div>
            </div>

            <div className="space-y-2 mt-2">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || isLoading || !agent}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Creating Automation...
                  </div>
                ) : (
                  'Create Smart Automation'
                )}
              </Button>
              
              {/* Debug info */}
              <div className="hidden text-xs text-muted-foreground space-y-1">
                <div>Button disabled: {String(isSubmitting || isLoading || !agent)}</div>
                <div>Is submitting: {String(isSubmitting)}</div>
                <div>Is loading: {String(isLoading)}</div>
                <div>Has agent: {String(!!agent)}</div>
                <div>Form valid: {String(form.formState.isValid)}</div>
                {Object.keys(form.formState.errors).length > 0 && (
                  <div>Errors: {Object.keys(form.formState.errors).join(', ')}</div>
                )}
              </div>
            </div>
          </form>
        </Form>

        {!isLoading && !agent && (
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Agent not deployed, first <Link href="/agent" className="text-violeta hover:underline hover:text-violeta/80">create your agent</Link>
            </p>
          </div>
        )}

        <div className="hidden text-xs text-muted-foreground mt-4">
          💡 Tip: Using $ETHY as base currency or when buying it will give you 30% cashback on Uniswap trading fees. Paid in $ETHY every 24 hours.
        </div>

        <p className="text-sm text-muted-foreground mt-4 hidden">1) Virtuals contracts unless Vader</p>
        <p className="text-sm text-muted-foreground hidden">2) $ETHY operations have cahsback 30% of the trading fee (calculated end of the day)</p>
      </div>
    </PageContainer>
  );
}
