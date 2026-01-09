import { TextHeadline } from '../../components';

export function MyInfo() {
  return (
    <div className="p-10">
      <TextHeadline size="large" color="neutral-strong">
        My Info
      </TextHeadline>
      <p className="mt-4 text-[var(--text-neutral-medium)]">
        This page will display personal employee information.
      </p>
    </div>
  );
}

export default MyInfo;
