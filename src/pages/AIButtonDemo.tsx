import { Button } from '../components';

export function AIButtonDemo() {
  return (
    <div className="p-12 bg-[var(--surface-neutral-xx-weak)] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-[var(--text-neutral-x-strong)]">
          AI Button Demo
        </h1>

        <div className="space-y-12">
          {/* Idle State */}
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-[var(--text-neutral-x-strong)]">
              Idle State
            </h2>
            <div className="flex gap-4 items-center">
              <Button variant="ai" size="medium">
                Button Label
              </Button>
              <Button variant="ai" size="small">
                Small Button
              </Button>
            </div>
          </div>

          {/* With Icons */}
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-[var(--text-neutral-x-strong)]">
              With Icons
            </h2>
            <div className="flex gap-4 items-center">
              <Button variant="ai" size="medium" icon="sparkles" iconPosition="left">
                AI Generate
              </Button>
              <Button variant="ai" size="medium" icon="wand-magic-sparkles" iconPosition="left">
                Magic Button
              </Button>
              <Button variant="ai" size="medium" icon="arrow-right" iconPosition="right">
                Next
              </Button>
            </div>
          </div>

          {/* Hover State */}
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-[var(--text-neutral-x-strong)]">
              Hover State
            </h2>
            <p className="text-sm text-[var(--text-neutral-medium)] mb-4">
              Hover over the button to see the gradient background
            </p>
            <Button variant="ai" size="medium">
              Hover Me
            </Button>
          </div>

          {/* Focus State */}
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-[var(--text-neutral-x-strong)]">
              Focus State
            </h2>
            <p className="text-sm text-[var(--text-neutral-medium)] mb-4">
              Tab to focus on the button (or click it and notice the thicker border)
            </p>
            <Button variant="ai" size="medium">
              Focus Me
            </Button>
          </div>

          {/* Active State */}
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-[var(--text-neutral-x-strong)]">
              Active State
            </h2>
            <p className="text-sm text-[var(--text-neutral-medium)] mb-4">
              Click and hold to see the active state with inner shadow
            </p>
            <Button variant="ai" size="medium">
              Click Me
            </Button>
          </div>

          {/* Disabled State */}
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-[var(--text-neutral-x-strong)]">
              Disabled State
            </h2>
            <div className="flex gap-4 items-center">
              <Button variant="ai" size="medium" disabled>
                Disabled Button
              </Button>
              <Button variant="ai" size="small" disabled icon="sparkles">
                Disabled with Icon
              </Button>
            </div>
          </div>

          {/* Comparison with Other Variants */}
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-[var(--text-neutral-x-strong)]">
              Comparison with Other Button Variants
            </h2>
            <div className="flex flex-wrap gap-4">
              <Button variant="standard">Standard</Button>
              <Button variant="primary">Primary</Button>
              <Button variant="outlined">Outlined</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="ai">AI Button</Button>
            </div>
          </div>

          {/* Use Case Example */}
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-[var(--text-neutral-x-strong)]">
              Example Use Case: AI Feedback Summary
            </h2>
            <div className="border border-[var(--border-neutral-x-weak)] rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="text-[16px] font-medium text-[var(--text-neutral-x-strong)]">
                  Summary of feedback about Jessica
                </div>
              </div>
              <p className="text-[16px] text-[var(--text-neutral-strong)] mb-4">
                Jessica's colleagues have shared positive feedback, praising her for her
                perseverance and dedication to protecting employee morale during times of
                transition.
              </p>
              <Button variant="ai" icon="sparkles" iconPosition="left">
                Regenerate Summary
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIButtonDemo;
