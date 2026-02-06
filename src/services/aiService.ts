import type { ChatMessage } from '../data/chatData';
import type { LLMMessage } from '../server/llm/types';

function convertToLLMMessages(chatMessages: ChatMessage[]): LLMMessage[] {
  return chatMessages.map(msg => ({
    role: msg.type === 'user' ? 'user' : 'assistant',
    content: msg.text,
  }));
}

export async function* streamChat(messages: ChatMessage[]): AsyncGenerator<string> {
  const llmMessages = convertToLLMMessages(messages);

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages: llmMessages }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response body');
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
          const event = JSON.parse(data);

          if (event.type === 'text' && event.content) {
            yield event.content;
          } else if (event.type === 'error') {
            throw new Error(event.content || 'Unknown error');
          } else if (event.type === 'done') {
            return;
          }
        } catch (e) {
          if (e instanceof SyntaxError) {
            // Ignore JSON parse errors
            continue;
          }
          throw e;
        }
      }
    }
  }
}
