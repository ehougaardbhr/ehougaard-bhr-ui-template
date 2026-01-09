import { TextHeadline } from '../../components';

export function People() {
  return (
    <div className="p-10">
      <TextHeadline size="large" color="neutral-strong">
        People
      </TextHeadline>
      <p className="mt-4 text-[var(--text-neutral-medium)]">
        This page will display the employee directory.
      </p>
    </div>
  );
}

export default People;
