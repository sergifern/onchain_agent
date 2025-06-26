/// echeck if user waitlist...

import { NextResponse, NextRequest } from 'next/server';
import { verifyUserAuth } from '@/lib/privy/users';
import { deployContract } from 'viem/actions';
import { createTask, TaskType } from '@/lib/mongodb/tasks';
import { getTasksByUserId } from '@/lib/mongodb/tasks';


export async function GET(req: NextRequest) {
  try {
    const user = await verifyUserAuth(req)


    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const allTasks = await getTasksByUserId(user as string)
    
    // Filter out deleted tasks
    const tasks = allTasks.filter(task => !task.isDeleted)
    console.log(tasks)

    return NextResponse.json({
      tasks,
      success: true 
    }, { status: 200 });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await verifyUserAuth(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const {
      condition,
      type,
      amount,
      currency,
      baseCurrency,
      frequency,
      scheduledTime,
      lastExecutionTime,
    } = await req.json();

    if (!condition || !type || !amount || !currency || !baseCurrency || !frequency) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Validate currency object (this is the asset to trade)
    if (currency.symbol !== 'custom' && (!currency.symbol || !currency.address || !currency.chain || currency.decimals === undefined)) {
      return NextResponse.json({ 
        error: 'Invalid currency data' 
      }, { status: 400 });
    }
    
    // Calculate nextExecutionTime based on frequency
    const calculateNextExecutionTime = (frequency: string, scheduledTime?: Date): Date => {
      const now = new Date();
      
      if (frequency === 'daily' && scheduledTime) {
        // For daily tasks with specific time, find next occurrence
        const next = new Date(scheduledTime);
        next.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());
        
        // If the time has already passed today, schedule for tomorrow
        if (next <= now) {
          next.setDate(next.getDate() + 1);
        }
        return next;
      } else {
        // For interval-based tasks, calculate from now
        const intervals: Record<string, number> = {
          '5m': 5 * 60 * 1000,
          '15m': 15 * 60 * 1000,
          '30m': 30 * 60 * 1000,
          '1h': 60 * 60 * 1000,
          '4h': 4 * 60 * 60 * 1000,
          '12h': 12 * 60 * 60 * 1000,
          'daily': 24 * 60 * 60 * 1000,
        };
        
        const interval = intervals[frequency] || intervals['1h']; // Default to 1h
        return new Date(now.getTime() + interval);
      }
    };

    const nextExecution = calculateNextExecutionTime(frequency, scheduledTime ? new Date(scheduledTime) : undefined);

    // create task
    const task = await createTask({
      userId: user as string,
      name: `${type} ${currency.symbol === 'custom' ? 'Custom' : currency.symbol}`, // Auto-generate name
      condition,
      type: type as TaskType,
      amount: Number(amount),
      baseCurrency: baseCurrency,
      asset: currency.symbol === 'custom' ? { symbol: 'custom' } : {
        symbol: currency.symbol,
        address: currency.address,
        chain: currency.chain,
        decimals: currency.decimals,
      },
      frequency,
      scheduledTime: scheduledTime ? new Date(scheduledTime) : undefined,
      lastExecutionTime: lastExecutionTime ? new Date(lastExecutionTime) : undefined,
      nextExecutionTime: nextExecution,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ 
      task,
      status: 'success' 
    }, { status: 200 });

  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
