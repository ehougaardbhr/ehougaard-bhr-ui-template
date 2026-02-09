import { Icon } from '../../components/Icon';

export function Automations() {
  return (
    <div className="p-8 h-full overflow-y-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1
          style={{
            fontFamily: 'Fields, system-ui, sans-serif',
            fontSize: '48px',
            fontWeight: 700,
            lineHeight: '56px',
            color: '#2e7918',
          }}
        >
          Automations
        </h1>
      </div>

      <div className="rounded-xl border border-[var(--border-neutral-weak)] bg-[var(--surface-neutral-white)] p-12 text-center">
        <Icon name="sparkles" size={48} className="text-[var(--icon-neutral-weak)] mb-4" />
        <p className="text-lg text-[var(--text-neutral-strong)]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          Automations hub coming soon
        </p>
        <p className="text-sm text-[var(--text-neutral-x-strong)] mt-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          Your AI control center — see everything running on your behalf.
        </p>
      </div>
    </div>
  );
}
