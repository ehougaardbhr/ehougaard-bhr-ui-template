import { Icon } from '../Icon';

export function ArtifactToolBar() {
  return (
    <div
      className="flex flex-col items-start px-6 py-6 shrink-0"
      style={{
        backgroundColor: 'var(--surface-neutral-white)',
      }}
    >
      <div className="flex flex-col gap-2">
        {/* AI Assistant - active/primary */}
        <button
          className="w-12 h-12 flex items-center justify-center rounded-2xl"
          style={{
            backgroundColor: 'transparent',
          }}
        >
          <Icon name="sparkles" size={20} className="text-[var(--color-primary-strong)]" />
        </button>

        {/* Edit/Pen */}
        <button
          className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-[var(--surface-neutral-xx-weak)]"
          style={{
            backgroundColor: 'transparent',
          }}
        >
          <Icon name="pen-to-square" size={20} className="text-[var(--text-neutral-strong)]" />
        </button>

        {/* Search */}
        <button
          className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-[var(--surface-neutral-xx-weak)]"
          style={{
            backgroundColor: 'transparent',
          }}
        >
          <Icon name="magnifying-glass" size={20} className="text-[var(--text-neutral-strong)]" />
        </button>

        {/* Image */}
        <button
          className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-[var(--surface-neutral-xx-weak)]"
          style={{
            backgroundColor: 'transparent',
          }}
        >
          <Icon name="image" size={20} className="text-[var(--text-neutral-strong)]" />
        </button>
      </div>
    </div>
  );
}

export default ArtifactToolBar;
