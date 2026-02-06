export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMStreamEvent {
  type: 'text' | 'done' | 'error';
  content?: string;
}

export interface LLMProvider {
  name: string;
  chat(messages: LLMMessage[], options?: { temperature?: number; maxTokens?: number }): AsyncGenerator<LLMStreamEvent>;
}
