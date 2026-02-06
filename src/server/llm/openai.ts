import type { LLMMessage, LLMProvider, LLMStreamEvent } from './types';

export class OpenAIProvider implements LLMProvider {
  name = 'openai';
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model = 'gpt-5-mini-2025-08-07') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async *chat(
    messages: LLMMessage[],
    options?: { temperature?: number; maxTokens?: number }
  ): AsyncGenerator<LLMStreamEvent> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          max_completion_tokens: options?.maxTokens ?? 4096,
          stream: true,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        yield { type: 'error', content: `OpenAI API error: ${error}` };
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        yield { type: 'error', content: 'No response body' };
        return;
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              yield { type: 'done' };
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                yield { type: 'text', content };
              }
            } catch (e) {
              // Ignore parse errors for SSE formatting
            }
          }
        }
      }

      yield { type: 'done' };
    } catch (error) {
      yield {
        type: 'error',
        content: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
