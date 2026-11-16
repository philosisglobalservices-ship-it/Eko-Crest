import { MessageCircle } from 'lucide-react';
import type { FunnelStage } from '../types/funnel';

interface HeaderProps {
  activeStage: FunnelStage;
  onSelectStage: (stage: FunnelStage) => void;
  onOpenWhatsApp: () => void;
}

const NAV_ITEMS: Array<{ id: FunnelStage; label: string }> = [
  { id: 'squeeze', label: '01. Briefing' },
  { id: 'sales', label: '02. Properties' },
  { id: 'thankyou', label: '03. Portfolio Offer' },
  { id: 'delivery', label: '04. Delivery' },
];

export function Header({ activeStage, onSelectStage, onOpenWhatsApp }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-sm border-b border-[#E4DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            onSelectStage('squeeze');
          }}
          className="font-editorial text-2xl font-semibold tracking-tight text-[#121417] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D4A36] rounded-sm"
        >
          Eko Crest
        </a>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#52565E]" aria-label="Funnel navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = activeStage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectStage(item.id)}
                className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D4A36] ${
                  isActive
                    ? 'text-[#0D4A36] border-[#0D4A36] font-semibold'
                    : 'text-[#52565E] border-transparent hover:text-[#121417] hover:border-[#D4CFC4]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenWhatsApp}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0D4A36] hover:bg-[#093627] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0D4A36]"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Desk</span>
          </button>
        </div>
      </div>

      <div className="md:hidden border-t border-[#E4DFD5] px-4 py-2 flex items-center justify-between gap-2 overflow-x-auto bg-[#F5F2EC]">
        {NAV_ITEMS.map((item) => {
          const isActive = activeStage === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectStage(item.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                isActive ? 'bg-[#0D4A36] text-white' : 'text-[#52565E] hover:text-[#121417]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
