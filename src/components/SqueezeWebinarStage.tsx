import { useEffect, useState, FormEvent } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  MessageCircle,
  Pause,
  Play,
  ShieldCheck,
} from 'lucide-react';
import {
  HERO_IMAGE,
  MAILCHIMP_SEQUENCE_TEMPLATE,
  TESTIMONIALS,
  WEBINAR_CHAPTERS,
  WEBINAR_POSTER,
} from '../data/properties';
import type { LeadSubscriber } from '../types/funnel';
import { formatCountdown } from './CountdownBanner';
import { ResilientImage } from './ResilientImage';

interface SqueezeWebinarStageProps {
  remainingSeconds: number;
  subscriber: LeadSubscriber | null;
  onSubscribed: (sub: LeadSubscriber) => void;
  onProceedToSales: () => void;
  onOpenWhatsApp: (topic?: string) => void;
}

const WEBINAR_DURATION_SECONDS = 1080; // 18:00 executive briefing

export function SqueezeWebinarStage({
  remainingSeconds,
  subscriber,
  onSubscribed,
  onProceedToSales,
  onOpenWhatsApp,
}: SqueezeWebinarStageProps) {
  const [firstName, setFirstName] = useState(subscriber?.firstName || '');
  const [email, setEmail] = useState(subscriber?.email || '');
  const [whatsapp, setWhatsapp] = useState(subscriber?.whatsapp || '');
  const [buyerProfile, setBuyerProfile] = useState(
    subscriber?.buyerProfile || 'Diaspora Investor (UK / US / Canada / EU)'
  );
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Interactive Webinar Replay state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSeconds, setPlaybackSeconds] = useState(0);
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);

  const isUnlocked = Boolean(subscriber);
  const { hh, mm, ss } = formatCountdown(remainingSeconds);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setPlaybackSeconds((prev) => {
        const next = prev + 1;
        // Preview cap at 45s if visitor hasn't opted into Mailchimp sequence yet
        if (!isUnlocked && next >= 45) {
          setIsPlaying(false);
          return 45;
        }
        if (next >= WEBINAR_DURATION_SECONDS) {
          setIsPlaying(false);
          return WEBINAR_DURATION_SECONDS;
        }
        return next;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isPlaying, isUnlocked]);

  useEffect(() => {
    for (let i = WEBINAR_CHAPTERS.length - 1; i >= 0; i--) {
      if (playbackSeconds >= WEBINAR_CHAPTERS[i].seconds) {
        setActiveChapterIdx(i);
        break;
      }
    }
  }, [playbackSeconds]);

  function formatPlayerTime(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function handleSelectChapter(idx: number) {
    const targetSec = WEBINAR_CHAPTERS[idx].seconds;
    if (!isUnlocked && targetSec > 45) {
      const el = document.getElementById('squeeze-optin-form');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setFormError('Enter your name, email, and WhatsApp below to unlock all 4 webinar chapters.');
      return;
    }
    setActiveChapterIdx(idx);
    setPlaybackSeconds(targetSec);
    setIsPlaying(true);
  }

  async function handleOptInSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError('');

    if (firstName.trim().length < 2) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError('Please enter a valid email address for the Mailchimp title dossier.');
      return;
    }
    if (whatsapp.trim().length < 7) {
      setFormError('Please enter your WhatsApp number so our Lagos desk can verify inquiries.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/mailchimp/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          email: email.trim(),
          whatsapp: whatsapp.trim(),
          buyerProfile,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setFormError(data.error || 'Unable to register your briefing access.');
        setIsSubmitting(false);
        return;
      }
      onSubscribed(data.subscriber);
      setIsPlaying(true);
      const videoEl = document.getElementById('webinar-replay-section');
      videoEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch {
      setFormError('Network error while connecting to briefing server. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const activeChapter = WEBINAR_CHAPTERS[activeChapterIdx];

  return (
    <div className="pb-20">
      {/* PRE-SELL STAGE 1: SQUEEZE HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: High-Conviction Thesis + Mailchimp Squeeze Capture */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-white border border-[#E4DFD5] rounded-xl p-6 sm:p-8">
            <div>
              <p className="text-xs font-medium text-[#0D4A36] tracking-wide mb-3">
                Private Lagos Island Briefing · Old Ikoyi · Eko Atlantic · Victoria Island
              </p>
              <h1
                className="font-editorial font-semibold text-[#121417] leading-[1.08] tracking-tight text-balance mb-4"
                style={{ fontSize: 'clamp(2.25rem, 4vw, 3.35rem)' }}
              >
                Acquire Verified Lagos Waterfront Property Before the Next 28% Revaluation
              </h1>
              <p className="text-sm sm:text-base text-[#4A4E56] leading-relaxed mb-6">
                Watch the 18-minute private investor replay revealing how diaspora and Lagos-based buyers
                secure C of O and Governor’s Consent residences generating 11.8%–14.2% net rental yield
                without title risk.
              </p>
            </div>

            {!subscriber ? (
              <form id="squeeze-optin-form" onSubmit={handleOptInSubmit} className="space-y-3.5 pt-4 border-t border-[#EAE5DC]">
                <div className="flex items-center justify-between text-xs text-[#52565E]">
                  <span className="font-semibold text-[#121417]">
                    Step 1: Unlock Full Webinar Replay & Title Dossier
                  </span>
                  <span className="font-mono tabular-nums text-[#8C5B12] font-semibold">
                    Window: {hh}:{mm}:{ss}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="squeeze-name" className="block text-xs font-medium text-[#3B3F46] mb-1">
                      Full Name
                    </label>
                    <input
                      id="squeeze-name"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Adebayo Adeleke"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#D8D2C5] rounded-md text-[#121417] placeholder:text-[#8A8F98] focus:outline-none focus:border-[#0D4A36]"
                    />
                  </div>
                  <div>
                    <label htmlFor="squeeze-whatsapp" className="block text-xs font-medium text-[#3B3F46] mb-1">
                      WhatsApp Number
                    </label>
                    <input
                      id="squeeze-whatsapp"
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="+234 809... or +44 77..."
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#D8D2C5] rounded-md text-[#121417] placeholder:text-[#8A8F98] focus:outline-none focus:border-[#0D4A36]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="squeeze-email" className="block text-xs font-medium text-[#3B3F46] mb-1">
                      Email Address (For Mailchimp Briefing)
                    </label>
                    <input
                      id="squeeze-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#D8D2C5] rounded-md text-[#121417] placeholder:text-[#8A8F98] focus:outline-none focus:border-[#0D4A36]"
                    />
                  </div>
                  <div>
                    <label htmlFor="squeeze-profile" className="block text-xs font-medium text-[#3B3F46] mb-1">
                      Buyer Profile
                    </label>
                    <select
                      id="squeeze-profile"
                      value={buyerProfile}
                      onChange={(e) => setBuyerProfile(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#D8D2C5] rounded-md text-[#121417] focus:outline-none focus:border-[#0D4A36]"
                    >
                      <option>Diaspora Investor (UK / US / Canada / EU)</option>
                      <option>Lagos Executive / Corporate Buyer</option>
                      <option>Institutional / Family Office</option>
                    </select>
                  </div>
                </div>

                {formError && (
                  <p className="text-xs font-medium text-[#991B1B] bg-[#FEF2F2] border border-[#FECACA] rounded-md px-3 py-2" role="alert">
                    {formError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#0D4A36] hover:bg-[#093627] disabled:opacity-60 text-white text-sm font-semibold rounded-md transition-colors cursor-pointer"
                >
                  <span>{isSubmitting ? 'Activating Briefing & Email Dossier...' : 'Watch Webinar Replay & Claim Legal Fee Waiver'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-[#6B7078] flex items-center justify-between gap-2">
                  <span>Enrolls you in our 5-part Lagos Title & Yield Mailchimp sequence.</span>
                  <button
                    type="button"
                    onClick={onProceedToSales}
                    className="text-[#0D4A36] font-semibold hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Skip to Properties
                  </button>
                </p>
              </form>
            ) : (
              <div className="pt-4 border-t border-[#EAE5DC] space-y-4">
                <div className="bg-[#F0F7F4] border border-[#BFE0D1] rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#0D4A36] shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-[#121417]">
                      Briefing Unlocked for {subscriber.firstName}
                    </p>
                    <p className="text-xs text-[#3B3F46] mt-1">
                      Mailchimp Day 0 Dossier dispatched to <span className="font-medium">{subscriber.email}</span>.
                      Your 24-hour legal charting fee waiver is active.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={onProceedToSales}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0D4A36] hover:bg-[#093627] text-white text-sm font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <span>Enter Private Property Sales Room</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenWhatsApp('Verify Lagos Title Documents')}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[#D8D2C5] hover:border-[#0D4A36] text-[#121417] text-sm font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4 text-[#0D4A36]" />
                    <span>Ask on WhatsApp</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Full-height Hero Architectural Showcase */}
          <div className="lg:col-span-6 relative rounded-xl overflow-hidden border border-[#E4DFD5] min-h-[360px] lg:min-h-full">
            <ResilientImage
              src={HERO_IMAGE}
              alt="Waterfront luxury glass penthouse terrace overlooking Ikoyi and Lagos Lagoon at sunset"
              className="w-full h-full object-cover"
              fallbackTitle="Old Ikoyi Waterfront Penthouse"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
              <p className="text-xs text-[#E8C57B] font-medium tracking-wide mb-1.5">
                Featured Allocation · Old Ikoyi & Eko Atlantic
              </p>
              <p className="font-editorial text-2xl sm:text-3xl font-semibold leading-snug max-w-lg">
                “Don’t wait to buy Lagos waterfront land. Buy verified title waterfront and wait.”
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/80">
                <span>Governor’s Consent & C of O Verified</span>
                <span aria-hidden="true">·</span>
                <span>11.8%–14.2% Net Rental Yield</span>
                <span aria-hidden="true">·</span>
                <span>Escrow Protected</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4-COLUMN QUANTITATIVE PROOF STRIP (Below Hero Split) */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white border border-[#E4DFD5] rounded-xl p-5 sm:p-6">
          <div>
            <p className="font-mono tabular-nums text-2xl font-semibold text-[#121417]">+28.4%</p>
            <p className="text-xs text-[#52565E] mt-1">Avg. 24-month Ikoyi & Eko Atlantic appreciation</p>
          </div>
          <div>
            <p className="font-mono tabular-nums text-2xl font-semibold text-[#121417]">₦18.5B</p>
            <p className="text-xs text-[#52565E] mt-1">Verified prime Lagos Island client allocations</p>
          </div>
          <div>
            <p className="font-mono tabular-nums text-2xl font-semibold text-[#121417]">100%</p>
            <p className="text-xs text-[#52565E] mt-1">Alausa Land Registry charted titles before payment</p>
          </div>
          <div>
            <p className="font-mono tabular-nums text-2xl font-semibold text-[#121417]">19 Days</p>
            <p className="text-xs text-[#52565E] mt-1">Average time to place corporate expat tenant</p>
          </div>
        </div>
      </section>

      {/* PRE-SELL STAGE 2: WEBINAR REPLAY VIDEO & AUTHORITY BRIDGE */}
      <section id="webinar-replay-section" className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-12">
        <div className="border-t border-[#E4DFD5] pt-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-medium text-[#0D4A36] mb-1">
                Pre-Sell Step 2 · Executive Webinar Replay
              </p>
              <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#121417] text-balance">
                The Lagos Prime Allocation Blueprint (18-Min Briefing)
              </h2>
            </div>
            <div className="text-xs text-[#52565E]">
              {isUnlocked ? (
                <span className="font-medium text-[#0D4A36]">Full 4-Chapter Access Unlocked</span>
              ) : (
                <span>45-second preview active · Submit form above for full replay</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Interactive Webinar Video Player */}
            <div className="lg:col-span-7 bg-[#121417] rounded-xl overflow-hidden border border-[#2A2D33] text-white">
              <div className="relative aspect-video bg-black">
                <ResilientImage
                  src={WEBINAR_POSTER}
                  alt="Principal Partner presenting the Lagos Luxury Real Estate Investment Webinar in Victoria Island"
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    isPlaying ? 'opacity-65' : 'opacity-85'
                  }`}
                  fallbackTitle="Eko Crest Executive Briefing"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/25 flex flex-col justify-between p-5 sm:p-6">
                  <div className="flex items-center justify-between text-xs text-white/85">
                    <span>Eko Crest Private Investor Briefing</span>
                    <span className="font-mono tabular-nums">
                      {activeChapter.timeLabel} · Chapter {activeChapterIdx + 1} of 4
                    </span>
                  </div>

                  {/* Synchronized Slide Callout Overlay */}
                  <div className="my-auto max-w-xl bg-black/65 backdrop-blur-sm border border-white/15 rounded-lg p-4 sm:p-5">
                    <p className="text-xs text-[#E8C57B] font-medium mb-1">
                      Key Briefing Slide · {activeChapter.timeLabel}
                    </p>
                    <h3 className="font-editorial text-xl sm:text-2xl font-semibold text-white mb-2">
                      {activeChapter.title}
                    </h3>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-white/90">
                      {activeChapter.slideBulletPoints.map((pt) => (
                        <li key={pt} className="flex items-start gap-2">
                          <span className="text-[#E8C57B] font-bold">·</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Gate overlay if 45s preview finishes without opt-in */}
                  {!isUnlocked && playbackSeconds >= 45 && (
                    <div className="bg-[#121417]/95 border border-[#E8C57B]/40 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 text-xs sm:text-sm">
                        <Lock className="w-4 h-4 text-[#E8C57B] shrink-0" />
                        <span>Preview paused at 00:45. Enter your email above to watch Chapters 2–4.</span>
                      </div>
                      <a
                        href="#squeeze-optin-form"
                        className="px-3.5 py-2 bg-[#0D4A36] hover:bg-[#093627] text-white text-xs font-semibold rounded-md whitespace-nowrap text-center"
                      >
                        Unlock Full Replay
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Player Controls & Scrub Bar */}
              <div className="p-4 sm:p-5 bg-[#181A1F] border-t border-white/10 space-y-3">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (!isUnlocked && playbackSeconds >= 45) {
                        document.getElementById('squeeze-optin-form')?.scrollIntoView({ behavior: 'smooth' });
                        return;
                      }
                      setIsPlaying((p) => !p);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#0D4A36] hover:bg-[#093627] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer shrink-0"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlaying ? 'Pause Replay' : 'Play Webinar'}</span>
                  </button>

                  <div className="flex-1">
                    <input
                      type="range"
                      min={0}
                      max={WEBINAR_DURATION_SECONDS}
                      value={playbackSeconds}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (!isUnlocked && val > 45) {
                          setPlaybackSeconds(45);
                          setIsPlaying(false);
                          document.getElementById('squeeze-optin-form')?.scrollIntoView({ behavior: 'smooth' });
                          return;
                        }
                        setPlaybackSeconds(val);
                      }}
                      aria-label="Webinar playback progress"
                      className="w-full accent-[#0D4A36] cursor-pointer"
                    />
                  </div>

                  <span className="font-mono tabular-nums text-xs text-[#B8B4AC] shrink-0">
                    {formatPlayerTime(playbackSeconds)} / 18:00
                  </span>
                </div>

                <p className="text-xs text-[#B8B4AC] leading-relaxed">
                  {activeChapter.speakerTakeaway}
                </p>
              </div>
            </div>

            {/* Right Column: Chapters + Dan Lok Value Stack Preview + Bridge CTA */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-white border border-[#E4DFD5] rounded-xl p-5">
                <h3 className="text-sm font-semibold text-[#121417] mb-3">
                  Webinar Replay Chapters
                </h3>
                <div className="divide-y divide-[#EAE5DC]">
                  {WEBINAR_CHAPTERS.map((chap, idx) => {
                    const isSelected = idx === activeChapterIdx;
                    const locked = !isUnlocked && chap.seconds > 45;
                    return (
                      <button
                        key={chap.timeLabel}
                        type="button"
                        onClick={() => handleSelectChapter(idx)}
                        className={`w-full py-3 px-2 flex items-start justify-between gap-3 text-left transition-colors cursor-pointer rounded-md ${
                          isSelected ? 'bg-[#F0F7F4]' : 'hover:bg-[#FAF9F6]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2 text-xs text-[#52565E]">
                            <span className="font-mono tabular-nums font-semibold text-[#0D4A36]">
                              {chap.timeLabel}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>Module {idx + 1}</span>
                          </div>
                          <p className="text-sm font-semibold text-[#121417] mt-0.5">
                            {chap.title}
                          </p>
                        </div>
                        {locked ? (
                          <Lock className="w-4 h-4 text-[#8C5B12] shrink-0 mt-1" />
                        ) : (
                          <Play className="w-4 h-4 text-[#0D4A36] shrink-0 mt-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Direct-Response Bridge Box */}
              <div className="bg-[#121417] text-white rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-xs text-[#E8C57B] font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  <span>24-Hour Allocation Trigger Active</span>
                </div>
                <h3 className="font-editorial text-2xl font-semibold leading-snug">
                  Ready to Lock Your Unit Before the Next Developer Revaluation?
                </h3>
                <p className="text-xs sm:text-sm text-[#C8C4BC] leading-relaxed">
                  Reserve with as little as ₦3.5M–₦10M in solicitor-held escrow today and get up to
                  ₦8.5M in Alausa Legal Search, Snagging Audit, and Corporate Tenant Onboarding waived.
                </p>
                <div className="pt-1 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={onProceedToSales}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0D4A36] hover:bg-[#13664B] text-white text-sm font-semibold rounded-md transition-colors cursor-pointer"
                  >
                    <span>View Available Lagos Units</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenWhatsApp('Webinar Question & Title Proof')}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/15 text-white text-sm font-medium rounded-md transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-[#E8C57B]" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAILCHIMP FIRST-TIME EMAIL SEQUENCE + ATTRIBUTABLE TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Mailchimp Sequence Inspector */}
          <div className="lg:col-span-5 bg-white border border-[#E4DFD5] rounded-xl p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#0D4A36]" />
                <h3 className="text-base font-semibold text-[#121417]">
                  Mailchimp First-Time Investor Sequence
                </h3>
              </div>
              <span className="text-xs font-medium text-[#0D4A36]">
                {subscriber
                  ? subscriber.mailchimpMode === 'live_api'
                    ? 'Mailchimp API Synced'
                    : 'Sequence Active'
                  : '5-Day Automation'}
              </span>
            </div>
            <p className="text-xs text-[#52565E] mb-4 leading-relaxed">
              Every first-time visitor who opts in receives a structured 5-part Mailchimp briefing
              covering C of O due diligence, yield comparisons, and allocation deadlines.
            </p>
            <div className="divide-y divide-[#EAE5DC]">
              {(subscriber?.sequence || MAILCHIMP_SEQUENCE_TEMPLATE).map((step) => (
                <div key={step.day} className="py-3">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-mono font-semibold text-[#0D4A36]">{step.day}</span>
                    <span className="text-[#6B7078]">
                      {subscriber ? step.status : 'Queued on Opt-In'}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-[#121417] mt-1">{step.subject}</p>
                  <p className="text-xs text-[#52565E] mt-0.5">{step.purpose}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Attributable Client Testimonials (Claim-to-Proof Adjacency) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-[#0D4A36]">Verified Client Outcomes</p>
                <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#121417]">
                  How Diaspora & Lagos Buyers Closed Safely
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {TESTIMONIALS.map((item) => (
                <article
                  key={item.id}
                  className="bg-white border border-[#E4DFD5] rounded-xl p-5 sm:p-6 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#52565E]">
                    <div>
                      <span className="font-semibold text-[#121417] text-sm">{item.name}</span>
                      <span className="mx-1.5" aria-hidden="true">·</span>
                      <span>{item.role}</span>
                    </div>
                    <span>{item.location}</span>
                  </div>
                  <p className="text-sm text-[#2A2E34] leading-relaxed">“{item.quote}”</p>
                  <div className="pt-2 border-t border-[#F0ECE4] grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <p className="text-[#52565E]">
                      <span className="font-semibold text-[#121417]">Before:</span> {item.beforeState}
                    </p>
                    <p className="text-[#0D4A36] font-medium">
                      <span className="font-semibold text-[#121417]">Outcome:</span> {item.outcome}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
