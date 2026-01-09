import { TextHeadline } from '../../components';

export function Files() {
  return (
    <div className="p-10">
      <TextHeadline size="large" color="neutral-strong">
        Files
      </TextHeadline>
      <p className="mt-4 text-[var(--text-neutral-medium)]">
        This page will display document management.
      </p>
    </div>
  );
}

export default Files;
