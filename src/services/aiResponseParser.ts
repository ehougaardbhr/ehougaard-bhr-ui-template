import type { PlanSection } from '../data/artifactData';

export interface ReviewStep {
  id: string;
  description: string;
  reviewer: string;
  status: 'planned' | 'passed' | 'ready' | 'future';
  afterItem: string;           // action item ID this gate follows
  type: 'findings' | 'artifact'; // review of analysis output vs created artifact
}

export interface ParsedAIResponse {
  displayText: string;
  planArtifact?: {
    title: string;
    sections: PlanSection[];
    reviewSteps?: ReviewStep[];
    suggestedPrompts?: string[];
  };
}

export function parseAIResponse(fullText: string): ParsedAIResponse {
  // Look for :::plan markers (with optional code fence wrappers)
  const planRegex = /(?:```(?:json)?\s*)?:::plan\s*([\s\S]*?):::(?:\s*```)?/;
  const match = fullText.match(planRegex);

  if (!match) {
    // During streaming: if :::plan started but hasn't closed yet,
    // suppress everything from :::plan onward to prevent "code vomit"
    const partialPlanIndex = fullText.search(/(?:```(?:json)?\s*)?:::plan/);
    if (partialPlanIndex !== -1) {
      const displayText = fullText.slice(0, partialPlanIndex).trim();
      return { displayText: displayText || 'Creating a plan...' };
    }
    return { displayText: fullText };
  }

  // Extract plan JSON
  const planJson = match[1].trim();
  let planArtifact;

  try {
    planArtifact = JSON.parse(planJson);
  } catch (e) {
    console.error('Failed to parse plan JSON:', e);
    return { displayText: fullText };
  }

  // Remove the :::plan section (and any surrounding code fences) from display text
  const displayText = fullText.replace(planRegex, '').trim();

  return {
    displayText,
    planArtifact,
  };
}
