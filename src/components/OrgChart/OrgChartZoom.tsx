import { Icon } from '../Icon';

interface OrgChartZoomProps {
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  minZoom?: number;
  maxZoom?: number;
}

export function OrgChartZoom({
  zoomLevel,
  onZoomIn,
  onZoomOut,
  minZoom = 0.5,
  maxZoom = 2,
}: OrgChartZoomProps) {
  const canZoomIn = zoomLevel < maxZoom;
  const canZoomOut = zoomLevel > minZoom;

  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 z-10">
      {/* Zoom In */}
      <button
        onClick={onZoomIn}
        disabled={!canZoomIn}
        className="w-10 h-10 rounded-full flex items-center justify-center transition-all
                   shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          backgroundColor: 'var(--surface-neutral-white)',
          border: '1px solid var(--border-neutral-weak)',
          color: 'var(--text-neutral-strong)',
        }}
        aria-label="Zoom in"
      >
        <Icon name="magnifying-glass-plus" size={16} />
      </button>

      {/* Zoom Out */}
      <button
        onClick={onZoomOut}
        disabled={!canZoomOut}
        className="w-10 h-10 rounded-full flex items-center justify-center transition-all
                   shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          backgroundColor: 'var(--surface-neutral-white)',
          border: '1px solid var(--border-neutral-weak)',
          color: 'var(--text-neutral-strong)',
        }}
        aria-label="Zoom out"
      >
        <Icon name="magnifying-glass-minus" size={16} />
      </button>

      {/* Current Zoom Level */}
      <div
        className="px-2 py-1 rounded text-xs text-center font-medium"
        style={{
          backgroundColor: 'var(--surface-neutral-white)',
          border: '1px solid var(--border-neutral-weak)',
          color: 'var(--text-neutral-strong)',
        }}
      >
        {Math.round(zoomLevel * 100)}%
      </div>
    </div>
  );
}
