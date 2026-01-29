import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import type { Employee } from '../../data/employees';
import { OrgChartTree } from './OrgChartTree';
import { OrgChartControls } from './OrgChartControls';
import { OrgChartZoom } from './OrgChartZoom';
import { OrgChartAIInput } from '../OrgChartAIInput';
import { AIInlineMessage } from '../AIInlineMessage';
import { Card } from '../Card';
import { useChat } from '../../contexts/ChatContext';

interface OrgChartViewProps {
  employees: Employee[];
}

export function OrgChartView({ employees }: OrgChartViewProps) {
  // Local state for UI
  const canvasRef = useRef<HTMLDivElement>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<number | undefined>();
  const [affordanceMode, setAffordanceMode] = useState<'input' | 'toolbar' | 'inline'>('input');

  // Chat context
  const { createNewChat, addMessage, selectConversation } = useChat();

  // Track the root of the visible tree (who appears at top)
  const [rootEmployee, setRootEmployee] = useState<number | 'all'>(() => {
    const ceo = employees.find((emp) => emp.reportsTo === null);
    return ceo ? ceo.id : 'all';
  });

  // Initialize expanded nodes to show CEO's direct reports
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(() => {
    const ceo = employees.find((emp) => emp.reportsTo === null);
    return new Set(ceo ? [ceo.id] : []);
  });

  // Helper: get direct reports of an employee
  const getDirectReports = useCallback((employeeId: number) => {
    return employees.filter(e => e.reportsTo === employeeId);
  }, [employees]);

  // Helper: expand all nodes to a given depth from root
  const expandToDepth = useCallback((rootId: number, targetDepth: number | 'all') => {
    const newExpanded = new Set<number>();

    const expandLevel = (id: number, currentDepth: number) => {
      const reports = getDirectReports(id);
      if (reports.length === 0) return;

      if (targetDepth === 'all' || currentDepth < targetDepth) {
        newExpanded.add(id);
        reports.forEach(report => {
          expandLevel(report.id, currentDepth + 1);
        });
      }
    };

    expandLevel(rootId, 0);
    return newExpanded;
  }, [getDirectReports]);

  // Calculate current visible depth from expanded nodes
  const currentDepth = useMemo(() => {
    if (typeof rootEmployee !== 'number') return 1;

    let maxDepth = 0;

    const measureDepth = (id: number, depth: number) => {
      if (!expandedNodes.has(id)) {
        maxDepth = Math.max(maxDepth, depth);
        return;
      }

      const reports = getDirectReports(id);
      if (reports.length === 0) {
        maxDepth = Math.max(maxDepth, depth);
        return;
      }

      reports.forEach(report => {
        measureDepth(report.id, depth + 1);
      });
    };

    measureDepth(rootEmployee, 0);
    return maxDepth || 1;
  }, [rootEmployee, expandedNodes, getDirectReports]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Center the tree on initial mount
  useEffect(() => {
    if (canvasRef.current && !isInitialized) {
      const rect = canvasRef.current.getBoundingClientRect();
      // Estimate tree width around 800px, center it
      const estimatedTreeWidth = 800;
      const centerX = (rect.width - estimatedTreeWidth) / 2;
      setPanX(Math.max(centerX, 50));
      setPanY(50);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Handle node expansion
  const handleNodeExpand = (id: number) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedNodes(newExpanded);
  };

  // Handle node click: select the node and expand it to show direct reports
  // Keep ancestors open, close siblings (accordion behavior)
  const handleNodeClick = (id: number) => {
    setSelectedEmployee(id);

    // Build new expanded set
    const newExpanded = new Set<number>();

    // Get all ancestors of the clicked node (path from CEO to clicked node)
    const clickedEmployee = employees.find(e => e.id === id);
    if (clickedEmployee) {
      let currentId: number | null = clickedEmployee.reportsTo;
      while (currentId !== null) {
        newExpanded.add(currentId);
        const manager = employees.find((e) => e.id === currentId);
        currentId = manager?.reportsTo ?? null;
      }
    }

    // Expand the newly clicked node if it has direct reports
    if (clickedEmployee && clickedEmployee.directReports > 0) {
      newExpanded.add(id);
    }

    setExpandedNodes(newExpanded);
  };

  // Handle jump to employee - make them the root of the visible tree
  const handleEmployeeJump = (id: number) => {
    setSelectedEmployee(id);
    setRootEmployee(id);

    // Only expand the target employee to show their direct reports
    const newExpanded = new Set<number>();
    const targetEmployee = employees.find(e => e.id === id);

    if (targetEmployee && targetEmployee.directReports > 0) {
      newExpanded.add(id);
    }

    setExpandedNodes(newExpanded);

    // Center the view - employee will be at top center
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const estimatedTreeWidth = 185; // Single node width initially
      const centerX = (rect.width - estimatedTreeWidth) / 2;
      setPanX(Math.max(centerX, 50));
      setPanY(50);
    }
  };

  // Handle depth change - expand/collapse to match selected depth
  const handleDepthChange = (newDepth: number | 'all') => {
    if (typeof rootEmployee === 'number') {
      const newExpanded = expandToDepth(rootEmployee, newDepth);
      setExpandedNodes(newExpanded);
    }
  };

  // Handle go up (navigate to parent of current root)
  const handleGoUp = () => {
    if (typeof rootEmployee === 'number') {
      const currentRoot = employees.find(e => e.id === rootEmployee);
      if (currentRoot?.reportsTo) {
        handleEmployeeJump(currentRoot.reportsTo);
      }
    }
  };

  // Handle filter open (placeholder)
  const handleFilterOpen = () => {
    console.log('Filter menu opened');
    // Future: open filter modal/dropdown
  };

  // Handle export open (placeholder)
  const handleExportOpen = () => {
    console.log('Export menu opened');
    // Future: open export modal with PNG/PDF options
  };

  // Handle zoom
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));
  };

  // Handle pan
  const handlePanChange = (x: number, y: number) => {
    setPanX(x);
    setPanY(y);
  };

  // Get selected employee's first name for contextual text
  const selectedEmployeeName = useMemo(() => {
    if (!selectedEmployee) return undefined;
    const employee = employees.find(e => e.id === selectedEmployee);
    return employee?.name.split(' ')[0];
  }, [selectedEmployee, employees]);

  // Helper to open the chat panel via localStorage
  const openChatPanel = () => {
    localStorage.setItem('bhr-chat-panel-open', 'true');
    window.dispatchEvent(new Event('storage'));
  };

  // Generate AI response based on prompt
  const generateAIResponse = (prompt: string, employeeName?: string) => {
    const promptLower = prompt.toLowerCase();

    if (promptLower.includes('grew') || promptLower.includes('expansion') || promptLower.includes('team expansion')) {
      if (employeeName) {
        return `Looking at ${employeeName}'s team structure, I can model several growth scenarios:\n\n**Current state:** ${employeeName} manages 4 direct reports with a healthy span of control.\n\n**Scenario 1: Add 2 IC roles**\n• Maintains current structure\n• ${employeeName} would manage 6 direct reports (still optimal)\n• Cost impact: ~$180K annually\n\n**Scenario 2: Add 1 manager + 3 ICs**\n• Creates new management layer\n• ${employeeName} manages 5 direct reports\n• Enables future scaling\n• Cost impact: ~$320K annually\n\nWhich scenario would you like to explore further?`;
      }
      return `I can help you model team expansion scenarios. Here's what I'll analyze:\n\n• Current team composition and reporting structures\n• Optimal span of control ratios\n• Budget implications\n• Impact on management layers\n• Comparison with similar teams\n\nWhich team would you like to focus on?`;
    }

    if (promptLower.includes('span of control') || promptLower.includes('analyze')) {
      if (employeeName) {
        return `**${employeeName}'s Span of Control Analysis**\n\nCurrent: 4 direct reports\n\n✓ **Healthy range** (recommended: 4-8 for this level)\n\nBreakdown:\n• 2 Senior ICs (5+ years experience)\n• 1 Mid-level IC (2-4 years)\n• 1 Junior IC (<2 years)\n\nBenchmark comparison:\n• Company average: 5.2 reports\n• Industry standard: 4-6 reports\n• Your team: Within optimal range\n\n**Recommendations:**\n• Current structure is sustainable\n• Can accommodate 1-2 additional reports\n• Consider adding senior IC for mentorship\n\nWould you like to see peer comparisons?`;
      }
      return `I'll analyze span of control metrics across your organization:\n\n• Average spans by level\n• Comparison to industry benchmarks\n• Identify over/under-managed teams\n• Recommendations for rebalancing\n\nWhich area would you like me to focus on?`;
    }

    if (promptLower.includes('succession')) {
      if (employeeName) {
        return `**Succession Planning for ${employeeName}'s Role**\n\n**Critical factors:**\n• Role: VP/Director level\n• Team size: 4 direct reports\n• Key responsibilities: Team leadership, strategic planning\n\n**Internal candidates:**\n\n1. **Sarah Anderson** (Senior IC on team)\n   • Readiness: 6-12 months\n   • Strengths: Technical expertise, team mentorship\n   • Development needs: Strategic planning exposure\n\n2. **Cross-functional candidate**\n   • Readiness: 12-18 months\n   • Would bring fresh perspective\n   • Requires team familiarization\n\n**Recommendations:**\n• Begin leadership development program\n• Assign strategic projects to Sarah\n• Create 90-day transition plan\n\nWould you like a detailed development plan?`;
      }
      return `I can help you build succession plans for key roles. I'll analyze:\n\n• Critical positions and risk\n• Internal candidate pipelines\n• Skill gaps and development needs\n• Timeline recommendations\n\nWhich role should we focus on first?`;
    }

    if (promptLower.includes('benchmark') || promptLower.includes('compare') || promptLower.includes('industry')) {
      return `**Industry Benchmark Comparison**\n\nYour organization vs. industry standards:\n\n**Span of control:**\n• Your avg: 5.8 reports per manager\n• Industry avg: 5.2 reports\n• Status: Slightly above average ✓\n\n**Organizational depth:**\n• Your layers: 4 levels\n• Industry avg: 4-5 levels\n• Status: Optimal ✓\n\n**Manager ratio:**\n• Your ratio: 1:6.2 (managers:ICs)\n• Industry avg: 1:5.5\n• Status: Lean structure ✓\n\n**Key insights:**\n• Efficient organizational design\n• Room for strategic growth\n• Strong individual contributor focus\n\nWould you like department-specific comparisons?`;
    }

    return `I'll help you with that. I can analyze:\n\n• Team structures and reporting lines\n• Growth and expansion scenarios\n• Span of control metrics\n• Succession planning\n• Industry benchmarks\n\nWhat specific aspect would you like to explore?`;
  };

  // Handle AI input submit - open chat with user's message
  const handleAISubmit = (value: string) => {
    const chat = createNewChat();
    addMessage(chat.id, { type: 'user', text: value });

    // Add AI response after brief delay
    setTimeout(() => {
      addMessage(chat.id, {
        type: 'ai',
        text: generateAIResponse(value, selectedEmployeeName),
      });
    }, 500);

    selectConversation(chat.id);
    openChatPanel();
  };

  // Handle inline message suggestion click - same as text input
  const handleInlineSuggestionClick = (suggestion: { label: string }) => {
    handleAISubmit(suggestion.label);
  };

  // Handle AI button click (no prompt) - open chat with AI greeting
  const handleAIButtonClick = () => {
    const chat = createNewChat();
    addMessage(chat.id, {
      type: 'ai',
      text: selectedEmployeeName
        ? `What would you like to know about ${selectedEmployeeName}'s team?`
        : "What can I help you with regarding your org chart?",
      suggestions: selectedEmployeeName
        ? [`What if ${selectedEmployeeName}'s team grew?`, `Analyze ${selectedEmployeeName}'s span of control`, "Show succession plan"]
        : ["Plan team expansion", "Analyze span of control", "Compare to industry benchmarks"]
    });
    selectConversation(chat.id);
    openChatPanel();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Controls Bar */}
      <OrgChartControls
        employees={employees}
        depth={currentDepth}
        onDepthChange={handleDepthChange}
        onEmployeeJump={handleEmployeeJump}
        onGoUp={handleGoUp}
        onFilterOpen={handleFilterOpen}
        onExportOpen={handleExportOpen}
        showAIButton={affordanceMode === 'toolbar'}
        selectedEmployeeName={selectedEmployeeName}
        onAIButtonClick={handleAIButtonClick}
      />

      {/* AI Inline Message - Below Toolbar */}
      {affordanceMode === 'inline' && (
        <div className="pb-3">
          <AIInlineMessage
            title={selectedEmployeeName
              ? `Explore ${selectedEmployeeName}'s team scenarios`
              : "Explore staffing scenarios"
            }
            suggestions={selectedEmployeeName
              ? [
                  { label: `What if ${selectedEmployeeName}'s team grew?`, variant: 'standard' },
                  { label: `Analyze ${selectedEmployeeName}'s span of control`, variant: 'standard' },
                  { label: "Ask about anything...", variant: 'ai' },
                ]
              : [
                  { label: "Plan team expansion", variant: 'standard' },
                  { label: "Analyze span of control", variant: 'standard' },
                  { label: "Ask about anything...", variant: 'ai' },
                ]
            }
            onSuggestionClick={handleInlineSuggestionClick}
          />
        </div>
      )}

      {/* Main Canvas */}
      <Card className="flex-1 relative overflow-hidden">
        <div
          ref={canvasRef}
          className="w-full h-full relative overflow-hidden"
        >
          <OrgChartTree
            employees={employees}
            rootEmployee={rootEmployee}
            depth="all"
            focusedEmployee={undefined}
            selectedEmployee={selectedEmployee}
            expandedNodes={expandedNodes}
            onNodeSelect={handleNodeClick}
            onNodeExpand={handleNodeExpand}
            onNodePin={() => {}} // No-op for pin functionality
            showPhotos={true}
            compact={false}
            zoomLevel={zoomLevel}
            panX={panX}
            panY={panY}
            onPanChange={handlePanChange}
            onZoomChange={setZoomLevel}
          />

          {/* Zoom Controls */}
          <OrgChartZoom
            zoomLevel={zoomLevel}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
          />

          {/* Affordance Mode Switcher - Dev Toolbar Style */}
          <div
            className="absolute left-6 top-6 rounded-md border-2 border-dashed border-gray-400 dark:border-gray-500 bg-gray-100/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg"
            style={{ fontFamily: 'monospace' }}
          >
            <div className="px-3 py-1 border-b border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 text-xs font-bold tracking-wider">
              🔧 AFFORDANCE OPTIONS
            </div>
            <div className="flex p-2 gap-1">
              <button
                onClick={() => setAffordanceMode('input')}
                className={`
                  px-3 py-1.5 text-xs font-mono transition-colors rounded
                  ${affordanceMode === 'input'
                    ? 'bg-gray-600 dark:bg-gray-500 text-white font-bold'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/50'
                  }
                `}
              >
                Text Input
              </button>
              <button
                onClick={() => setAffordanceMode('toolbar')}
                className={`
                  px-3 py-1.5 text-xs font-mono transition-colors rounded
                  ${affordanceMode === 'toolbar'
                    ? 'bg-gray-600 dark:bg-gray-500 text-white font-bold'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/50'
                  }
                `}
              >
                Button
              </button>
              <button
                onClick={() => setAffordanceMode('inline')}
                className={`
                  px-3 py-1.5 text-xs font-mono transition-colors rounded
                  ${affordanceMode === 'inline'
                    ? 'bg-gray-600 dark:bg-gray-500 text-white font-bold'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/50'
                  }
                `}
              >
                Inline msg
              </button>
            </div>
          </div>

          {/* AI Input - Bottom of Canvas */}
          {affordanceMode === 'input' && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2" style={{ width: '540px' }}>
              <OrgChartAIInput
                placeholder={selectedEmployeeName
                  ? `Ask about ${selectedEmployeeName}'s team`
                  : "Ask about your org chart"
                }
                suggestions={selectedEmployeeName
                  ? [
                      { label: `What if ${selectedEmployeeName}'s team grew?` },
                      { label: "Show succession plan" }
                    ]
                  : [
                      { label: "Plan team expansion" },
                      { label: "Analyze span of control" }
                    ]
                }
                onSubmit={handleAISubmit}
                onSuggestionClick={(suggestion) => handleAISubmit(suggestion.label)}
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
