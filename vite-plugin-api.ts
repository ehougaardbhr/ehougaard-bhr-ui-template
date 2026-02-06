import type { Plugin, ViteDevServer } from 'vite';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { createProvider } from './src/server/llm';
import { buildSystemPrompt } from './src/server/prompts/systemPrompt';
import type { LLMMessage } from './src/server/llm/types';

// Load .env file manually
function loadEnv() {
  try {
    const envPath = resolve(process.cwd(), '.env');
    const envFile = readFileSync(envPath, 'utf-8');
    const env: Record<string, string> = {};

    envFile.split('\n').forEach(line => {
      const match = line.match(/^([A-Z_]+)=(.*)$/);
      if (match) {
        env[match[1]] = match[2];
      }
    });

    return env;
  } catch (e) {
    return {};
  }
}

export function apiPlugin(): Plugin {
  return {
    name: 'vite-plugin-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        if (req.method === 'POST' && req.url === '/api/chat') {
          try {
            // Parse request body
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });

            req.on('end', async () => {
              try {
                const { messages } = JSON.parse(body) as { messages: LLMMessage[] };

                // Get provider config from environment (reload .env each time for development)
                const env = loadEnv();
                const providerName = env.LLM_PROVIDER || 'anthropic';
                const apiKey = providerName === 'openai'
                  ? env.OPENAI_API_KEY
                  : env.ANTHROPIC_API_KEY;

                if (!apiKey) {
                  res.writeHead(500, { 'Content-Type': 'text/event-stream' });
                  res.write(`data: ${JSON.stringify({ type: 'error', content: `No API key found for provider: ${providerName}` })}\n\n`);
                  res.end();
                  return;
                }

                // Prepend system prompt
                const systemPrompt = buildSystemPrompt();
                const fullMessages: LLMMessage[] = [
                  { role: 'system', content: systemPrompt },
                  ...messages,
                ];

                // Create provider and stream response
                const provider = createProvider(providerName, apiKey);

                res.writeHead(200, {
                  'Content-Type': 'text/event-stream',
                  'Cache-Control': 'no-cache',
                  'Connection': 'keep-alive',
                });

                for await (const event of provider.chat(fullMessages)) {
                  res.write(`data: ${JSON.stringify(event)}\n\n`);

                  if (event.type === 'done' || event.type === 'error') {
                    res.end();
                    return;
                  }
                }

                res.end();
              } catch (error) {
                console.error('API error:', error);
                res.writeHead(500, { 'Content-Type': 'text/event-stream' });
                res.write(`data: ${JSON.stringify({
                  type: 'error',
                  content: error instanceof Error ? error.message : 'Unknown error'
                })}\n\n`);
                res.end();
              }
            });
          } catch (error) {
            console.error('API error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal server error' }));
          }
        } else {
          next();
        }
      });
    },
  };
}
