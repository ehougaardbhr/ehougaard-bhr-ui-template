import { useState, useMemo } from 'react';
import { Button, Icon, EmployeeCard, Dropdown } from '../../components';
import { employees } from '../../data/employees';

type GroupBy = 'name' | 'department' | 'location' | 'division';

export function People() {
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState<GroupBy>('department');
  const [filterDepartment, setFilterDepartment] = useState('all');

  // Get unique departments for filter
  const departments = useMemo(() => {
    const unique = Array.from(new Set(employees.map((e) => e.department)));
    return [{ value: 'all', label: 'All employees' }].concat(
      unique.map((dept) => ({ value: dept, label: dept }))
    );
  }, []);

  // Filter employees by search and department
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment;
      return matchesSearch && matchesDepartment;
    });
  }, [searchQuery, filterDepartment]);

  // Group employees
  const groupedEmployees = useMemo(() => {
    if (groupBy === 'name') {
      // Group by first letter of name
      const groups: Record<string, typeof filteredEmployees> = {};
      filteredEmployees.forEach((employee) => {
        const key = employee.name.charAt(0).toUpperCase();
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(employee);
      });

      // Sort employees within each group
      Object.keys(groups).forEach((key) => {
        groups[key].sort((a, b) => a.name.localeCompare(b.name));
      });

      return groups;
    }

    // Group by the selected field
    const groups: Record<string, typeof filteredEmployees> = {};
    filteredEmployees.forEach((employee) => {
      const key = employee[groupBy];
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(employee);
    });

    // Sort employees within each group
    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => a.name.localeCompare(b.name));
    });

    return groups;
  }, [filteredEmployees, groupBy]);

  const groupByOptions = [
    { value: 'name', label: 'Name' },
    { value: 'department', label: 'Department' },
    { value: 'location', label: 'Location' },
    { value: 'division', label: 'Division' },
  ];

  return (
    <div className="p-10">
      {/* Page Header */}
      <div className="mb-6">
        <h1>Directory</h1>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between mb-6">
        <Button icon="circle-user" variant="standard">
          New employee
        </Button>

        {/* View Tabs */}
        <div className="flex items-center gap-6">
          <button
            className="flex items-center gap-2 pb-2 text-[15px] font-medium text-[var(--text-neutral-medium)] hover:text-[var(--text-neutral-strong)] transition-colors"
          >
            <Icon name="file-lines" size={20} />
            List
          </button>
          <button
            className="flex items-center gap-2 pb-2 text-[15px] font-bold text-[var(--color-primary-strong)] border-b-2 border-[var(--color-primary-strong)]"
          >
            <Icon name="user-group" size={20} />
            Directory
          </button>
          <button
            className="flex items-center gap-2 pb-2 text-[15px] font-medium text-[var(--text-neutral-medium)] hover:text-[var(--text-neutral-strong)] transition-colors"
          >
            <Icon name="chart-pie-simple" size={20} />
            Org chart
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center gap-4 mb-8">
        {/* Search */}
        <div className="flex-1 max-w-[440px]">
          <div
            className="flex items-center gap-2 h-10 px-4 py-2 bg-white border border-[var(--border-neutral-medium)] rounded-[var(--radius-full)]"
            style={{ boxShadow: 'var(--shadow-100)' }}
          >
            <Icon name="magnifying-glass" size={16} className="text-[var(--icon-neutral-strong)]" />
            <input
              type="text"
              placeholder="Search directory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-[14px] text-[var(--text-neutral-strong)] placeholder:text-[var(--text-neutral-weak)] outline-none"
            />
          </div>
        </div>

        {/* Group By Dropdown */}
        <Dropdown
          label="Group by"
          options={groupByOptions}
          value={groupBy}
          onChange={(value) => setGroupBy(value as GroupBy)}
        />

        {/* Department Filter */}
        <Dropdown
          options={departments}
          value={filterDepartment}
          onChange={setFilterDepartment}
        />
      </div>

      {/* Employee List */}
      <div className="space-y-8">
        {Object.entries(groupedEmployees).map(([groupName, groupEmployees]) => (
          <div key={groupName} className="bg-white rounded-[var(--radius-small)] border border-[var(--border-neutral-x-weak)] overflow-hidden">
            {/* Group Header */}
            <div className="px-6 py-4">
              <h2
                className="text-[22px] font-semibold text-[var(--color-primary-strong)]"
                style={{ fontFamily: 'Fields, system-ui, sans-serif', lineHeight: '30px' }}
              >
                {groupName}
              </h2>
            </div>

            {/* Employee Cards */}
            <div className="divide-y divide-[var(--border-neutral-x-weak)]">
              {groupEmployees.map((employee) => (
                <EmployeeCard key={employee.id} employee={employee} />
              ))}
            </div>
          </div>
        ))}

        {/* No Results */}
        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[15px] text-[var(--text-neutral-medium)]">
              No employees found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default People;
