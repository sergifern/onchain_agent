'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from '@/hooks/use-toast';
import { getAccessToken, usePrivy } from '@privy-io/react-auth';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PageContainer from '@/components/page-container';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import InfoTooltip from '@/components/info-tooltip';
import PageLoader from '@/components/page-loader';

const editFormSchema = z.object({
  userInput: z.string().min(10, {
    message: 'Prompt must be at least 10 characters long',
  }),
});

type EditFormValues = z.infer<typeof editFormSchema>;

interface Task {
  _id: string;
  name: string;
  condition: string;
  type: string;
  amount: number;
  baseCurrency: {
    symbol: string;
  };
  asset: {
    symbol: string;
  };
  frequency: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditTaskPage() {
  const params = useParams();
  const router = useRouter();
  const { getAccessToken } = usePrivy();
  
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const taskId = params.id as string;
  
  // Helper function to generate prefix from task data
  const generatePrefix = (task: Task) => {
    const actionText = task.type === 'buy' ? 'buy' : 
                      task.type === 'buy-and-stake' ? 'buy and stake' : 
                      'perform action on';
    
    const assetSymbol = task.asset?.symbol || '[Asset]';
    const currencySymbol = task.baseCurrency?.symbol || 'USDC';
    
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
    
    const frequencyText = getFrequencyText(task.frequency);
    
    return `Check ${frequencyText} to ${actionText} ${assetSymbol} using ${currencySymbol} if `;
  };
  
  // Helper function to extract user input from stored condition
  const extractUserInput = (condition: string, prefix: string) => {
    if (condition.startsWith(prefix)) {
      return condition.substring(prefix.length);
    }
    // Fallback: if prefix doesn't match exactly, try to find "if " and take everything after
    const ifIndex = condition.lastIndexOf(' if ');
    if (ifIndex !== -1) {
      return condition.substring(ifIndex + 4);
    }
    // If no "if" found, return the whole condition as fallback
    return condition;
  };
  
  const form = useForm<EditFormValues>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      userInput: '',
    },
    mode: 'onChange',
  });

  // Fetch task data
  useEffect(() => {
    const fetchTask = async () => {
      try {
        setIsLoading(true);
        const accessToken = await getAccessToken();
        const response = await fetch(`/api/users/agents/tasks/${taskId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch task');
        }

        const data = await response.json();
        setTask(data.task);
        
        // Generate prefix and extract user input
        const prefix = generatePrefix(data.task);
        const userInput = extractUserInput(data.task.condition, prefix);
        
        // Update form with extracted user input
        form.setValue('userInput', userInput);
        
      } catch (error) {
        console.error('Error fetching task:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load task data",
        });
        router.push('/agent/tasks');
      } finally {
        setIsLoading(false);
      }
    };

    if (taskId) {
      fetchTask();
    }
  }, [taskId, getAccessToken, form, toast, router]);

  const onSubmit = async (data: EditFormValues) => {
    try {
      setIsSubmitting(true);
      const accessToken = await getAccessToken();

      // Reconstruct the full condition with prefix + user input
      const prefix = task ? generatePrefix(task) : '';
      const fullCondition = prefix + data.userInput;

      const response = await fetch(`/api/users/agents/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          condition: fullCondition,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update task');
      }

      toast({
        title: "Success",
        description: "Task updated successfully",
      });
      router.push('/agent/tasks');
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to update task',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      buy: "bg-green-500/10 text-emerald-600",
      sell: "bg-red-500/10 text-red-600",
      'buy-and-stake': "bg-blue-500/10 text-blue-600",
    };
    return (
      <Badge className={`${colors[type as keyof typeof colors] || 'bg-gray-500/10 text-gray-500'}`}>
        {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' & ')}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return (
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-3 h-3 bg-emerald-700 rounded-full"></div>
            <div className="absolute inset-0 w-3 h-3 bg-emerald-600 rounded-full animate-ping opacity-75"></div>
          </div>
          <span className="text-sm font-medium text-emerald-600">Active</span>
        </div>
      );
    }
    
    return (
      <Badge className="bg-gray-500/10 text-gray-500">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <PageContainer title="Edit Smart Automation" description="Loading data...">
        <PageLoader />
      </PageContainer>
    );
  }

  if (!task) {
    return (
      <PageContainer title="Smart Automation Not Found" description="The requested Smart Automation could not be found">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-muted-foreground mb-4">Smart Automation not found or you don't have permission to access it.</p>
          <Link href="/agent/tasks">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tasks
            </Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Edit Smart Automation" description="Modify your automation settings">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/agent/tasks">
            <Button variant="ghost" className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tasks
            </Button>
          </Link>
        </div>

        {/* Task Info Display */}
        <Card className="mb-6 border border-none bg-card text-card-foreground card-outline">
          <CardHeader>
            <CardTitle>Task Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Type</label>
                <div className="mt-1">{getTypeBadge(task.type)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Amount / Base Currency</label>
                <p className="text-sm">{task.amount} {task.baseCurrency?.symbol}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Asset</label>
                <p className="text-sm">{task.asset?.symbol}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Frequency</label>
                <p className="text-sm">{task.frequency}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">{getStatusBadge(task.status)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="border border-none bg-transparent p-0">
          <CardHeader className="px-0">
            <CardTitle>Edit Agent Prompt</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="userInput"
                  render={({ field }) => {
                    const prefix = task ? generatePrefix(task) : 'Loading...';

                    return (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>
                            <div className="flex items-center gap-2">
                              Agent Prompt
                              <InfoTooltip message="The prompt/condition for your Agent to evaluate before performing the action." />
                            </div>
                          </FormLabel>
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

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Updating Task...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Update Task
                    </div>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
} 