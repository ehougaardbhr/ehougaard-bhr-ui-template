import { useState, useRef, useEffect } from 'react';
import type { Employee } from '../../data/employees';
import { OrgChartTree } from './OrgChartTree';
import { OrgChartControls } from './OrgChartControls';
import { OrgChartZoom } from './OrgChartZoom';
import { Card } from '../Card';

interface OrgChartViewProps {
  employees: Employee[];
}

export function OrgChartView({ employees }: OrgChartViewProps) {
  // Local state for UI
  const canvasRef = useRef<HTMLDivElement>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<number | undefined>();

  // Initialize expanded nodes to show CEO
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(() => {
    const ceo = employees.find((emp) => emp.reportsTo === null);
    return new Set(ceo ? [ceo.id] : []);
  });

  const [depth, setDepth] = useState<number | 'all'>(1);
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

  // Handle jump to employee
  const handleEmployeeJump = (id: number) => {
    setSelectedEmployee(id);

    // Build expanded set to show path to this employee
    const newExpanded = new Set<number>();
    const targetEmployee = employees.find(e => e.id === id);

    if (targetEmployee) {
      // Add all ancestors
      let currentId: number | null = targetEmployee.reportsTo;
      while (currentId !== null) {
        newExpanded.add(currentId);
        const manager = employees.find((e) => e.id === currentId);
        currentId = manager?.reportsTo ?? null;
      }

      // Expand the target if it has reports
      if (targetEmployee.directReports > 0) {
        newExpanded.add(id);
      }
    }

    setExpandedNodes(newExpanded);

    // Center the view (simplified - would need proper calculation for exact positioning)
    setPanX(50);
    setPanY(100);
  };

  // Handle depth change
  const handleDepthChange = (newDepth: number | 'all') => {
    setDepth(newDepth);
  };

  // Handle go up (navigate to parent)
  const handleGoUp = () => {
    // Find the parent of the current selected employee and navigate to them
    if (selectedEmployee) {
      const employee = employees.find(e => e.id === selectedEmployee);
      if (employee?.reportsTo) {
        handleEmployeeJump(employee.reportsTo);
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

  return (
    <div className="flex flex-col h-full">
      {/* Controls Bar */}
      <OrgChartControls
        employees={employees}
        depth={depth}
        onDepthChange={handleDepthChange}
        onEmployeeJump={handleEmployeeJump}
        onGoUp={handleGoUp}
        onFilterOpen={handleFilterOpen}
        onExportOpen={handleExportOpen}
      />

      {/* Main Canvas */}
      <Card className="flex-1 relative overflow-hidden">
        <div
          ref={canvasRef}
          className="w-full h-full relative overflow-hidden"
        >
          <OrgChartTree
            employees={employees}
            rootEmployee="all"
            depth={depth}
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
        </div>
      </Card>
    </div>
  );
}
