import { OrgChartAIInput } from '../../components/OrgChartAIInput';

export function OrgChartAIDemo() {
  const handleSubmit = (value: string) => {
    console.log('Submitted:', value);
  };

  const handleSuggestionClick = (suggestion: { label: string }) => {
    console.log('Suggestion clicked:', suggestion.label);
  };

  return (
    <div className="min-h-screen bg-[var(--surface-neutral-xx-weak)] p-8">
      <div className="max-w-2xl mx-auto space-y-12">
        <div>
          <h1 className="text-2xl font-semibold mb-2 text-[var(--text-neutral-xx-strong)]">
            OrgChart AI Input Component
          </h1>
          <p className="text-[var(--text-neutral-medium)] mb-8">
            Click inside the input to see the focused state with suggestions.
          </p>
        </div>

        {/* Demo with default props */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-[var(--text-neutral-x-strong)]">
            Default (Shannon's team)
          </h2>
          <div className="max-w-[540px]">
            <OrgChartAIInput
              onSubmit={handleSubmit}
              onSuggestionClick={handleSuggestionClick}
            />
          </div>
        </div>

        {/* Demo with custom placeholder and suggestions */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-[var(--text-neutral-x-strong)]">
            Custom (Sarah's team)
          </h2>
          <div className="max-w-[540px]">
            <OrgChartAIInput
              placeholder="Ask about Sarah's team"
              suggestions={[
                { label: "Plan team expansion" },
                { label: "Show succession plan" },
              ]}
              onSubmit={handleSubmit}
              onSuggestionClick={handleSuggestionClick}
            />
          </div>
        </div>

        {/* Demo with no suggestions */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-[var(--text-neutral-x-strong)]">
            No suggestions
          </h2>
          <div className="max-w-[540px]">
            <OrgChartAIInput
              placeholder="Ask about your org chart..."
              suggestions={[]}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrgChartAIDemo;
