import { useCallback } from 'react';
import { useChat } from '../contexts/ChatContext';
import { useArtifact } from '../contexts/ArtifactContext';
import { useAINotifications } from '../contexts/AINotificationContext';
import { streamChat } from '../services/aiService';
import { parseAIResponse } from '../services/aiResponseParser';

// Fallback mock response for when API fails
function generateMockResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes('tony') || lowerMessage.includes('ramirez') || lowerMessage.includes('backfill')) {
    return `I'm sorry to hear about Tony's departure. Let me help you put together a comprehensive backfill plan. I have a few questions first:

- **What's driving Tony's departure?** Understanding the reason can help us address potential retention risks for the rest of the team.
- **Are there any critical projects** Tony is currently leading that need immediate coverage?
- **Do you have a preference** for internal promotion vs. external hire?

While you think about those, I'll start pulling together relevant data on the team, compensation benchmarks, and potential internal candidates.`;
  }

  return `I'll help you with that. Let me analyze the relevant data and get back to you with insights and recommendations.`;
}

export function useChatSend() {
  const { addMessage, updateMessage, selectedConversation } = useChat();
  const { createArtifact, updateArtifactSettings } = useArtifact();
  const { addNotification } = useAINotifications();

  const sendMessage = useCallback(async (text: string) => {
    if (!selectedConversation) {
      console.error('No conversation selected');
      return;
    }

    const conversationId = selectedConversation.id;

    // 1. Add user message
    addMessage(conversationId, { type: 'user', text });

    // 2. Add placeholder AI message (will be updated as we stream)
    const aiMessageId = addMessage(conversationId, { type: 'ai', text: '' });

    try {
      // 3. Stream from LLM
      let fullText = '';
      const messages = [
        ...selectedConversation.messages,
        { id: String(Date.now()), type: 'user' as const, text },
      ];

      for await (const chunk of streamChat(messages)) {
        fullText += chunk;
        updateMessage(conversationId, aiMessageId, fullText);
      }

      // 4. Parse completed response
      const parsed = parseAIResponse(fullText);

      // 5. If plan detected, create artifact
      if (parsed.planArtifact) {
        const artifact = createArtifact('plan', conversationId, parsed.planArtifact.title);
        updateArtifactSettings(artifact.id, {
          status: 'proposed',
          sections: parsed.planArtifact.sections,
          reviewSteps: parsed.planArtifact.reviewSteps || [],
        });

        // Update message to include artifactId and display text only
        updateMessage(conversationId, aiMessageId, parsed.displayText, artifact.id);

        // 6. Fire notification
        addNotification({
          type: 'action_needed',
          title: 'Plan Ready for Review',
          message: `Review: ${parsed.planArtifact.title}`,
          timestamp: new Date().toISOString(),
        });
      } else {
        // No plan, just update with display text
        updateMessage(conversationId, aiMessageId, parsed.displayText);
      }
    } catch (error) {
      console.error('LLM error, falling back to mock:', error);

      // Fall back to mock response
      const mockResponse = generateMockResponse(text);
      updateMessage(conversationId, aiMessageId, mockResponse);
    }
  }, [selectedConversation, addMessage, updateMessage, createArtifact, updateArtifactSettings, addNotification]);

  return { sendMessage };
}
