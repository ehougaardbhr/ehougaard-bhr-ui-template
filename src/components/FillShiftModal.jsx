import { Button } from './Button';
import { Icon } from './Icon';

export default function FillShiftModal({ isOpen, dayLabel, openShiftCount, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/35 flex items-center justify-center p-6">
      <div className="w-full max-w-[520px] bg-[var(--surface-neutral-white)] rounded-[var(--radius-medium)] border border-[var(--border-neutral-x-weak)] shadow-xl">
        <div className="px-5 py-4 border-b border-[var(--border-neutral-x-weak)] flex items-center justify-between">
          <h3 className="text-[22px] font-bold text-[var(--color-primary-strong)]" style={{ fontFamily: 'Fields, system-ui, sans-serif', lineHeight: '26px' }}>
            Fill Open Shift
          </h3>
          <button onClick={onClose} className="text-[var(--icon-neutral-strong)] hover:text-[var(--text-neutral-strong)]">
            <Icon name="xmark" size={16} />
          </button>
        </div>
        <div className="px-5 py-4 space-y-3">
          <p className="text-[14px] text-[var(--text-neutral-strong)]">
            {dayLabel}: {openShiftCount} open shift{openShiftCount === 1 ? '' : 's'} identified.
          </p>
          <p className="text-[13px] text-[var(--text-neutral-medium)]">
            Suggested action: notify available employees and auto-prioritize those under weekly hour targets.
          </p>
        </div>
        <div className="px-5 py-4 border-t border-[var(--border-neutral-x-weak)] flex items-center justify-end gap-2">
          <Button variant="ghost" size="small" className="!h-9 !px-4" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="small" className="!h-9 !px-4" onClick={onConfirm}>Create Fill Plan</Button>
        </div>
      </div>
    </div>
  );
}
