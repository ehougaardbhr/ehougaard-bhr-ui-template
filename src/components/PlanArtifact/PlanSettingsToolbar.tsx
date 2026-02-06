import type { PlanSettings, PlanStatus } from '../../data/artifactData';
import { planStatusLabels } from '../../data/artifactData';

interface PlanSettingsToolbarProps {
  settings: PlanSettings;
  onSettingsChange: (settings: Partial<PlanSettings>) => void;
}

const statusOptions: PlanStatus[] = ['draft', 'pending_approval', 'approved', 'in_progress', 'completed'];

export function PlanSettingsToolbar({ settings, onSettingsChange }: PlanSettingsToolbarProps) {
  const totalItems = settings.sections.reduce(
    (sum, s) => sum + (s.actionItems?.length || 0), 0
  );
  const completedItems = settings.sections.reduce(
    (sum, s) => sum + (s.actionItems?.filter(i => i.status === 'completed').length || 0), 0
  );

  return (
    <div
      className="flex items-center gap-4 px-6 py-3 border-b"
      style={{ borderColor: 'var(--border-neutral-x-weak)' }}
    >
      {/* Status selector */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-[var(--text-neutral-medium)]">Status</label>
        <select
          value={settings.status}
          onChange={(e) => onSettingsChange({ status: e.target.value as PlanStatus })}
          className="text-sm px-3 py-1.5 rounded-lg border bg-[var(--surface-neutral-white)]"
          style={{
            borderColor: 'var(--border-neutral-medium)',
            color: 'var(--text-neutral-strong)',
          }}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {planStatusLabels[status]}
            </option>
          ))}
        </select>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center gap-2 ml-auto">
        <span className="text-xs text-[var(--text-neutral-weak)]">
          {completedItems}/{totalItems} items
        </span>
        <div className="w-24 h-1.5 rounded-full bg-[var(--surface-neutral-xx-weak)]">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: totalItems > 0 ? `${(completedItems / totalItems) * 100}%` : '0%',
              backgroundColor: 'var(--color-primary-strong)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
