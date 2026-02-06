import type { LLMProvider } from './types';
import { OpenAIProvider } from './openai';
import { AnthropicProvider } from './anthropic';

export function createProvider(name: string, apiKey: string): LLMProvider {
  switch (name.toLowerCase()) {
    case 'openai':
      return new OpenAIProvider(apiKey);
    case 'anthropic':
      return new AnthropicProvider(apiKey);
    default:
      throw new Error(`Unknown provider: ${name}`);
  }
}

export * from './types';
export { OpenAIProvider } from './openai';
export { AnthropicProvider } from './anthropic';
