import { useState, useMemo } from 'react';
import { Dropdown, Icon, Pagination } from '../../components';
import { EmployeeTableRow } from '../EmployeeTableRow';
import type { Employee } from '../../data/employees';

interface PeopleListViewProps {
  employees: Employee[];
}

export function PeopleListView({ employees }: PeopleListViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');
  const itemsPerPage = 50;

  // Filter employees by status
  const filteredEmployees = useMemo(() => {
    if (filterStatus === 'all') {
      return employees;
    }
    return employees.filter((emp) => emp.employmentStatus === filterStatus);
  }, [employees, filterStatus]);

  // Pagination
  const totalItems = filteredEmployees.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  const statusOptions = [
    { value: 'all', label: 'All Employees' },
    { value: 'Full-Time', label: 'Full-Time' },
    { value: 'Part-Time', label: 'Part-Time' },
    { value: 'Contractor', label: 'Contractor' },
  ];

  return (
    <div>
      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* All Employees Dropdown */}
          <Dropdown
            options={statusOptions}
            value={filterStatus}
            onChange={setFilterStatus}
          />

          {/* Employee Count */}
          <div
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '15px',
              fontWeight: 400,
              color: 'var(--text-neutral-medium)',
            }}
          >
            {totalItems} employees
          </div>

          {/* Showing + Active Dropdown */}
          <div className="flex items-center gap-2">
            <span
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '15px',
                fontWeight: 400,
                color: 'var(--text-neutral-medium)',
              }}
            >
              Showing
            </span>
            <Dropdown
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
              value="active"
              onChange={() => {}}
            />
          </div>
        </div>

        {/* Ellipsis Menu */}
        <button
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[var(--surface-neutral-xx-weak)] transition-colors"
          aria-label="More options"
        >
          <Icon name="ellipsis" size={20} />
        </button>
      </div>

      {/* Table Card */}
      <div
        className="bg-[var(--surface-neutral-white)] rounded-[16px] border border-[var(--border-neutral-x-weak)] overflow-hidden"
        style={{ boxShadow: '1px 1px 0px 2px rgba(56, 49, 47, 0.03)' }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--surface-neutral-xx-weak)' }}>
              <th
                className="px-6 py-4 text-left"
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--text-neutral-x-strong)',
                  borderTopLeftRadius: '8px',
                }}
              >
                Employee Photo
              </th>
              <th
                className="px-6 py-4 text-left"
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--text-neutral-x-strong)',
                }}
              >
                Employee #
              </th>
              <th
                className="px-6 py-4 text-left"
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--text-neutral-x-strong)',
                }}
              >
                Last Name, First Name
              </th>
              <th
                className="px-6 py-4 text-left"
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--text-neutral-x-strong)',
                }}
              >
                Job Title
              </th>
              <th
                className="px-6 py-4 text-left"
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--text-neutral-x-strong)',
                }}
              >
                Location
              </th>
              <th
                className="px-6 py-4 text-left"
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--text-neutral-x-strong)',
                }}
              >
                Employment Status
              </th>
              <th
                className="px-6 py-4 text-left"
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--text-neutral-x-strong)',
                  borderTopRightRadius: '8px',
                }}
              >
                Hire Date
              </th>
            </tr>
          </thead>
          <tbody>
            {currentEmployees.map((employee) => (
              <EmployeeTableRow key={employee.id} employee={employee} />
            ))}
          </tbody>
        </table>

        {/* Pagination inside card */}
        <div className="px-4 py-4 border-t border-[var(--border-neutral-x-weak)]">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}

export default PeopleListView;
