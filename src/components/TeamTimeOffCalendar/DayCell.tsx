import { Icon } from '../Icon';
import { SHADES, type DayData } from './heatmap';

interface DayCellProps {
  data: DayData | null;
  isSpotlight: boolean;
  isSelected: boolean;
  onSelect: (data: DayData, rect: DOMRect) => void;
}

export function DayCell({ data, isSpotlight, isSelected, onSelect }: DayCellProps) {
  // Padding cell (day belongs to an adjacent month).
  if (!data) return <div className="min-h-[92px] rounded-[var(--radius-xx-small)]" />;

  // Weekends are de-emphasized — coverage isn't tracked on them.
  if (data.isWeekend) {
    return (
      <div className="min-h-[92px] rounded-[var(--radius-xx-small)] bg-[var(--surface-neutral-xx-weak)] opacity-50 p-1.5">
        <span className="text-[12px] font-medium text-[var(--text-neutral-weak)]">{data.day}</span>
      </div>
    );
  }

  const approvedCount = data.approved.length;
  const pendingCount = data.pending.length;
  const hasContent = approvedCount > 0 || pendingCount > 0;
  const shade = SHADES[data.step];
  const isDark = shade.dark;
  const pct = Math.round(data.approvedPct * 100);

  const textStrong = isDark ? 'text-white' : 'text-[var(--text-neutral-strong)]';
  const textMuted = isDark ? 'text-white/80' : 'text-[var(--text-neutral-medium)]';

  // Border / ring logic: over-threshold wins with a red ring; pending gets a
  // dashed outline; otherwise a hairline border.
  const outlineClass = data.overThreshold
    ? 'ring-2 ring-inset ring-red-500 border border-transparent'
    : pendingCount > 0
      ? 'border-2 border-dashed border-[var(--border-neutral-medium)]'
      : 'border border-[var(--border-neutral-x-weak)]';

  const clickable = hasContent;
  const avatars = data.approved.slice(0, 3);
  const extra = approvedCount - avatars.length;

  return (
    <button
      type="button"
      disabled={!clickable}
      onClick={(e) => onSelect(data, (e.currentTarget as HTMLElement).getBoundingClientRect())}
      title={
        hasContent
          ? `${approvedCount} approved${pendingCount ? `, ${pendingCount} pending` : ''} · ${pct}% of team out`
          : 'No one out'
      }
      style={{ backgroundColor: data.step === 0 ? undefined : shade.bg }}
      className={[
        'relative min-h-[92px] w-full text-left p-1.5 rounded-[var(--radius-xx-small)] transition-shadow',
        data.step === 0 ? 'bg-[var(--surface-neutral-white)]' : '',
        outlineClass,
        clickable ? 'cursor-pointer hover:shadow-[var(--shadow-300)]' : 'cursor-default',
        isSelected ? 'shadow-[var(--shadow-300)] outline outline-2 outline-offset-1 outline-[var(--color-primary-strong)]' : '',
        isSpotlight ? 'animate-pulse' : '',
      ].join(' ')}
    >
      {/* Top row: day number + markers */}
      <div className="flex items-start justify-between">
        <span className={`text-[12px] font-semibold ${data.isToday ? 'flex items-center justify-center w-5 h-5 rounded-full bg-[var(--color-primary-strong)] text-white' : textStrong}`}>
          {data.day}
        </span>
        <div className="flex items-center gap-1">
          {data.overThreshold && (
            <Icon name="triangle-exclamation" size={13} className="text-red-500" />
          )}
          {pendingCount > 0 && (
            <span
              title={`${pendingCount} pending`}
              className="flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-amber-400 text-white text-[10px] font-bold leading-none"
            >
              {pendingCount}
            </span>
          )}
        </div>
      </div>

      {/* Count / percent badge */}
      {approvedCount > 0 && (
        <div className={`mt-1 text-[13px] font-bold leading-tight ${textStrong}`}>
          {approvedCount} <span className={`text-[11px] font-semibold ${textMuted}`}>· {pct}%</span>
        </div>
      )}
      {approvedCount === 0 && pendingCount > 0 && (
        <div className={`mt-1 text-[11px] font-semibold ${textMuted}`}>Pending only</div>
      )}

      {/* Avatar stack */}
      {avatars.length > 0 && (
        <div className="mt-1.5 flex items-center">
          {avatars.map((e, i) => (
            <img
              key={e.id}
              src={e.avatarUrl}
              alt={e.employeeName}
              className={`w-5 h-5 rounded-full object-cover ring-2 ${isDark ? 'ring-[#2e7918]' : 'ring-white'} ${i > 0 ? '-ml-1.5' : ''}`}
              style={data.step === 3 ? { boxShadow: '0 0 0 2px #6bb84e' } : undefined}
            />
          ))}
          {extra > 0 && (
            <span className={`-ml-1.5 flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold ring-2 ${isDark ? 'bg-white/25 text-white ring-[#2e7918]' : 'bg-[var(--surface-neutral-xx-weak)] text-[var(--text-neutral-medium)] ring-white'}`}>
              +{extra}
            </span>
          )}
        </div>
      )}
    </button>
  );
}
