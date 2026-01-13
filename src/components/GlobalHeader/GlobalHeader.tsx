import { useNavigate } from 'react-router-dom';
import { Icon } from '../Icon';
import bamboohrLogo from '../../assets/images/bamboohr-logo.svg';

interface GlobalHeaderProps {
  className?: string;
}

export function GlobalHeader({ className = '' }: GlobalHeaderProps) {
  const navigate = useNavigate();
  return (
    <header
      className={`
        flex items-center justify-between gap-6
        bg-[var(--surface-neutral-white)]
        py-8 pr-10
        max-w-[2000px]
        ${className}
      `}
    >
      {/* Logo */}
      <img
        src={bamboohrLogo}
        alt="BambooHR"
        className="w-[194px] h-[29px]"
      />

      {/* Right Section */}
      <div className="flex items-center gap-6 flex-1 justify-end">
        {/* Search Bar */}
        <div className="flex-1 max-w-[999px]">
          <div
            className="
              flex items-center gap-2
              h-8 px-4 py-2
              bg-[var(--surface-neutral-white)]
              border border-[var(--border-neutral-medium)]
              rounded-[var(--radius-full)]
            "
            style={{ boxShadow: 'var(--shadow-100)' }}
          >
            <Icon
              name="magnifying-glass"
              size={12}
              className="text-[var(--text-neutral-weak)]"
            />
            <input
              type="text"
              placeholder="Ask or search for anything..."
              className="
                flex-1 bg-transparent
                text-sm leading-5
                text-[var(--text-neutral-weak)]
                placeholder:text-[var(--text-neutral-weak)]
                outline-none
              "
            />
          </div>
        </div>

        {/* Utility Icons */}
        <div className="flex items-start gap-1">
          <button
            className="
              flex items-center justify-center
              w-[42px] h-[42px] px-[9px] py-[10px]
              rounded-[var(--radius-xx-small)]
              hover:bg-[var(--surface-neutral-xx-weak)]
              transition-colors duration-200
            "
            aria-label="Inbox"
          >
            <Icon
              name="inbox"
              size={24}
              className="text-[var(--icon-neutral-x-strong)]"
            />
          </button>

          <button
            className="
              flex items-center justify-center
              p-[9px]
              rounded-[var(--radius-xx-small)]
              hover:bg-[var(--surface-neutral-xx-weak)]
              transition-colors duration-200
            "
            aria-label="Help"
          >
            <Icon
              name="circle-question"
              size={24}
              className="text-[var(--icon-neutral-x-strong)]"
            />
          </button>

          <button
            className="
              flex items-center justify-center
              p-[9px]
              rounded-[var(--radius-xx-small)]
              hover:bg-[var(--surface-neutral-xx-weak)]
              transition-colors duration-200
            "
            aria-label="Settings"
            onClick={() => navigate('/settings')}
          >
            <Icon
              name="gear"
              size={24}
              className="text-[var(--icon-neutral-x-strong)]"
            />
          </button>
        </div>
      </div>
    </header>
  );
}

export default GlobalHeader;
