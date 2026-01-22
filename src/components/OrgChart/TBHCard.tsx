import { Icon } from '../Icon';

export interface TBHCardProps {
  count: number;
  role?: string;
  onExpandClick?: () => void;
  isExpanded?: boolean;
}

export function TBHCard({
  count = 1,
  role = 'This role is not filled\nat the moment',
  onExpandClick,
  isExpanded = false,
}: TBHCardProps) {
  const cardWidth = 185;
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
      {/* Avatar placeholder - centered at top, overhanging */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 overflow-hidden z-20 flex items-center justify-center"
        style={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: '12px',
          top: 0,
          backgroundColor: 'var(--surface-neutral-medium)',
        }}
      >
        <Icon name="user" size={36} className="text-white" />
      </div>

      {/* Card with dashed border */}
      <div
        className="absolute bg-[var(--surface-neutral-xx-weak)] border-dashed cursor-pointer"
        style={{
          width: cardWidth,
          top: avatarOffset,
          borderRadius: '8px',
          border: '1px dashed var(--border-neutral-weak)',
          padding: '8px',
        }}
        onClick={onExpandClick}
      >
        {/* Top row - pin and chevron icons */}
        <div className="flex items-start justify-between w-full mb-2">
          <button
            className="flex items-center justify-center w-3 h-3 text-[#777270] dark:text-neutral-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
            }}
            aria-label="Pin"
          >
            <i className="fa-solid fa-thumbtack text-[12px]"></i>
          </button>

          {count > 1 && (
            <button
              className="flex items-center justify-center w-3 h-3 text-[#777270] dark:text-neutral-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onExpandClick?.();
              }}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              <i className={`fa-solid fa-chevron-${isExpanded ? 'up' : 'down'} text-[12px]`}></i>
            </button>
          )}
        </div>

        {/* Content - role description */}
        <div className="flex flex-col items-center text-center w-full pt-2 pb-0">
          <div
            className="font-normal text-[13px] leading-[19px] text-[#48413f] dark:text-neutral-400 w-full overflow-hidden text-ellipsis whitespace-pre-line"
            style={{ fontFamily: 'Inter' }}
          >
            {role}
          </div>
        </div>

        {/* Bottom right - Count if multiple positions */}
        <div className="flex items-start justify-end w-full mt-2" style={{ minHeight: '19px' }}>
          {count > 1 && (
            <button
              className="flex gap-1 items-center justify-end hover:opacity-70 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onExpandClick?.();
              }}
            >
              <span className="font-normal text-[13px] leading-[19px] text-[#38312f] dark:text-neutral-400">
                {count}
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="text-[#777270] dark:text-neutral-500"
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
          )}
        </div>
      </div>
    </div>
  );
}

export default TBHCard;
