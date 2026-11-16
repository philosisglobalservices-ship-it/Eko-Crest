import { Clock } from 'lucide-react';

interface CountdownBannerProps {
  remainingSeconds: number;
  remainingUnitsTotal: number;
}

export function formatCountdown(totalSeconds: number) {
  const safe = Math.max(0, totalSeconds);
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  return {
    hh: String(hours).padStart(2, '0'),
    mm: String(minutes).padStart(2, '0'),
    ss: String(seconds).padStart(2, '0'),
  };
}

export function CountdownBanner({ remainingSeconds, remainingUnitsTotal }: CountdownBannerProps) {
  const { hh, mm, ss } = formatCountdown(remainingSeconds);

  return (
    <div className="bg-[#121417] text-[#FAF9F6] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-10 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 truncate">
          <Clock className="w-3.5 h-3.5 text-[#D4A753] shrink-0" />
          <span className="truncate font-medium tracking-wide">
            Private Lagos Island Allocation Window · {remainingUnitsTotal} Verified Units Remaining
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:inline text-[#B8B4AC]">Legal Fee Waiver Expires In</span>
          <span className="font-mono tabular-nums font-semibold text-[#E8C57B] tracking-wider">
            {hh}:{mm}:{ss}
          </span>
        </div>
      </div>
    </div>
  );
}
