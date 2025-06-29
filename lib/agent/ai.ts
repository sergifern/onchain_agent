import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { Task } from '@/lib/mongodb/tasks';
import { askLoky, getMarketData } from '@/lib/dapplooker/utils';
import { getAssetBySymbol } from '../assets/utils';

/**
 * AI Task Reasoning System with Market Analysis
 * 
 * This system passes the user's prompt directly to askLoky to get market insights,
 * then uses OpenAI to reason about task execution based on that data.
 */

// Define the response schema for the AI reasoning
const TaskReasoningSchema = z.object({
  reasoning: z.string().describe("Detailed reasoning about why to execute or not execute the task"),
  shouldExecute: z.boolean().describe("Whether the task should be executed or not"),
  adaptedAmount: z.number().describe("The adapted amount for execution (cannot exceed original amount)")
});

export type TaskReasoningResult = z.infer<typeof TaskReasoningSchema>;


async function getMarketInsights(task: Task, assetSymbol: string): Promise<string> {
  try {
    if (!assetSymbol || assetSymbol === 'custom') {
      return "No market data available for custom asset";
    }

    // conver tteh asset symbol to token address
    const tokenAddress = getAssetBySymbol(assetSymbol)?.address;


    // Use the user's prompt directly with askLoky
    const lokyPrompt = `Geep deep analysis of the market for token ${tokenAddress} on base chain`;
    console.log(`Using user prompt directly: ${lokyPrompt}`);
    
    try {
      const response = await askLoky(lokyPrompt);
      return response;
     
    } catch (error) {
      console.error(`Error getting market insight:`, error);
      return `Market data unavailable for ${assetSymbol} - ${error instanceof Error ? error.message : 'Unknown error'}`;
    }

  } catch (error) {
    console.error('Error fetching market insights:', error);
    return `Market data unavailable for ${assetSymbol}`;
  }
}

/**
 * Uses OpenAI to reason about whether to execute a task based on the task details,
 * user prompt, and current market conditions.
 * 
 * @param task - The task to analyze
 * @param additionalContext - Optional additional context for the AI to consider
 * @returns Promise<TaskReasoningResult> - The AI's reasoning and execution decision
 */
export async function reasonAboutTaskExecution(
  task: Task,
  additionalContext?: string
): Promise<TaskReasoningResult> {
  try {
    // Get market insights for the target asset
    const assetSymbol = task.asset && 'symbol' in task.asset ? task.asset.symbol : 'custom';
    console.log(`Fetching market insights for ${assetSymbol}...`);
    
    let marketInsights = '';
    if (assetSymbol === 'VIRTUALS') {
      marketInsights = await getMarketData('VIRTUAL');
    } else {
      marketInsights = await getMarketData(assetSymbol);
    }
    console.log("Market insights received", JSON.stringify(marketInsights));

    const systemPrompt = `You are an expert AI agent specialized in crypto trading and DeFi operations.
    
    Your role is to analyze trading tasks and make intelligent decisions about whether to execute them based on:

1. The user's intent and conditions specified in their prompt
2. The task type and parameters

User task are always buy or sell, and we have base currency and amount (so when buy, its the asset we use to pay and the amount, and when sell is the output asset and the amount)

Always provide clear, actionable reasoning for your decisions based on both technical and fundamental analysis.`;

    const userPrompt = `Analyze this trading task and decide whether to execute it:

**Task Details:**
- Type: ${task.type}
- Amount to be used to perfom the action: ${task.amount} ${task.baseCurrency.symbol}
- Target Asset: ${assetSymbol}
- User Condition/Prompt: "${task.condition}"

**Market Insights & Data for the token:**
${JSON.stringify(marketInsights)}


Based on this information, provide:
1. Detailed reasoning about whether this task should be executed now, considering:
   - User's specified conditions and triggers
2. A clear yes/no decision on execution

Consider the user's intent mainly, and use the market insights to make your decision.`;

    const result = await generateObject({
      model: openai('gpt-4o'),
      system: systemPrompt,
      prompt: userPrompt,
      schema: TaskReasoningSchema,
      temperature: 0.3,
    });

    // Validate that adapted amount doesn't exceed original
    if (result.object.adaptedAmount > task.amount) {
      result.object.adaptedAmount = task.amount;
      result.object.reasoning += ` [Note: Adapted amount was capped at original amount of ${task.amount}]`;
    }

    // Ensure adapted amount is positive if execution is recommended
    if (result.object.shouldExecute && result.object.adaptedAmount <= 0) {
      result.object.adaptedAmount = Math.min(task.amount, 1); // Minimum execution amount
      result.object.reasoning += ` [Note: Adapted amount was set to minimum execution value]`;
    }

    return result.object;

  } catch (error) {
    console.error('Error in AI task reasoning:', error);
    
    // Return a safe fallback response
    return {
      reasoning: `Error occurred during AI reasoning: ${error instanceof Error ? error.message : 'Unknown error'}. Market data may be unavailable. Defaulting to no execution for safety.`,
      shouldExecute: false,
      adaptedAmount: 0
    };
  }
}

/**
 * Simplified version for quick decision making without detailed reasoning
 */
export async function quickTaskDecision(task: Task): Promise<boolean> {
  try {
    const result = await reasonAboutTaskExecution(task);
    return result.shouldExecute;
  } catch (error) {
    console.error('Error in quick task decision:', error);
    return false; // Default to safe no-execution
  }
}

/**
 * Get market insights for a specific asset (utility function)
 */
export async function getAssetMarketData(assetSymbol: string, userPrompt: string = `What is the current market data for ${assetSymbol}?`): Promise<string> {
  try {
    const response = await askLoky(userPrompt);
    if (response && typeof response === 'object') {
      return response.data || response.answer || response.result || JSON.stringify(response);
    } else if (typeof response === 'string') {
      return response;
    } else {
      return `Market analysis completed for ${assetSymbol}`;
    }
  } catch (error) {
    console.error('Error getting market data:', error);
    return `Market data unavailable for ${assetSymbol}`;
  }
}
