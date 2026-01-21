import type { Employee } from '../../data/employees';

export interface OrgChartNodeProps {
  employee: Employee;
  isSelected?: boolean;
  isFocused?: boolean;
  onPinClick?: (id: number) => void;
  onExpandClick?: (id: number) => void;
  onNodeClick?: (id: number) => void;
  showPhoto?: boolean;
  compact?: boolean;
  isExpanded?: boolean;
}

export function OrgChartNode({
  employee,
  isSelected = false,
  isFocused = false,
  onPinClick,
  onExpandClick,
  onNodeClick,
  showPhoto = true,
  compact = false,
  isExpanded = true,
}: OrgChartNodeProps) {
  const cardWidth = compact ? 180 : 220;
  const cardHeight = showPhoto ? 120 : 100;

  return (
    <div
      className={`
        relative bg-white dark:bg-slate-800 rounded-lg shadow-md
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
        ${isFocused ? 'ring-2 ring-green-500' : ''}
        cursor-pointer hover:shadow-lg transition-shadow
      `}
      style={{ width: cardWidth, height: cardHeight }}
      onClick={() => onNodeClick?.(employee.id)}
    >
      {/* Pin Icon */}
      <button
        className="absolute top-2 left-2 w-6 h-6 flex items-center justify-center
                   text-slate-400 hover:text-slate-600 dark:hover:text-slate-200
                   transition-colors z-10"
        onClick={(e) => {
          e.stopPropagation();
          onPinClick?.(employee.id);
        }}
        aria-label="Pin employee"
      >
        <i className="fa-solid fa-thumbtack text-sm"></i>
      </button>

      {/* Expand/Collapse chevron */}
      {employee.directReports > 0 && (
        <button
          className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center
                     text-slate-400 hover:text-slate-600 dark:hover:text-slate-200
                     transition-colors z-10"
          onClick={(e) => {
            e.stopPropagation();
            onExpandClick?.(employee.id);
          }}
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          <i className={`fa-solid fa-chevron-${isExpanded ? 'up' : 'down'} text-xs`}></i>
        </button>
      )}

      {/* Card Content */}
      <div className="p-3 flex flex-col items-center text-center h-full">
        {/* Avatar */}
        {showPhoto && (
          <div className="w-12 h-12 rounded-full overflow-hidden mb-2 flex-shrink-0">
            {employee.avatar ? (
              <img
                src={employee.avatar}
                alt={employee.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
                <i className="fa-solid fa-user text-slate-400 dark:text-slate-500"></i>
              </div>
            )}
          </div>
        )}

        {/* Name */}
        <div
          className="text-sm font-semibold text-blue-600 dark:text-blue-400
                     hover:underline cursor-pointer line-clamp-1 mb-1"
          onClick={(e) => {
            e.stopPropagation();
            // Future: Navigate to employee profile
          }}
        >
          {employee.name}
        </div>

        {/* Title */}
        <div className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 mb-1">
          {employee.title}
        </div>

        {/* Department */}
        <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
          {employee.department}
        </div>

        {/* Direct Reports Count */}
        {employee.directReports > 0 && (
          <button
            className="absolute bottom-2 left-1/2 transform -translate-x-1/2
                       px-3 py-1 text-xs font-medium
                       text-slate-600 dark:text-slate-300
                       hover:bg-slate-100 dark:hover:bg-slate-700
                       rounded-full transition-colors
                       flex items-center gap-1"
            onClick={(e) => {
              e.stopPropagation();
              onExpandClick?.(employee.id);
            }}
          >
            <span>{employee.directReports}</span>
            <i className={`fa-solid fa-chevron-${isExpanded ? 'up' : 'down'} text-[10px]`}></i>
          </button>
        )}
      </div>
    </div>
  );
}
