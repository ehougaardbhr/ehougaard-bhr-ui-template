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
        relative bg-white rounded-lg border border-gray-200
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
        ${isFocused ? 'ring-2 ring-green-500' : ''}
        cursor-pointer hover:shadow-md transition-shadow
      `}
      style={{
        width: cardWidth,
        height: cardHeight,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
      }}
      onClick={() => onNodeClick?.(employee.id)}
    >
      {/* Pin Icon */}
      <button
        className="absolute top-2 left-2 w-5 h-5 flex items-center justify-center
                   text-gray-400 hover:text-gray-600
                   transition-colors z-10"
        onClick={(e) => {
          e.stopPropagation();
          onPinClick?.(employee.id);
        }}
        aria-label="Pin employee"
      >
        <i className="fa-solid fa-lock text-xs"></i>
      </button>

      {/* Expand/Collapse chevron */}
      {employee.directReports > 0 && (
        <button
          className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center
                     text-gray-400 hover:text-gray-600
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
          <div className="w-12 h-12 rounded-full overflow-hidden mb-2 flex-shrink-0 bg-gray-100">
            {employee.avatar ? (
              <img
                src={employee.avatar}
                alt={employee.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <i className="fa-solid fa-user text-gray-400"></i>
              </div>
            )}
          </div>
        )}

        {/* Name */}
        <div className="text-sm font-medium text-gray-900 line-clamp-1 mb-0.5">
          {employee.name}
        </div>

        {/* Title */}
        <div className="text-xs text-gray-600 line-clamp-2 mb-0.5">
          {employee.title}
        </div>

        {/* Department */}
        <div className="text-xs text-gray-500 line-clamp-1">
          {employee.department}
        </div>

        {/* Direct Reports Count */}
        {employee.directReports > 0 && (
          <button
            className="absolute bottom-2 left-1/2 transform -translate-x-1/2
                       px-2 py-0.5 text-xs
                       text-gray-600
                       hover:bg-gray-50
                       rounded transition-colors
                       flex items-center gap-1"
            onClick={(e) => {
              e.stopPropagation();
              onExpandClick?.(employee.id);
            }}
          >
            <span>{employee.directReports}</span>
            <i className={`fa-solid fa-chevron-${isExpanded ? 'down' : 'up'} text-[8px]`}></i>
          </button>
        )}
      </div>
    </div>
  );
}
