import Image from 'next/image';

interface BrandLogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function BrandLogo({ className = '', showTagline = true, size = 'md' }: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Dynamic Arrow Solutions Custom Emblem */}
      <div className="relative flex-shrink-0 flex items-center justify-center">
        <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-blue-700 via-sky-600 to-cyan-500 p-0.5 shadow-md shadow-sky-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center overflow-hidden">
            {/* Stylized 'A' with Arrow Icon */}
            <svg
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-sky-400 drop-shadow"
            >
              <path
                d="M10 32L18 8L23 18L13 28L10 32Z"
                fill="#004d99"
              />
              <path
                d="M19 14L28 6M28 6H20M28 6V14"
                stroke="#0284c7"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 26L30 32L24 20L14 26Z"
                fill="#0066cc"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold tracking-tight text-white text-base leading-none">
            ARROW
          </span>
          <span className="font-extrabold tracking-tight text-sky-400 text-base leading-none">
            FLOW
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] font-medium tracking-tight text-slate-400 truncate mt-1">
            Arrow Solutions • Internal OS
          </span>
        )}
      </div>
    </div>
  );
}
