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
        className="w-12 h-12 rounded-full bg-white border border-gray-300 flex items-center justify-center transition-all
                   shadow-sm hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed text-gray-900"
        aria-label="Zoom in"
      >
        <Icon name="magnifying-glass-plus" size={18} />
      </button>

      {/* Zoom Out */}
      <button
        onClick={onZoomOut}
        disabled={!canZoomOut}
        className="w-12 h-12 rounded-full bg-white border border-gray-300 flex items-center justify-center transition-all
                   shadow-sm hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed text-gray-900"
        aria-label="Zoom out"
      >
        <Icon name="magnifying-glass-minus" size={18} />
      </button>

      {/* Current Zoom Level */}
      <div className="px-3 py-1.5 rounded-full bg-white border border-gray-300 text-xs text-center font-medium text-gray-900 shadow-sm">
        {Math.round(zoomLevel * 100)}%
      </div>
    </div>
  );
}
