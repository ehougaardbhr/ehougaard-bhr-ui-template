import { Icon } from '../Icon';

interface PendingFeedbackRequest {
  id: string;
  personName: string;
  personTitle: string;
  personAvatar: string;
  requestDate: string;
  emailSentDate: string;
  dueDate: string;
  daysRemaining: number;
}

interface PendingFeedbackCardProps {
  requests: PendingFeedbackRequest[];
  onCancel?: (id: string) => void;
}

export function PendingFeedbackCard({ requests, onCancel }: PendingFeedbackCardProps) {
  return (
    <div
      className="bg-[#f6f6f4] border border-[#e4e3e0] rounded-lg p-6"
    >
      {requests.map((request, index) => (
        <div key={request.id}>
          {/* Section Header */}
          <div className="flex items-start justify-between mb-4">
            <span className="text-[14px] leading-[20px] text-[#676260]">
              Waiting for feedback from...
            </span>
            <button
              onClick={() => onCancel?.(request.id)}
              className="flex items-center gap-2 text-[#0b4fd1] hover:underline"
            >
              <Icon name="xmark" size={16} className="text-[#0b4fd1]" />
              <span className="text-[15px] leading-[22px] font-medium">Cancel</span>
            </button>
          </div>

          {/* Person Badge */}
          <div className="flex items-center gap-4 mb-3">
            <img
              src={request.personAvatar}
              alt={request.personName}
              className="w-12 h-12 rounded-xl object-cover"
              style={{ boxShadow: '1px 1px 0px 1px rgba(56,49,47,0.04)' }}
            />
            <div className="flex flex-col">
              <span className="text-[18px] leading-[26px] font-semibold text-[#38312f]">
                {request.personName}
              </span>
              <span className="text-[15px] leading-[22px] text-[#777270]">
                {request.personTitle}
              </span>
              <span className="text-[14px] leading-[20px] text-[#676260]">
                {request.requestDate}
              </span>
            </div>
          </div>

          {/* Status Messages */}
          <div className="pl-16 space-y-1">
            <p className="text-[14px] leading-[20px] font-medium text-[#48413f]">
              An email requesting {request.personName.split(' ')[0]} to complete feedback was sent {request.emailSentDate}.
            </p>
            <p className="text-[14px] leading-[20px] text-[#48413f]">
              {request.personName.split(' ')[0]} has until {request.dueDate} ({request.daysRemaining} days) to complete this.
            </p>
          </div>

          {/* Divider between requests */}
          {index < requests.length - 1 && (
            <div className="w-full h-px bg-[#e4e3e0] my-6" />
          )}
        </div>
      ))}
    </div>
  );
}

export default PendingFeedbackCard;
