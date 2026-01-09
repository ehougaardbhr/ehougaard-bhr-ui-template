import { TextHeadline } from '../../components';

export function Reports() {
  return (
    <div className="p-10">
      <TextHeadline size="large" color="neutral-strong">
        Reports
      </TextHeadline>
      <p className="mt-4 text-[var(--text-neutral-medium)]">
        This page will display analytics and reports.
      </p>
    </div>
  );
}

export default Reports;
