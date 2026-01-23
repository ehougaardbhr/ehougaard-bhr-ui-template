import { Icon } from '../Icon';

interface FeedbackCardProps {
  authorName: string;
  authorTitle: string;
  date: string;
  iconName?: string;
  avatar?: string;
  strengths: {
    question: string;
    answer: string;
  };
  improvements: {
    question: string;
    answer: string;
  };
}

export function FeedbackCard({
  authorName,
  authorTitle,
  date,
  iconName = 'face-smile',
  avatar,
  strengths,
  improvements,
}: FeedbackCardProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Author Badge */}
      <div className="flex items-center gap-4">
        {/* Icon or Avatar */}
        {avatar ? (
          <img
            src={avatar}
            alt={authorName}
            className="w-12 h-12 rounded-xl object-cover"
            style={{ boxShadow: '1px 1px 0px 1px rgba(56,49,47,0.04)' }}
          />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-[#f5f4f1] flex items-center justify-center">
            <Icon name={iconName} size={24} className="text-[var(--color-primary-strong)]" />
          </div>
        )}

        {/* Name and Title */}
        <div className="flex flex-col">
          <span className="text-[18px] leading-[26px] font-semibold text-[#38312f]">
            {authorName}
          </span>
          <span className="text-[15px] leading-[22px] text-[#777270]">
            {authorTitle}
          </span>
          <span className="text-[14px] leading-[20px] text-[#676260]">
            {date}
          </span>
        </div>
      </div>

      {/* Strengths Section */}
      <div className="pl-16">
        <p className="text-[15px] leading-[22px] font-semibold text-[#38312f] mb-1">
          {strengths.question}
        </p>
        <p className="text-[14px] leading-[20px] text-[#38312f]">
          {strengths.answer}
        </p>
      </div>

      {/* Improvements Section */}
      <div className="pl-16">
        <p className="text-[15px] leading-[22px] font-semibold text-[#38312f] mb-1">
          {improvements.question}
        </p>
        <p className="text-[14px] leading-[20px] text-[#38312f]">
          {improvements.answer}
        </p>
      </div>
    </div>
  );
}

export default FeedbackCard;
