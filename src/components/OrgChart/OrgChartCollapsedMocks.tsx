import { useState } from 'react';

// Mock data for scenarios
const scenarios = [
  { id: 1, name: 'Base', description: 'Current structure', people: 14, levels: 3 },
  { id: 2, name: '+2 Engineers', description: 'Add 2 Engineers to Platform Team', people: 16, levels: 4 },
  { id: 3, name: 'Merged', description: 'Merge Finance and HR', people: 12, levels: 3 },
  { id: 4, name: '+Director', description: 'Add Director level', people: 17, levels: 4 },
];

// ============================================
// MOCK 1: Visual Diff Card
// ============================================
function VisualDiffCard() {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700 p-4 max-w-md">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500 dark:text-neutral-400">Scenario 2</span>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300">
              <i className="fa-solid fa-pen text-xs"></i>
            </button>
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Add 2 Engineers to Platform Team
          </h3>
        </div>
      </div>

      <div className="border-t border-gray-100 dark:border-neutral-700 pt-3">
        <div className="flex gap-6">
          {/* Abstract tree visualization */}
          <div className="flex-shrink-0">
            <svg width="120" height="100" viewBox="0 0 120 100" className="text-gray-400 dark:text-neutral-500">
              {/* Root node */}
              <circle cx="60" cy="12" r="8" fill="currentColor" />

              {/* Level 1 connections */}
              <line x1="60" y1="20" x2="60" y2="30" stroke="currentColor" strokeWidth="1.5" />
              <line x1="20" y1="40" x2="100" y2="40" stroke="currentColor" strokeWidth="1.5" />
              <line x1="20" y1="30" x2="20" y2="40" stroke="currentColor" strokeWidth="1.5" />
              <line x1="60" y1="30" x2="60" y2="40" stroke="currentColor" strokeWidth="1.5" />
              <line x1="100" y1="30" x2="100" y2="40" stroke="currentColor" strokeWidth="1.5" />

              {/* Level 1 nodes */}
              <circle cx="20" cy="48" r="7" fill="currentColor" />
              <circle cx="60" cy="48" r="7" fill="currentColor" />
              <circle cx="100" cy="48" r="7" fill="currentColor" />

              {/* Level 2 connections - left branch */}
              <line x1="20" y1="55" x2="20" y2="65" stroke="currentColor" strokeWidth="1.5" />
              <line x1="10" y1="75" x2="30" y2="75" stroke="currentColor" strokeWidth="1.5" />
              <line x1="10" y1="65" x2="10" y2="75" stroke="currentColor" strokeWidth="1.5" />
              <line x1="30" y1="65" x2="30" y2="75" stroke="currentColor" strokeWidth="1.5" />

              {/* Level 2 nodes - left */}
              <circle cx="10" cy="83" r="6" fill="currentColor" />
              <circle cx="30" cy="83" r="6" fill="currentColor" />

              {/* Level 2 - right branch (new additions highlighted) */}
              <line x1="100" y1="55" x2="100" y2="65" stroke="#22c55e" strokeWidth="1.5" />
              <line x1="85" y1="75" x2="115" y2="75" stroke="#22c55e" strokeWidth="1.5" />
              <line x1="85" y1="65" x2="85" y2="75" stroke="#22c55e" strokeWidth="1.5" />
              <line x1="115" y1="65" x2="115" y2="75" stroke="#22c55e" strokeWidth="1.5" />

              {/* New nodes (green) */}
              <circle cx="85" cy="83" r="6" fill="#22c55e" />
              <circle cx="115" cy="83" r="6" fill="#22c55e" />

              {/* +2 indicator */}
              <rect x="95" y="70" width="22" height="14" rx="3" fill="#22c55e" />
              <text x="106" y="80" textAnchor="middle" fill="white" fontSize="9" fontWeight="600">+2</text>
            </svg>
          </div>

          {/* Changes summary */}
          <div className="flex-1">
            <div className="text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wide mb-2">
              Changes
            </div>
            <ul className="space-y-1.5">
              <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-neutral-300">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                +2 Engineers
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-neutral-300">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                +1 Level added
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-neutral-400">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                Team: 14 → 16
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-neutral-700">
        <button className="flex-1 px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors">
          View Full
        </button>
        <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-neutral-300 bg-gray-100 dark:bg-neutral-700 hover:bg-gray-200 dark:hover:bg-neutral-600 rounded-md transition-colors">
          Compare...
        </button>
      </div>
    </div>
  );
}

// ============================================
// MOCK 2: Before/After Thumbnails
// ============================================
function BeforeAfterCard() {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700 p-4 max-w-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Scenario 2: Add 2 Engineers
        </h3>
      </div>

      <div className="border-t border-gray-100 dark:border-neutral-700 pt-3">
        <div className="flex items-center gap-4">
          {/* Before */}
          <div className="flex-1">
            <div className="text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wide mb-2 text-center">
              Before
            </div>
            <div className="bg-gray-50 dark:bg-neutral-900 rounded-lg p-3 flex justify-center">
              <svg width="80" height="70" viewBox="0 0 80 70" className="text-gray-400 dark:text-neutral-500">
                <circle cx="40" cy="8" r="6" fill="currentColor" />
                <line x1="40" y1="14" x2="40" y2="22" stroke="currentColor" strokeWidth="1.5" />
                <line x1="15" y1="28" x2="65" y2="28" stroke="currentColor" strokeWidth="1.5" />
                <line x1="15" y1="22" x2="15" y2="28" stroke="currentColor" strokeWidth="1.5" />
                <line x1="40" y1="22" x2="40" y2="28" stroke="currentColor" strokeWidth="1.5" />
                <line x1="65" y1="22" x2="65" y2="28" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="15" cy="35" r="5" fill="currentColor" />
                <circle cx="40" cy="35" r="5" fill="currentColor" />
                <circle cx="65" cy="35" r="5" fill="currentColor" />
                <line x1="15" y1="40" x2="15" y2="50" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="15" cy="57" r="5" fill="currentColor" />
              </svg>
            </div>
            <div className="text-center mt-2 text-sm text-gray-500 dark:text-neutral-400">
              14 people
            </div>
          </div>

          {/* Arrow */}
          <div className="flex-shrink-0 text-gray-400 dark:text-neutral-500">
            <i className="fa-solid fa-arrow-right text-xl"></i>
          </div>

          {/* After */}
          <div className="flex-1">
            <div className="text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wide mb-2 text-center">
              After
            </div>
            <div className="bg-gray-50 dark:bg-neutral-900 rounded-lg p-3 flex justify-center">
              <svg width="80" height="70" viewBox="0 0 80 70" className="text-gray-400 dark:text-neutral-500">
                <circle cx="40" cy="8" r="6" fill="currentColor" />
                <line x1="40" y1="14" x2="40" y2="22" stroke="currentColor" strokeWidth="1.5" />
                <line x1="15" y1="28" x2="65" y2="28" stroke="currentColor" strokeWidth="1.5" />
                <line x1="15" y1="22" x2="15" y2="28" stroke="currentColor" strokeWidth="1.5" />
                <line x1="40" y1="22" x2="40" y2="28" stroke="currentColor" strokeWidth="1.5" />
                <line x1="65" y1="22" x2="65" y2="28" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="15" cy="35" r="5" fill="currentColor" />
                <circle cx="40" cy="35" r="5" fill="currentColor" />
                <circle cx="65" cy="35" r="5" fill="currentColor" />
                <line x1="15" y1="40" x2="15" y2="50" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="15" cy="57" r="5" fill="currentColor" />
                {/* New nodes */}
                <line x1="65" y1="40" x2="65" y2="50" stroke="#22c55e" strokeWidth="1.5" />
                <line x1="55" y1="50" x2="75" y2="50" stroke="#22c55e" strokeWidth="1.5" />
                <circle cx="55" cy="57" r="5" fill="#22c55e" />
                <circle cx="75" cy="57" r="5" fill="#22c55e" />
              </svg>
            </div>
            <div className="text-center mt-2 text-sm text-green-600 dark:text-green-400 font-medium">
              16 people (+2)
            </div>
          </div>
        </div>

        {/* Change description */}
        <div className="mt-3 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-md text-sm text-green-700 dark:text-green-400">
          +2 engineers added under Platform Lead
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center mt-4 pt-3 border-t border-gray-100 dark:border-neutral-700">
        <button className="px-6 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors">
          Expand Scenario
        </button>
      </div>
    </div>
  );
}

// ============================================
// MOCK 3: Scenario Timeline Strip
// ============================================
function TimelineStrip() {
  const [selected, setSelected] = useState(1);

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700 p-4 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Tech Team Scenarios
        </h3>
        <span className="text-sm text-gray-500 dark:text-neutral-400">
          4 variations
        </span>
      </div>

      {/* Timeline */}
      <div className="border-t border-gray-100 dark:border-neutral-700 pt-4">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => setSelected(scenario.id)}
              className={`
                flex-shrink-0 w-28 p-3 rounded-lg border-2 transition-all
                ${selected === scenario.id
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600'
                }
              `}
            >
              {/* Mini tree */}
              <div className="flex justify-center mb-2">
                <svg width="50" height="40" viewBox="0 0 50 40" className={selected === scenario.id ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-neutral-500'}>
                  <circle cx="25" cy="6" r="4" fill="currentColor" />
                  <line x1="25" y1="10" x2="25" y2="15" stroke="currentColor" strokeWidth="1" />
                  <line x1="10" y1="20" x2="40" y2="20" stroke="currentColor" strokeWidth="1" />
                  <line x1="10" y1="15" x2="10" y2="20" stroke="currentColor" strokeWidth="1" />
                  <line x1="25" y1="15" x2="25" y2="20" stroke="currentColor" strokeWidth="1" />
                  <line x1="40" y1="15" x2="40" y2="20" stroke="currentColor" strokeWidth="1" />
                  <circle cx="10" cy="25" r="3" fill="currentColor" />
                  <circle cx="25" cy="25" r="3" fill="currentColor" />
                  <circle cx="40" cy="25" r="3" fill="currentColor" />
                  {scenario.levels > 3 && (
                    <>
                      <line x1="10" y1="28" x2="10" y2="33" stroke="currentColor" strokeWidth="1" />
                      <circle cx="10" cy="36" r="2" fill="currentColor" />
                    </>
                  )}
                </svg>
              </div>

              {/* Label */}
              <div className={`text-xs font-medium text-center truncate ${selected === scenario.id ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-neutral-300'}`}>
                {scenario.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-neutral-400 text-center">
                {scenario.people} ppl
              </div>
            </button>
          ))}
        </div>

        {/* Selection indicator */}
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-neutral-400">
          <i className="fa-solid fa-arrow-up text-green-500"></i>
          <span>Currently viewing: <strong className="text-gray-900 dark:text-white">{scenarios.find(s => s.id === selected)?.name}</strong></span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-neutral-700">
        <button className="flex-1 px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors">
          View Selected
        </button>
        <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-neutral-300 bg-gray-100 dark:bg-neutral-700 hover:bg-gray-200 dark:hover:bg-neutral-600 rounded-md transition-colors">
          Compare Side-by-Side
        </button>
      </div>
    </div>
  );
}

// ============================================
// MOCK 4: Simple Thumbnail (Icon + Text)
// ============================================
function SimpleThumbnail() {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700 p-3 max-w-sm hover:border-green-300 dark:hover:border-green-700 cursor-pointer transition-colors">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 bg-gray-100 dark:bg-neutral-700 rounded-lg flex items-center justify-center">
          <i className="fa-solid fa-sitemap text-green-700 dark:text-green-400"></i>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
            Platform Team Expansion
          </h4>

          {/* Description */}
          <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5 line-clamp-2">
            Added 2 engineers to platform, explored reporting structure options
          </p>

          {/* Timestamp */}
          <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1.5">
            2h ago
          </p>
        </div>
      </div>
    </div>
  );
}

// Variant: Even more minimal
function MinimalThumbnail() {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700 px-3 py-2 max-w-xs hover:border-green-300 dark:hover:border-green-700 cursor-pointer transition-colors inline-flex items-center gap-2">
      <i className="fa-solid fa-sitemap text-green-700 dark:text-green-400 text-sm"></i>
      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
        Platform Team Expansion
      </span>
      <span className="text-xs text-gray-400 dark:text-neutral-500">
        2h ago
      </span>
    </div>
  );
}

// Variant: Card with subtle visual hint
function SubtleVisualThumbnail() {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700 p-3 max-w-sm hover:border-green-300 dark:hover:border-green-700 cursor-pointer transition-colors">
      <div className="flex items-start gap-3">
        {/* Mini abstract visual */}
        <div className="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-neutral-700 rounded-lg flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 32 32" className="text-gray-300 dark:text-neutral-600">
            <circle cx="16" cy="6" r="3" fill="currentColor" />
            <line x1="16" y1="9" x2="16" y2="13" stroke="currentColor" strokeWidth="1.5" />
            <line x1="6" y1="17" x2="26" y2="17" stroke="currentColor" strokeWidth="1.5" />
            <line x1="6" y1="13" x2="6" y2="17" stroke="currentColor" strokeWidth="1.5" />
            <line x1="16" y1="13" x2="16" y2="17" stroke="currentColor" strokeWidth="1.5" />
            <line x1="26" y1="13" x2="26" y2="17" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="6" cy="21" r="2.5" fill="currentColor" />
            <circle cx="16" cy="21" r="2.5" fill="currentColor" />
            <circle cx="26" cy="21" r="2.5" fill="#2e7918" />
            <circle cx="23" cy="27" r="2" fill="#2e7918" />
            <circle cx="29" cy="27" r="2" fill="#2e7918" />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
            Platform Team Expansion
          </h4>
          <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5 line-clamp-2">
            Added 2 engineers, explored reporting options
          </p>
          <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1">
            2h ago
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MOCK 5: Summary Card with Key Stats (original)
// ============================================
function SummaryCard() {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700 p-4 max-w-md">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">📊</span>
          <span className="text-sm font-medium text-gray-500 dark:text-neutral-400">Scenario 2</span>
        </div>
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300">
          <i className="fa-solid fa-pen text-xs"></i>
        </button>
      </div>

      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
        Add 2 Engineers to Platform Team
      </h3>

      <div className="border-t border-gray-100 dark:border-neutral-700 pt-3">
        {/* Stats row */}
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-neutral-400 mb-4">
          <span className="flex items-center gap-1.5">
            <i className="fa-solid fa-users text-gray-400"></i>
            16 people
          </span>
          <span className="flex items-center gap-1.5">
            <i className="fa-solid fa-layer-group text-gray-400"></i>
            4 levels
          </span>
          <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
            <i className="fa-solid fa-arrow-trend-up"></i>
            +2 from base
          </span>
        </div>

        {/* Key changes */}
        <div className="mb-4">
          <div className="text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wide mb-2">
            Key changes
          </div>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-neutral-300">
              <span className="text-green-500 mt-0.5">
                <i className="fa-solid fa-plus text-xs"></i>
              </span>
              <span>Added: <strong>Alex Kim</strong> (Sr. Engineer)</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-neutral-300">
              <span className="text-green-500 mt-0.5">
                <i className="fa-solid fa-plus text-xs"></i>
              </span>
              <span>Added: <strong>Jordan Lee</strong> (Engineer)</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-neutral-300">
              <span className="text-blue-500 mt-0.5">
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </span>
              <span>New reporting line under Platform Lead</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-neutral-700">
        <button className="flex-1 px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors">
          View Full Chart
        </button>
        <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-neutral-300 bg-gray-100 dark:bg-neutral-700 hover:bg-gray-200 dark:hover:bg-neutral-600 rounded-md transition-colors">
          Compare...
        </button>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT - Mock Switcher
// ============================================
type MockType = 'simple' | 'minimal' | 'subtleVisual' | 'beforeAfter' | 'diff' | 'timeline' | 'summary';

const mockOptions: { id: MockType; label: string; description: string }[] = [
  { id: 'simple', label: 'Simple', description: 'Icon + title + subtitle + metadata' },
  { id: 'minimal', label: 'Minimal', description: 'Inline pill style - most compact' },
  { id: 'subtleVisual', label: 'Subtle Visual', description: 'Small abstract tree hint' },
  { id: 'beforeAfter', label: 'Before/After', description: 'Side-by-side comparison thumbnails' },
  { id: 'diff', label: 'Visual Diff', description: 'Abstract tree with highlighted changes' },
  { id: 'timeline', label: 'Timeline Strip', description: 'Navigable scenario versions' },
  { id: 'summary', label: 'Summary Card', description: 'Stats and key changes list' },
];

export function OrgChartCollapsedMocks() {
  const [activeMock, setActiveMock] = useState<MockType>('simple');

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Org Chart Collapsed View Mockups
          </h1>
          <p className="text-gray-600 dark:text-neutral-400">
            Explore different UX approaches for displaying org chart scenarios in a collapsed/preview state.
          </p>
        </div>

        {/* Mock Selector */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {mockOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setActiveMock(option.id)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${activeMock === option.id
                    ? 'bg-green-600 text-white'
                    : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 border border-gray-200 dark:border-neutral-700 hover:border-green-300 dark:hover:border-green-700'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
            {mockOptions.find(m => m.id === activeMock)?.description}
          </p>
        </div>

        {/* Mock Display Area */}
        <div className="bg-gray-200 dark:bg-neutral-950 rounded-xl p-8 flex items-center justify-center min-h-[400px]">
          {activeMock === 'simple' && <SimpleThumbnail />}
          {activeMock === 'minimal' && <MinimalThumbnail />}
          {activeMock === 'subtleVisual' && <SubtleVisualThumbnail />}
          {activeMock === 'beforeAfter' && <BeforeAfterCard />}
          {activeMock === 'diff' && <VisualDiffCard />}
          {activeMock === 'timeline' && <TimelineStrip />}
          {activeMock === 'summary' && <SummaryCard />}
        </div>

        {/* Notes */}
        <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <h3 className="font-medium text-yellow-800 dark:text-yellow-400 mb-2">
            Implementation Notes
          </h3>
          <ul className="text-sm text-yellow-700 dark:text-yellow-500 space-y-1">
            <li>• <strong>Simple</strong>: Clean icon + text layout, good balance of info and simplicity</li>
            <li>• <strong>Minimal</strong>: Inline pill style, most compact, good for dense chat</li>
            <li>• <strong>Subtle Visual</strong>: Tiny tree hint without being overwhelming</li>
            <li>• <strong>Before/After</strong>: Best for showing transformation/change</li>
            <li>• <strong>Visual Diff</strong>: Detailed change visualization</li>
            <li>• <strong>Timeline Strip</strong>: For exploring multiple scenarios together</li>
            <li>• <strong>Summary Card</strong>: Detailed stats and changes list</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default OrgChartCollapsedMocks;
