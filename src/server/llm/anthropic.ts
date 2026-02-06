import type { LLMMessage, LLMProvider, LLMStreamEvent } from './types';

export class AnthropicProvider implements LLMProvider {
  name = 'anthropic';
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model = 'claude-sonnet-4-5-20250929') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async *chat(
    messages: LLMMessage[],
    options?: { temperature?: number; maxTokens?: number }
  ): AsyncGenerator<LLMStreamEvent> {
    try {
      // Separate system message from conversation messages
      const systemMessage = messages.find(m => m.role === 'system')?.content || '';
      const conversationMessages = messages
        .filter(m => m.role !== 'system')
        .map(m => ({ role: m.role, content: m.content }));

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: this.model,
          messages: conversationMessages,
          system: systemMessage,
          temperature: options?.temperature ?? 0.7,
          max_tokens: options?.maxTokens ?? 4096,
          stream: true,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        yield { type: 'error', content: `Anthropic API error: ${error}` };
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

            try {
              const parsed = JSON.parse(data);

              if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                yield { type: 'text', content: parsed.delta.text };
              } else if (parsed.type === 'message_stop') {
                yield { type: 'done' };
                return;
              } else if (parsed.type === 'error') {
                yield { type: 'error', content: parsed.error?.message || 'Unknown error' };
                return;
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
