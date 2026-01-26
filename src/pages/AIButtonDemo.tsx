import { Button } from '../components';

export function AIButtonDemo() {
  return (
    <div className="p-12 bg-[var(--surface-neutral-xx-weak)] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-[var(--text-neutral-x-strong)]">
          AI Button Demo
        </h1>

        <div className="space-y-12">
          {/* Idle State - All Sizes */}
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-[var(--text-neutral-x-strong)]">
              All Button Sizes
            </h2>
            <div className="flex gap-4 items-center">
              <Button variant="ai" size="small">
                Small
              </Button>
              <Button variant="ai" size="medium">
                Medium
              </Button>
              <Button variant="ai" size="large">
                Large
              </Button>
            </div>
          </div>

          {/* With Icons - All Sizes */}
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-[var(--text-neutral-x-strong)]">
              AI Buttons with Icons - All Sizes
            </h2>
            <div className="space-y-3">
              <div className="flex gap-4 items-center">
                <Button variant="ai" size="small" icon="sparkles" iconPosition="left">
                  Small with Icon
                </Button>
                <Button variant="ai" size="medium" icon="sparkles" iconPosition="left">
                  Medium with Icon
                </Button>
                <Button variant="ai" size="large" icon="sparkles" iconPosition="left">
                  Large with Icon
                </Button>
              </div>
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

          {/* Disabled State - All Sizes */}
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-[var(--text-neutral-x-strong)]">
              Disabled State - All Sizes
            </h2>
            <div className="flex gap-4 items-center">
              <Button variant="ai" size="small" disabled>
                Small Disabled
              </Button>
              <Button variant="ai" size="medium" disabled>
                Medium Disabled
              </Button>
              <Button variant="ai" size="large" disabled>
                Large Disabled
              </Button>
            </div>
          </div>

          {/* All Variants with All Sizes */}
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-[var(--text-neutral-x-strong)]">
              All Button Variants × All Sizes
            </h2>

            {/* Standard */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-2 text-[var(--text-neutral-strong)]">Standard</h3>
              <div className="flex gap-4 items-center">
                <Button variant="standard" size="small">Small</Button>
                <Button variant="standard" size="medium">Medium</Button>
                <Button variant="standard" size="large">Large</Button>
              </div>
            </div>

            {/* Primary */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-2 text-[var(--text-neutral-strong)]">Primary</h3>
              <div className="flex gap-4 items-center">
                <Button variant="primary" size="small">Small</Button>
                <Button variant="primary" size="medium">Medium</Button>
                <Button variant="primary" size="large">Large</Button>
              </div>
            </div>

            {/* Outlined */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-2 text-[var(--text-neutral-strong)]">Outlined</h3>
              <div className="flex gap-4 items-center">
                <Button variant="outlined" size="small">Small</Button>
                <Button variant="outlined" size="medium">Medium</Button>
                <Button variant="outlined" size="large">Large</Button>
              </div>
            </div>

            {/* Ghost */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-2 text-[var(--text-neutral-strong)]">Ghost</h3>
              <div className="flex gap-4 items-center">
                <Button variant="ghost" size="small">Small</Button>
                <Button variant="ghost" size="medium">Medium</Button>
                <Button variant="ghost" size="large">Large</Button>
              </div>
            </div>

            {/* AI */}
            <div>
              <h3 className="text-sm font-semibold mb-2 text-[var(--text-neutral-strong)]">AI</h3>
              <div className="flex gap-4 items-center">
                <Button variant="ai" size="small">Small</Button>
                <Button variant="ai" size="medium">Medium</Button>
                <Button variant="ai" size="large">Large</Button>
              </div>
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
