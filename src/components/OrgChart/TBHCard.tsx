export interface TBHCardProps {
  count?: number;
  onExpandClick?: () => void;
  isExpanded?: boolean;
}

export function TBHCard({
  count = 1,
  onExpandClick,
  isExpanded = false,
}: TBHCardProps) {
  const cardWidth = 185;
  const avatarSize = 56;
  const avatarOffset = 28;

  return (
    <div
      className="relative"
      style={{
        width: cardWidth,
        height: 140,
      }}
    >
      {/* Avatar - gray with person silhouette */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 z-20 flex items-center justify-center"
        style={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: '12px',
          top: 0,
          backgroundColor: '#c6c2bf',
          boxShadow: '1px 1px 0px 1px rgba(56, 49, 47, 0.04)',
        }}
      >
        {/* Person silhouette SVG */}
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="10" r="6" fill="white" />
          <path
            d="M4 28c0-6.627 5.373-12 12-12s12 5.373 12 12"
            fill="white"
          />
        </svg>
      </div>

      {/* Card with dashed border */}
      <div
        className="absolute cursor-pointer"
        style={{
          width: cardWidth,
          top: avatarOffset,
          borderRadius: '8px',
          border: '1px dashed #d4d2d0',
          backgroundColor: '#f6f6f4',
          boxShadow: '1px 1px 0px 1px rgba(56, 49, 47, 0.04)',
          padding: '8px',
        }}
        onClick={onExpandClick}
      >
        {/* Top row - pin and chevron icons */}
        <div className="flex items-start justify-between w-full mb-2">
          <button
            className="flex items-center justify-center"
            style={{ width: '12px', height: '12px', color: '#777270' }}
            onClick={(e) => e.stopPropagation()}
            aria-label="Pin"
          >
            <i className="fa-solid fa-thumbtack" style={{ fontSize: '12px' }}></i>
          </button>

          <button
            className="flex items-center justify-center"
            style={{ width: '12px', height: '12px', color: '#777270' }}
            onClick={(e) => {
              e.stopPropagation();
              onExpandClick?.();
            }}
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            <i className="fa-solid fa-chevron-up" style={{ fontSize: '12px' }}></i>
          </button>
        </div>

        {/* Content - "This role is not filled at the moment" */}
        <div className="flex flex-col items-center text-center w-full pt-2 pb-0">
          <p
            className="font-normal text-[13px] leading-[19px] text-center"
            style={{ fontFamily: 'Inter', color: '#48413f' }}
          >
            This role is not filled
            <br />
            at the moment
          </p>
        </div>

        {/* Bottom right - Count with chevron if multiple positions */}
        <div className="flex items-center justify-end w-full mt-2" style={{ minHeight: '19px' }}>
          {count > 1 && (
            <div className="flex gap-1 items-center">
              <span
                className="font-normal text-[13px] leading-[19px]"
                style={{ fontFamily: 'Inter', color: '#38312f' }}
              >
                {count}
              </span>
              <i className="fa-solid fa-chevron-down" style={{ fontSize: '12px', color: '#777270' }}></i>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TBHCard;
