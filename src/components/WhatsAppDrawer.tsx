import { useState, FormEvent } from 'react';
import { X, Send, ShieldCheck, ExternalLink, PhoneCall } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../data/properties';

interface ChatMessage {
  id: string;
  sender: 'concierge' | 'visitor';
  text: string;
  timestamp: string;
}

interface WhatsAppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  contextLabel?: string;
  visitorName?: string;
}

const QUICK_PROMPTS = [
  {
    label: 'Verify C of O / Governor’s Consent',
    reply:
      'Every unit carries an active Lagos State Land Registry file number. Share the property you are reviewing and I will send the redacted Survey Plan & Registry Charting PDF directly on WhatsApp within 5 minutes.',
  },
  {
    label: 'Book Live Site Video Tour',
    reply:
      'Our Project Engineer is on-site in Ikoyi, Victoria Island, and Lekki Phase 1 Monday–Saturday (9:00 AM–5:30 PM WAT). Confirm your preferred time and we will initiate a live WhatsApp video walkthrough.',
  },
  {
    label: 'Diaspora Escrow & USD Wire',
    reply:
      'Diaspora buyers in the UK, US, Canada, and UAE can settle either via Nigerian Solicitor Escrow (NGN) or domiciliary USD account with instant Allocation Receipt issuance.',
  },
  {
    label: 'Speak to Project Developer',
    reply:
      'I have flagged your request for Engr. Babatunde (Lead Project Developer, Eko Crest Engineering). Click "Continue on WhatsApp" below to open a direct group thread with both your realtor and the site engineer.',
  },
];

export function WhatsAppDrawer({ isOpen, onClose, contextLabel, visitorName }: WhatsAppDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'concierge',
      text: `Hello${visitorName ? ` ${visitorName}` : ''}, welcome to the Eko Crest Private Allocation Desk. I am Tunde Adeyemi, Principal Partner. How can we verify a title or schedule a tour for you today?`,
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello Tunde (Eko Crest Realty), I would like to verify title documents and discuss ${
      contextLabel || 'your Lagos Island property allocation'
    }.`
  )}`;

  async function logAndReply(userText: string, cannedReply?: string) {
    const nowLabel = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const visitorMsg: ChatMessage = {
      id: `v-${Date.now()}`,
      sender: 'visitor',
      text: userText,
      timestamp: nowLabel,
    };
    setMessages((prev) => [...prev, visitorMsg]);
    setIsSending(true);

    try {
      await fetch('/api/whatsapp/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: visitorName || 'Prospective Buyer',
          topic: contextLabel || 'General Verification',
          message: userText,
        }),
      });
    } catch {
      // Non-blocking audit log
    }

    setTimeout(() => {
      const conciergeMsg: ChatMessage = {
        id: `c-${Date.now()}`,
        sender: 'concierge',
        text:
          cannedReply ||
          'Thank you. I have logged your inquiry on our priority desk. For instant document sharing (Survey Plan, C of O copy, and live site video), tap "Open in WhatsApp" below to continue directly on your phone.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, conciergeMsg]);
      setIsSending(false);
    }, 300);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput('');
    void logAndReply(trimmed);
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-[2px]" role="dialog" aria-modal="true" aria-label="WhatsApp Trust Concierge">
      <div className="w-full max-w-md bg-[#FAF9F6] h-full flex flex-col border-l border-[#E4DFD5] shadow-2xl">
        <div className="bg-[#0D4A36] text-white px-5 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-sans text-base font-semibold tracking-tight">
              Eko Crest WhatsApp Concierge
            </h2>
            <p className="text-xs text-[#CBE3D8] mt-0.5">
              Tunde Adeyemi · Principal Partner · Ikoyi & VI Desk
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close WhatsApp drawer"
            className="p-2 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-2.5 bg-[#F2EFE9] border-b border-[#E4DFD5] flex items-center gap-2 text-xs text-[#3B3F46]">
          <ShieldCheck className="w-4 h-4 text-[#0D4A36] shrink-0" />
          <span>Direct verified line to Lead Realtor & Project Developer</span>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {contextLabel && (
            <div className="text-xs text-[#52565E] bg-[#F2EFE9] border border-[#E4DFD5] rounded-md px-3 py-2">
              Topic: <span className="font-medium text-[#121417]">{contextLabel}</span>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'visitor' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.sender === 'visitor'
                    ? 'bg-[#0D4A36] text-white'
                    : 'bg-white border border-[#E4DFD5] text-[#121417]'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[11px] text-[#6B7078] mt-1">{msg.timestamp}</span>
            </div>
          ))}

          {isSending && (
            <div className="text-xs text-[#6B7078]">Typing response...</div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-[#E4DFD5] bg-[#F5F2EC] space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => void logAndReply(item.label, item.reply)}
                className="text-xs px-2.5 py-1.5 rounded-md bg-white border border-[#DCD6CA] hover:border-[#0D4A36] text-[#121417] transition-colors cursor-pointer text-left"
              >
                {item.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about title docs, payment plan, or tour..."
              className="flex-1 bg-white border border-[#DCD6CA] rounded-md px-3 py-2 text-sm text-[#121417] placeholder:text-[#7A7F87] focus:outline-none focus:border-[#0D4A36]"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="px-3 py-2 bg-[#121417] text-white rounded-md hover:bg-[#2A2E34] transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0D4A36] hover:bg-[#093627] text-white text-xs font-semibold rounded-md transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Continue Directly in WhatsApp App</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
