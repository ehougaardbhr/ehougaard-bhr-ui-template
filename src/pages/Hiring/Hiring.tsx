import { TextHeadline } from '../../components';

export function Hiring() {
  return (
    <div className="p-10">
      <TextHeadline size="large" color="neutral-strong">
        Hiring
      </TextHeadline>
      <p className="mt-4 text-[var(--text-neutral-medium)]">
        This page will display recruiting and candidate information.
      </p>
    </div>
  );
}

export default Hiring;
