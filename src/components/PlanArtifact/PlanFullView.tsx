import { useState } from 'react';
import { Icon } from '../Icon';
import type { Artifact, PlanSettings, PlanSection, ActionItem } from '../../data/artifactData';
import { planStatusLabels } from '../../data/artifactData';

interface PlanFullViewProps {
  artifact: Artifact;
  onSettingsChange: (settings: Partial<PlanSettings>) => void;
  isEditMode?: boolean;
}

function ActionItemRow({
  item,
  onToggle,
}: {
  item: ActionItem;
  onToggle: (itemId: string) => void;
}) {
  return (
    <div
      className="flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-[var(--surface-neutral-xx-weak)] transition-colors cursor-pointer"
      onClick={() => onToggle(item.id)}
    >
      <div className="mt-0.5 shrink-0">
        {item.status === 'completed' ? (
          <Icon name="check-circle" size={18} style={{ color: 'var(--color-primary-strong)' }} />
        ) : item.status === 'in_progress' ? (
          <div
            className="w-[18px] h-[18px] rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--color-primary-strong)', borderTopColor: 'transparent' }}
          />
        ) : (
          <div
            className="w-[18px] h-[18px] rounded-full border-2"
            style={{ borderColor: 'var(--border-neutral-medium)' }}
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm ${item.status === 'completed' ? 'line-through text-[var(--text-neutral-weak)]' : 'text-[var(--text-neutral-strong)]'}`}
        >
          {item.description}
        </p>
        <div className="flex items-center gap-3 mt-1">
          {item.owner && (
            <span className="text-xs text-[var(--text-neutral-weak)]">{item.owner}</span>
          )}
          {item.dueDate && (
            <span className="text-xs text-[var(--text-neutral-weak)]">Due: {item.dueDate}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  section,
  onToggleItem,
}: {
  section: PlanSection;
  onToggleItem: (sectionId: string, itemId: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        border: '1px solid var(--border-neutral-weak)',
        backgroundColor: 'var(--surface-neutral-white)',
      }}
    >
      {/* Section header */}
      <button
        className="w-full flex items-center gap-3 p-4 hover:bg-[var(--surface-neutral-xx-weak)] transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Icon
          name="caret-down"
          size={12}
          className="text-[var(--text-neutral-medium)] transition-transform shrink-0"
          style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
        />
        <h4
          className="font-bold text-left"
          style={{
            fontSize: '16px',
            lineHeight: '24px',
            fontFamily: 'Fields, system-ui, sans-serif',
            color: 'var(--text-neutral-strong)',
          }}
        >
          {section.title}
        </h4>
        {section.actionItems && section.actionItems.length > 0 && (
          <span className="text-xs text-[var(--text-neutral-weak)] ml-auto shrink-0">
            {section.actionItems.filter(i => i.status === 'completed').length}/{section.actionItems.length}
          </span>
        )}
      </button>

      {/* Section content */}
      {isExpanded && (
        <div className="px-4 pb-4">
          {section.content && (
            <p className="text-sm text-[var(--text-neutral-medium)] mb-3 pl-[24px]">
              {section.content}
            </p>
          )}
          {section.actionItems && section.actionItems.length > 0 && (
            <div className="space-y-1 pl-3">
              {section.actionItems.map((item) => (
                <ActionItemRow
                  key={item.id}
                  item={item}
                  onToggle={(itemId) => onToggleItem(section.id, itemId)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function PlanFullView({ artifact, onSettingsChange, isEditMode = true }: PlanFullViewProps) {
  const settings = artifact.settings as PlanSettings;

  const handleToggleItem = (sectionId: string, itemId: string) => {
    if (!isEditMode) return;

    const updatedSections = settings.sections.map((section) => {
      if (section.id === sectionId && section.actionItems) {
        return {
          ...section,
          actionItems: section.actionItems.map((item) => {
            if (item.id === itemId) {
              const nextStatus = item.status === 'completed' ? 'pending' : 'completed';
              return { ...item, status: nextStatus as ActionItem['status'] };
            }
            return item;
          }),
        };
      }
      return section;
    });

    onSettingsChange({ sections: updatedSections });
  };

  const handleApprove = () => {
    onSettingsChange({
      status: 'approved',
      approvedBy: 'Jess (You)',
      approvedAt: new Date().toISOString(),
    });
  };

  const handleReject = () => {
    onSettingsChange({ status: 'draft' });
  };

  const totalItems = settings.sections.reduce(
    (sum, s) => sum + (s.actionItems?.length || 0), 0
  );
  const completedItems = settings.sections.reduce(
    (sum, s) => sum + (s.actionItems?.filter(i => i.status === 'completed').length || 0), 0
  );

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-3xl mx-auto">
        {/* Status and progress header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--text-neutral-medium)]">
              Status: <strong>{planStatusLabels[settings.status]}</strong>
            </span>
            <span className="text-sm text-[var(--text-neutral-weak)]">
              {completedItems}/{totalItems} items complete
            </span>
          </div>

          {/* Approve/Reject buttons for pending plans */}
          {settings.status === 'pending_approval' && isEditMode && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleReject}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: 'var(--surface-neutral-white)',
                  border: '1px solid var(--border-neutral-medium)',
                  color: 'var(--text-neutral-strong)',
                }}
              >
                Request Changes
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
                style={{ backgroundColor: 'var(--color-primary-strong)' }}
              >
                Approve Plan
              </button>
            </div>
          )}

          {settings.status === 'approved' && settings.approvedBy && (
            <span className="text-xs text-[var(--text-neutral-weak)]">
              Approved by {settings.approvedBy}
            </span>
          )}
        </div>

        {/* Progress bar */}
        {totalItems > 0 && (
          <div className="w-full h-2 rounded-full bg-[var(--surface-neutral-xx-weak)] mb-8">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${(completedItems / totalItems) * 100}%`,
                backgroundColor: 'var(--color-primary-strong)',
              }}
            />
          </div>
        )}

        {/* Sections */}
        <div className="space-y-4">
          {settings.sections.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              onToggleItem={handleToggleItem}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
