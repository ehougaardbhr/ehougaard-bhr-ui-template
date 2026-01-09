import { TextHeadline } from '../../components';

export function Payroll() {
  return (
    <div className="p-10">
      <TextHeadline size="large" color="neutral-strong">
        Payroll
      </TextHeadline>
      <p className="mt-4 text-[var(--text-neutral-medium)]">
        This page will display compensation and payroll information.
      </p>
    </div>
  );
}

export default Payroll;
