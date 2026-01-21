import { useState, useRef, useEffect } from 'react';
import type { Artifact, OrgChartSettings } from '../../data/artifactData';
import { employees } from '../../data/employees';
import { OrgChartTree } from './OrgChartTree';
import { OrgChartControls } from './OrgChartControls';
import { OrgChartZoom } from './OrgChartZoom';

interface OrgChartArtifactProps {
  artifact: Artifact;
  onSettingsChange: (settings: Partial<OrgChartSettings>) => void;
  isEditMode?: boolean;
}

export function OrgChartArtifact({
  artifact,
  onSettingsChange,
  isEditMode = false,
}: OrgChartArtifactProps) {
  const rawSettings = artifact.settings as OrgChartSettings;

  // Provide defaults for all settings
  const settings: OrgChartSettings = {
    rootEmployee: rawSettings?.rootEmployee ?? 'all',
    depth: rawSettings?.depth ?? 'all',
    showPhotos: rawSettings?.showPhotos ?? true,
    compact: rawSettings?.compact ?? false,
    filter: rawSettings?.filter ?? 'all',
  };

  // Local state for UI
  const canvasRef = useRef<HTMLDivElement>(null);
  const [focusedEmployee, setFocusedEmployee] = useState<number | undefined>();
  const [selectedEmployee, setSelectedEmployee] = useState<number | undefined>();
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(
    new Set(employees.map((emp) => emp.id))
  );
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

  // Filter employees based on settings
  // When filtering by department, include the full reporting chain up to root
  const filteredEmployees = (() => {
    if (settings.filter === 'all') {
      return employees;
    }

    // Get all employees in the target department
    const targetDept = settings.filter.toLowerCase();
    const deptEmployees = employees.filter(
      (emp) => emp.department.toLowerCase() === targetDept
    );

    // Get all ancestors (managers) for these employees
    const ancestorIds = new Set<number>();
    deptEmployees.forEach((emp) => {
      let currentId = emp.reportsTo;
      while (currentId !== null) {
        ancestorIds.add(currentId);
        const manager = employees.find((e) => e.id === currentId);
        currentId = manager?.reportsTo ?? null;
      }
    });

    // Include department employees + their ancestors
    return employees.filter(
      (emp) =>
        emp.department.toLowerCase() === targetDept || ancestorIds.has(emp.id)
    );
  })();

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

  // Handle pin (focus on employee)
  const handleNodePin = (id: number) => {
    setFocusedEmployee(id);
    // Update settings to make this employee the root
    onSettingsChange({ rootEmployee: id.toString() });
  };

  // Handle jump to employee
  const handleEmployeeJump = (id: number) => {
    setFocusedEmployee(id);
    setSelectedEmployee(id);
    // Center the view on this employee (simplified - would need proper calculation)
    setPanX(0);
    setPanY(100);
  };

  // Handle depth change
  const handleDepthChange = (depth: number | 'all') => {
    onSettingsChange({ depth });
  };

  // Handle go up
  const handleGoUp = () => {
    // Find parent of current focused employee
    // For now, just reset to "all"
    onSettingsChange({ rootEmployee: 'all' });
    setFocusedEmployee(undefined);
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

  // Handle filter open (placeholder)
  const handleFilterOpen = () => {
    console.log('Filter menu opened');
    // This would open a modal or dropdown for filtering options
  };

  // Handle export open (placeholder)
  const handleExportOpen = () => {
    console.log('Export menu opened');
    // This would open a modal or dropdown with export options
  };

  // Determine root employee
  const rootEmployeeId =
    settings.rootEmployee === 'all'
      ? 'all'
      : parseInt(settings.rootEmployee, 10) || 'all';

  return (
    <div className="flex flex-col h-full">
      {/* Controls Bar */}
      <OrgChartControls
        employees={filteredEmployees}
        depth={settings.depth}
        onDepthChange={handleDepthChange}
        onEmployeeJump={handleEmployeeJump}
        onGoUp={handleGoUp}
        onFilterOpen={handleFilterOpen}
        onExportOpen={handleExportOpen}
      />

      {/* Main Canvas */}
      <div ref={canvasRef} className="flex-1 relative overflow-hidden bg-[#F5F5F0]">
        <OrgChartTree
          employees={filteredEmployees}
          rootEmployee={rootEmployeeId}
          depth={settings.depth}
          focusedEmployee={focusedEmployee}
          selectedEmployee={selectedEmployee}
          expandedNodes={expandedNodes}
          onNodeSelect={setSelectedEmployee}
          onNodeExpand={handleNodeExpand}
          onNodePin={handleNodePin}
          showPhotos={settings.showPhotos}
          compact={settings.compact}
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
    </div>
  );
}
