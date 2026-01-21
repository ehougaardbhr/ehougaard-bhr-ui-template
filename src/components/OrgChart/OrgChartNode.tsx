import type { Employee } from '../../data/employees';
import { Icon } from '../Icon';

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
  const cardWidth = 165;
  const avatarSize = 56;
  const avatarOffset = 28; // Half avatar above card

  return (
    <div
      className="relative"
      style={{
        width: cardWidth,
        height: 140, // Total height including avatar overhang
      }}
    >
      {/* Avatar - centered at top, overhanging */}
      {showPhoto && (
        <div
          className="absolute left-1/2 transform -translate-x-1/2 overflow-hidden z-20"
          style={{
            width: avatarSize,
            height: avatarSize,
            borderRadius: '12px',
            top: 0,
            boxShadow: '1px 1px 0px 1px rgba(56, 49, 47, 0.04)',
          }}
        >
          {employee.avatar ? (
            <img
              src={employee.avatar}
              alt={employee.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-400 flex items-center justify-center">
              <i className="fa-solid fa-user text-white text-xl"></i>
            </div>
          )}
        </div>
      )}

      {/* Card */}
      <div
        className={`
          absolute bg-white cursor-pointer transition-all
          ${isSelected ? 'ring-2 ring-blue-500' : ''}
          ${isFocused ? 'ring-2 ring-green-500' : ''}
        `}
        style={{
          width: cardWidth,
          top: avatarOffset,
          borderRadius: '8px',
          border: '1px solid #e4e3e0',
          boxShadow: '1px 1px 0px 1px rgba(56, 49, 47, 0.04)',
          padding: '8px',
        }}
        onClick={() => onNodeClick?.(employee.id)}
      >
        {/* Top row - pin and chevron icons */}
        <div className="flex items-start justify-between w-full mb-2">
          <button
            className="flex items-center justify-center w-3 h-3 text-[#777270] hover:text-gray-600 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onPinClick?.(employee.id);
            }}
            aria-label="Pin employee"
          >
            <i className="fa-solid fa-thumbtack text-[12px]"></i>
          </button>

          {employee.directReports > 0 && (
            <button
              className="flex items-center justify-center w-3 h-3 text-[#777270] hover:text-gray-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onExpandClick?.(employee.id);
              }}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              <i className={`fa-solid fa-chevron-${isExpanded ? 'up' : 'down'} text-[12px]`}></i>
            </button>
          )}
        </div>

        {/* Content - name and title */}
        <div className="flex flex-col items-center text-center w-full pt-2 pb-0">
          {/* Name - Green */}
          <div
            className="font-medium text-[15px] leading-[22px] text-[#2e7918] w-full overflow-hidden text-ellipsis mb-0"
            style={{ fontFamily: 'Inter' }}
          >
            {employee.name}
          </div>

          {/* Title */}
          <div
            className="font-normal text-[13px] leading-[19px] text-[#48413f] w-full overflow-hidden text-ellipsis"
            style={{ fontFamily: 'Inter' }}
          >
            {employee.title}
          </div>
        </div>

        {/* Bottom right - Direct reports count */}
        {employee.directReports > 0 && (
          <div className="flex items-start justify-end w-full mt-2">
            <button
              className="flex gap-1 items-center justify-end hover:opacity-70 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onExpandClick?.(employee.id);
              }}
            >
              <span className="font-normal text-[13px] leading-[19px] text-[#38312f]">
                {employee.directReports}
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="text-[#777270]"
              >
                {isExpanded ? (
                  // Chevron down
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : (
                  // Chevron up
                  <path
                    d="M3 7.5L6 4.5L9 7.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
