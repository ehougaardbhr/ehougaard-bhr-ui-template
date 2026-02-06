import type { PlanSection } from '../data/artifactData';

export interface ReviewStep {
  id: string;
  description: string;
  reviewer: string;
  status: 'planned' | 'passed' | 'ready' | 'future';
}

export interface ParsedAIResponse {
  displayText: string;
  planArtifact?: {
    title: string;
    sections: PlanSection[];
    reviewSteps?: ReviewStep[];
  };
}

export function parseAIResponse(fullText: string): ParsedAIResponse {
  // Look for :::plan markers
  const planRegex = /:::plan\s*([\s\S]*?):::/;
  const match = fullText.match(planRegex);

  if (!match) {
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

  // Remove the :::plan section from display text
  const displayText = fullText.replace(planRegex, '').trim();

  return {
    displayText,
    planArtifact,
  };
}
