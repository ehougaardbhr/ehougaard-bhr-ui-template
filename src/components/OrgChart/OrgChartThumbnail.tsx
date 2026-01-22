import { Icon } from '../Icon';

export interface OrgChartThumbnailProps {
  title: string;
  description: string;
  timestamp?: string;
  onClick?: () => void;
}

export function OrgChartThumbnail({
  title,
  description,
  timestamp,
  onClick,
}: OrgChartThumbnailProps) {
  return (
    <div
      className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700 p-3 max-w-sm hover:border-green-300 dark:hover:border-green-700 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--surface-neutral-xx-weak)' }}>
          <Icon name="sitemap" size={20} style={{ color: 'var(--color-primary-strong)' }} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
            {title}
          </h4>

          {/* Description */}
          <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5 line-clamp-2">
            {description}
          </p>

          {/* Timestamp */}
          {timestamp && (
            <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1.5">
              {timestamp}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrgChartThumbnail;
