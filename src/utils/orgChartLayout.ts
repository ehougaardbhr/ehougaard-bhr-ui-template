import type { Employee } from '../data/employees';

// Node spacing constants
const HORIZONTAL_SPACING = 40;
const VERTICAL_SPACING = 80;
const NODE_WIDTH = 220;
const NODE_HEIGHT = 120;

export interface TreeNode {
  employee: Employee;
  children: TreeNode[];
  x: number;
  y: number;
  level: number;
}

export interface LayoutResult {
  nodes: TreeNode[];
  width: number;
  height: number;
  root: TreeNode | null;
}

/**
 * Build a tree structure from flat employee data
 */
export function buildEmployeeTree(
  employees: Employee[],
  rootId: number | 'all'
): TreeNode | null {
  // Create a map of employee ID to employee
  const employeeMap = new Map<number, Employee>();
  employees.forEach((emp) => employeeMap.set(emp.id, emp));

  // Find the root employee
  let rootEmployee: Employee | undefined;
  if (rootId === 'all') {
    // Find the CEO (employee with no manager, reportsTo === null)
    rootEmployee = employees.find((emp) => emp.reportsTo === null);
  } else {
    rootEmployee = employeeMap.get(rootId);
  }

  if (!rootEmployee) return null;

  // Recursively build tree
  function buildNode(employee: Employee, level: number): TreeNode {
    const node: TreeNode = {
      employee,
      children: [],
      x: 0,
      y: level * (NODE_HEIGHT + VERTICAL_SPACING),
      level,
    };

    // Find all employees who report to this employee
    const reports = employees.filter((emp) => emp.reportsTo === employee.id);

    node.children = reports.map((emp) => buildNode(emp, level + 1));

    return node;
  }

  return buildNode(rootEmployee, 0);
}

/**
 * Calculate tree layout using the Reingold-Tilford algorithm
 * This produces a tidy tree layout with proper spacing
 */
export function calculateTreeLayout(
  root: TreeNode | null,
  maxDepth: number | 'all' = 'all'
): LayoutResult {
  if (!root) {
    return { nodes: [], width: 0, height: 0, root: null };
  }

  const nodes: TreeNode[] = [];

  // First pass: Calculate relative positions
  function firstPass(node: TreeNode, depth: number): number {
    if (maxDepth !== 'all' && depth > maxDepth) {
      return 0;
    }

    nodes.push(node);

    if (node.children.length === 0) {
      return NODE_WIDTH;
    }

    let totalWidth = 0;
    node.children.forEach((child) => {
      totalWidth += firstPass(child, depth + 1);
      totalWidth += HORIZONTAL_SPACING;
    });

    // Remove extra spacing after last child
    if (node.children.length > 0) {
      totalWidth -= HORIZONTAL_SPACING;
    }

    return totalWidth;
  }

  // Second pass: Position nodes horizontally
  function secondPass(node: TreeNode, leftBound: number, depth: number): number {
    if (maxDepth !== 'all' && depth > maxDepth) {
      return leftBound;
    }

    if (node.children.length === 0) {
      node.x = leftBound + NODE_WIDTH / 2;
      return leftBound + NODE_WIDTH;
    }

    // Position children first
    let currentX = leftBound;
    const childPositions: number[] = [];

    node.children.forEach((child) => {
      const childCenter = secondPass(child, currentX, depth + 1);
      childPositions.push((currentX + childCenter) / 2);
      currentX = childCenter + HORIZONTAL_SPACING;
    });

    // Center parent over children
    if (childPositions.length > 0) {
      const firstChildX = childPositions[0];
      const lastChildX = childPositions[childPositions.length - 1];
      node.x = (firstChildX + lastChildX) / 2;
    } else {
      node.x = leftBound + NODE_WIDTH / 2;
    }

    return currentX - HORIZONTAL_SPACING;
  }

  // Calculate layout
  const totalWidth = firstPass(root, 0);
  secondPass(root, 0, 0);

  // Calculate total height
  const maxLevel = Math.max(...nodes.map((n) => n.level));
  const totalHeight = (maxLevel + 1) * (NODE_HEIGHT + VERTICAL_SPACING);

  return {
    nodes,
    width: totalWidth,
    height: totalHeight,
    root,
  };
}

/**
 * Filter employees by department
 */
export function filterEmployeesByDepartment(
  employees: Employee[],
  department: string
): Employee[] {
  if (department === 'all') {
    return employees;
  }
  return employees.filter(
    (emp) => emp.department.toLowerCase() === department.toLowerCase()
  );
}

/**
 * Find all descendants of an employee up to a certain depth
 */
export function findDescendants(
  employee: Employee,
  allEmployees: Employee[],
  maxDepth: number | 'all' = 'all'
): Employee[] {
  const descendants: Employee[] = [employee];

  function traverse(emp: Employee, currentDepth: number) {
    if (maxDepth !== 'all' && currentDepth >= maxDepth) {
      return;
    }

    // Find direct reports
    // Note: This logic needs to be updated based on actual employee relationships
    const reports = allEmployees.filter((e) => {
      // Placeholder - needs proper implementation
      return false;
    });

    reports.forEach((report) => {
      descendants.push(report);
      traverse(report, currentDepth + 1);
    });
  }

  traverse(employee, 0);
  return descendants;
}

/**
 * Get the path from root to a specific employee
 */
export function getPathToEmployee(
  root: TreeNode,
  targetId: number
): TreeNode[] | null {
  const path: TreeNode[] = [];

  function search(node: TreeNode): boolean {
    path.push(node);

    if (node.employee.id === targetId) {
      return true;
    }

    for (const child of node.children) {
      if (search(child)) {
        return true;
      }
    }

    path.pop();
    return false;
  }

  return search(root) ? path : null;
}
