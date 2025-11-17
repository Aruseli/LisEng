import { AI } from 'hasyx/lib/ai/ai';
import { OpenRouterProvider } from 'hasyx/lib/ai/providers/openrouter';
import { jsonrepair } from 'jsonrepair';

let aiInstance: AI | null = null;
let providerInstance: OpenRouterProvider | null = null;

export function getProvider(): OpenRouterProvider {
  if (!providerInstance) {
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY is not set in environment variables');
    }
    providerInstance = new OpenRouterProvider({
      token: process.env.OPENROUTER_API_KEY,
      model: process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet',
    });
  }
  return providerInstance;
}

function getAI(): AI {
  if (!aiInstance) {
    aiInstance = new AI({ provider: getProvider() });
  }
  return aiInstance;
}

/**
 * Parses JSON from an AI's text response, removing markdown formatting.
 * @param text The raw text response from the AI.
 * @returns The parsed JSON object.
 */
export function parseJSONResponse<T>(text: string): T {
  const cleanedText = text
    .replace(/```json\n?/gi, '')
    .replace(/```\n?/g, '')
    .trim();

  const tryParse = (value: string, label: string) => {
    const parsed = JSON.parse(value);
    console.log(`[AI] Successfully parsed JSON from ${label}`);
    return parsed;
  };

  try {
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return tryParse(jsonMatch[0], 'matched block');
    }
    return tryParse(cleanedText, 'cleaned text');
  } catch (initialError) {
    try {
      const repaired = jsonrepair(cleanedText);
      return tryParse(repaired, 'repaired text');
    } catch (repairError) {
      console.error('[AI] Failed to parse JSON response');
      console.error('[AI] Raw response text (first 500 chars):', text.substring(0, 500));
      console.error(
        '[AI] Parse error:',
        repairError instanceof Error ? repairError.message : String(repairError)
      );
      throw new Error(
        `Invalid JSON response from AI: ${
          repairError instanceof Error ? repairError.message : String(repairError)
        }`
      );
    }
  }
}

interface GenerateJsonOptions {
  maxTokens?: number;
  systemPrompt?: string;
}

/**
 * A helper function to generate a JSON object from a prompt using the configured LLM.
 * It sends the prompt to the AI and parses the response as JSON.
 * @param prompt The prompt to send to the AI.
 * @param options Optional parameters for the AI query, like `maxTokens` or a `systemPrompt`.
 * @returns A promise that resolves to the parsed JSON object.
 */
export async function generateJSON<T>(prompt: string, options: GenerateJsonOptions = {}): Promise<T> {
  let ai: AI;

  // If custom options are provided, create a temporary, specific instance of the provider and AI client.
  // This ensures that options like `maxTokens` or a `systemPrompt` don't interfere with other calls.
  if (options.systemPrompt || options.maxTokens) {
    const providerOptions: any = {
      token: process.env.OPENROUTER_API_KEY!,
      model: process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet',
    };
    if (options.maxTokens) {
      providerOptions.max_tokens = options.maxTokens;
    }
    const provider = new OpenRouterProvider(providerOptions);
    ai = new AI({ provider, systemPrompt: options.systemPrompt });
  } else {
    ai = getAI();
  }
  
  const response = await ai.query({ role: 'user', content: prompt });
  
  if (!response) {
    console.error('[AI] Empty response received for prompt:', prompt.substring(0, 500) + '...');
    throw new Error('AI returned an empty response');
  }

  // Use the local robust JSON parsing
  return parseJSONResponse<T>(response);
}

export default getAI;
