import { useState } from 'react';
import { Icon, TextInput, Button } from '../../components';

interface FeedbackTabContentProps {
  employeeName: string;
}

export function FeedbackTabContent({ employeeName }: FeedbackTabContentProps) {
  const [searchValue, setSearchValue] = useState('');

  const summaryText = `${employeeName}'s colleagues have shared positive feedback, praising her for her perseverance and dedication to protecting employee morale during times of transition. She is appreciated for her dependability, good questions, and ability to get work done on time. However, some suggest she should speak up about her ideas. Overall, she is seen as a great counselor and team member, with a notable sense of generosity and kindness.`;

  return (
    <div className="flex flex-col">
      {/* Helper Text (Info Message) */}
      <div className="flex items-start gap-3">
        <Icon name="circle-info" size={16} className="text-[var(--icon-neutral-strong)] mt-0.5" />
        <span className="text-[15px] leading-[20px] text-[var(--text-neutral-medium)]">
          Just so you know: feedback is hidden from {employeeName}
        </span>
      </div>

      {/* Request Feedback Section */}
      <div className="mt-4">
        {/* Section Header with Icon and Tooltip */}
        <div className="flex items-center gap-3">
          <Icon name="sparkles" size={20} className="text-[var(--color-primary-strong)]" />
          <span className="text-[15px] leading-[24px] font-medium text-[var(--text-neutral-strong)]">
            Request feedback about {employeeName}
          </span>
          <Icon name="circle-question" size={16} className="text-[var(--icon-neutral-strong)]" />
        </div>

        {/* Instruction Text */}
        <p className="text-[15px] leading-[20px] text-[var(--text-neutral-medium)] mt-3">
          Select some employees who work with {employeeName}
        </p>

        {/* Feedback Request Form */}
        <div className="flex items-center gap-[10px] mt-3">
          <TextInput
            value={searchValue}
            onChange={setSearchValue}
            placeholder="Search names"
            className="w-[395px]"
            inputClassName="h-8"
          />
          <Button variant="standard" size="small" className="w-[112px]">
            Send Request
          </Button>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[var(--border-neutral-x-weak)] my-4" />

      {/* Feedback Summary Section */}
      <div>
        {/* Section Header with Icon and Tooltip */}
        <div className="flex items-center gap-3">
          <Icon name="sparkles" size={20} className="text-[var(--color-primary-strong)]" />
          <span className="text-[15px] leading-[24px] font-medium text-[var(--text-neutral-strong)]">
            Summary of feedback about {employeeName}
          </span>
          <Icon name="circle-question" size={16} className="text-[var(--icon-neutral-strong)]" />
        </div>

        {/* Summary Text */}
        <p className="text-[15px] leading-[20px] text-[var(--text-neutral-medium)] mt-3 pl-8">
          {summaryText}
        </p>
      </div>
    </div>
  );
}

export default FeedbackTabContent;
