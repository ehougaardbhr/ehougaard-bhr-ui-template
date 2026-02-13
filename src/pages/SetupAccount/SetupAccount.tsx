import { useNavigate } from 'react-router-dom';
import { Icon } from '../../components';

const checklistIllustrationUrl = 'https://www.figma.com/api/mcp/asset/07dcc9a4-90a8-4755-a1e6-783e681c9acd';

interface SetupStep {
  id: number;
  title: string;
  description: string;
  inProgress?: boolean;
}

const setupSteps: SetupStep[] = [
  { id: 1, title: 'Company Verification', description: 'In Progress', inProgress: true },
  { id: 2, title: 'Company Setup', description: 'In Progress', inProgress: true },
  { id: 3, title: 'Payroll Setup', description: 'Start running your payroll' },
  { id: 4, title: 'Employee Data', description: 'Create employee records and data' },
  { id: 5, title: 'Hiring', description: 'Create job postings and manage applicants' },
  { id: 6, title: 'Benefits', description: 'Set up your employee benefits' },
  { id: 7, title: 'Time Off', description: 'Set up your Time Off features' },
  { id: 8, title: 'Onboarding', description: 'Manage tasks for employee onboarding' },
  { id: 9, title: 'Payroll', description: 'Pay your employees' },
  { id: 10, title: 'Employee Community', description: 'Communication platform' },
  { id: 11, title: 'Performance', description: 'Tools for goal setting and tracking' },
  { id: 12, title: 'Total Rewards', description: 'Share the full picture of compensation' },
  { id: 13, title: 'Global Hiring', description: 'Hire a distributed workforce' },
  { id: 14, title: 'Enable Access', description: 'Grant access to other team members' },
];

function SetupStepCard({ step }: { step: SetupStep }) {
  return (
    <button
      type="button"
      className="
        group
        flex
        w-full
        items-center
        gap-4
        rounded-[var(--radius-x-small)]
        border border-[var(--border-neutral-x-weak)]
        bg-[var(--surface-neutral-white)]
        px-4
        py-3
        text-left
        transition-colors
        hover:bg-[var(--surface-neutral-xx-weak)]
      "
      style={{ boxShadow: 'var(--shadow-100)' }}
    >
      <div
        className="
          flex
          h-12
          w-12
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-[var(--surface-neutral-x-weak)]
          text-[26px]
          font-semibold
          leading-[34px]
          text-[var(--text-neutral-medium)]
        "
        style={{ fontFamily: 'Fields, system-ui, sans-serif' }}
      >
        {step.id}
      </div>

      <div className="min-w-0 flex-1">
        <div
          className="text-[26px] font-semibold leading-[34px] text-[var(--text-neutral-x-strong)]"
          style={{ fontFamily: 'Fields, system-ui, sans-serif' }}
        >
          {step.title}
        </div>
        <div className="text-[13px] leading-[19px] text-[var(--text-neutral-medium)]">
          {step.description}
        </div>
      </div>

      <div
        className="
          flex
          h-12
          w-12
          shrink-0
          items-center
          justify-center
          rounded-full
          border border-[var(--border-neutral-medium)]
          text-[var(--text-neutral-medium)]
          group-hover:text-[var(--text-neutral-strong)]
        "
      >
        <Icon name="arrow-left" size={12} className="rotate-180" />
      </div>
    </button>
  );
}

export function SetupAccount() {
  const navigate = useNavigate();

  return (
    <div className="p-10">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="mb-4 flex items-center gap-2 text-[13px] font-medium leading-[19px] text-[var(--text-neutral-medium)] hover:text-[var(--text-neutral-strong)]"
      >
        <Icon name="angle-left" size={14} />
        Back
      </button>

      <h1
        className="mb-16 text-[52px] font-bold leading-[62px] text-[var(--color-primary-strong)]"
        style={{ fontFamily: 'Fields, system-ui, sans-serif' }}
      >
        Let&apos;s set up your account
      </h1>

      <section
        className="
          flex
          mt-6
          min-h-[1562px]
          gap-10
          rounded-[var(--radius-small)]
          border border-[var(--border-neutral-x-weak)]
          bg-[var(--surface-neutral-white)]
          p-6
        "
        style={{ boxShadow: 'var(--shadow-300)' }}
      >
        <div className="w-[540px] shrink-0 space-y-3">
          {setupSteps.map((step) => (
            <SetupStepCard key={step.id} step={step} />
          ))}
        </div>

        <div className="relative flex flex-1 items-start justify-center pt-4">
          <div className="absolute top-[60px] h-[500px] w-[500px] rounded-full bg-[var(--surface-neutral-xx-weak)]" />
          <img
            src={checklistIllustrationUrl}
            alt="Checklist illustration"
            className="relative z-10 h-auto w-[520px] max-w-full"
          />
        </div>
      </section>
    </div>
  );
}

export default SetupAccount;
