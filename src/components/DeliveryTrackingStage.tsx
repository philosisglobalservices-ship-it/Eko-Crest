import { useState, FormEvent } from 'react';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  HardHat,
  MessageCircle,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { formatCurrency } from '../data/properties';
import type { PropertyOrder } from '../types/funnel';

interface DeliveryTrackingStageProps {
  order: PropertyOrder | null;
  currency: 'NGN' | 'USD';
  onOrderUpdated: (updated: PropertyOrder) => void;
  onOpenWhatsApp: (topic?: string) => void;
  onGoToSales: () => void;
}

export function DeliveryTrackingStage({
  order,
  currency,
  onOrderUpdated,
  onOpenWhatsApp,
  onGoToSales,
}: DeliveryTrackingStageProps) {
  const [inspectionDate, setInspectionDate] = useState('2026-11-18');
  const [inspectionType, setInspectionType] = useState<'Physical Lagos Tour' | 'Live WhatsApp Video Tour'>(
    'Live WhatsApp Video Tour'
  );
  const [isSavingTour, setIsSavingTour] = useState(false);
  const [tourSavedNotice, setTourSavedNotice] = useState(false);

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-white border border-[#E4DFD5] rounded-xl p-8 text-center space-y-4">
          <p className="text-xs font-medium text-[#0D4A36]">Property Delivery & Tracking Portal</p>
          <h1 className="font-editorial text-3xl font-semibold text-[#121417]">
            No Active Allocation Order Found Yet
          </h1>
          <p className="text-sm text-[#52565E] max-w-xl mx-auto">
            Once you complete your escrow reservation or outright purchase on the Properties page,
            your live title charting milestones and direct WhatsApp links to your realtor and site
            developer appear here.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onGoToSales}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0D4A36] hover:bg-[#093627] text-white text-sm font-semibold rounded-md transition-colors cursor-pointer"
            >
              <span>Select a Lagos Property</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const realtorWaUrl = `https://wa.me/${order.realtorPhone}?text=${encodeURIComponent(
    `Hello ${order.realtorName}, my Allocation Order is #${order.orderId} for ${order.propertyTitle} (${order.registryCode}). Please share my latest Alausa Land Registry status.`
  )}`;

  const developerWaUrl = `https://wa.me/${order.developerPhone}?text=${encodeURIComponent(
    `Hello ${order.developerName} Site Team, I am the allocated owner under Order #${order.orderId} (${order.propertyTitle}). I would like to coordinate inspection and engineering milestones.`
  )}`;

  async function handleBookInspection(e: FormEvent) {
    e.preventDefault();
    if (!order) return;
    setIsSavingTour(true);
    setTourSavedNotice(false);
    try {
      const response = await fetch(`/api/orders/${order.orderId}/inspection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inspectionDate, inspectionType }),
      });
      if (response.ok) {
        const data = await response.json();
        onOrderUpdated(data.order);
        setTourSavedNotice(true);
      }
    } finally {
      setIsSavingTour(false);
    }
  }

  function handleDownloadDossier() {
    if (!order) return;
    const summaryText = [
      'EKO CREST REALTY — OFFICIAL PROPERTY ALLOCATION DOSSIER',
      '======================================================',
      `Order Reference: ${order.orderId}`,
      `Buyer Legal Name: ${order.buyerName}`,
      `Buyer Email: ${order.buyerEmail}`,
      `Buyer WhatsApp: ${order.buyerWhatsapp}`,
      '',
      `Property: ${order.propertyTitle}`,
      `District: ${order.district}, Lagos`,
      `Title Document: ${order.titleDocument}`,
      `Registry File Code: ${order.registryCode}`,
      `Payment Plan: ${order.paymentPlan.toUpperCase()}`,
      `Amount Settled: ${formatCurrency(order.amountPaidNGN, order.amountPaidUSD, order.currency)}`,
      `Settlement Method: ${order.paymentMethod}`,
      '',
      'Portfolio Add-Ons:',
      order.upsells.length > 0
        ? order.upsells.map((u) => `- ${u.title} (${formatCurrency(u.otoPriceNGN, u.otoPriceUSD, order.currency)})`).join('\n')
        : '- None attached',
      '',
      'Assigned Contacts:',
      `Lead Realtor: ${order.realtorName} (WhatsApp: +${order.realtorPhone})`,
      `Developer: ${order.developerName} (WhatsApp: +${order.developerPhone})`,
      '',
      'Delivery Milestones:',
      ...order.milestones.map((m) => `${m.step}. [${m.status.toUpperCase()}] ${m.title} — ${m.timestamp || ''}`),
    ].join('\n');

    const blob = new Blob([summaryText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${order.orderId}-Allocation-Dossier.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-20 space-y-10">
      {/* Header Summary */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#E4DFD5]">
        <div>
          <p className="text-xs font-medium text-[#0D4A36] mb-1.5">
            Property Delivery & Title Tracking Portal · Order #{order.orderId}
          </p>
          <h1
            className="font-editorial font-semibold text-[#121417] leading-tight"
            style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)' }}
          >
            {order.propertyTitle}
          </h1>
          <p className="text-sm text-[#52565E] mt-1">
            {order.district}, Lagos · Title File {order.registryCode} · Owner: {order.buyerName}
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadDossier}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#D8D2C5] hover:border-[#121417] text-[#121417] text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <Download className="w-4 h-4 text-[#0D4A36]" />
          <span>Download Official Allocation Dossier</span>
        </button>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: 4-Stage Milestone Tracker + Receipt Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-[#E4DFD5] rounded-xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#121417]">
                Live Title & Handover Milestones
              </h2>
              <span className="text-xs font-medium text-[#0D4A36]">Updated Real-Time</span>
            </div>

            <div className="divide-y divide-[#EAE5DC]">
              {order.milestones.map((m) => (
                <div key={m.step} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
                  <div className="mt-0.5 shrink-0">
                    {m.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-[#0D4A36]" />
                    ) : m.status === 'in_progress' ? (
                      <Clock className="w-5 h-5 text-[#8C5B12]" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-[#D4CFC4] flex items-center justify-center text-[10px] font-mono text-[#6B7078]">
                        {m.step}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-[#121417]">
                        0{m.step}. {m.title}
                      </p>
                      <span className="text-xs font-mono text-[#52565E]">{m.timestamp}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#4A4E56] mt-1 leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Itemized Financial & Portfolio Summary */}
          <div className="bg-white border border-[#E4DFD5] rounded-xl p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-semibold text-[#121417]">Allocation Financial Ledger</h2>
            <div className="divide-y divide-[#EAE5DC] text-sm">
              <div className="py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-[#121417]">{order.propertyTitle}</p>
                  <p className="text-xs text-[#52565E]">
                    Plan: {order.paymentPlan === 'outright' ? 'Outright (5% Rebate)' : order.paymentPlan === 'deposit30' ? '30% Allocation Deposit' : 'Escrow Reservation'}
                  </p>
                </div>
                <span className="font-mono tabular-nums font-semibold text-[#121417]">
                  {formatCurrency(
                    order.amountPaidNGN -
                      order.upsells.reduce((acc, u) => acc + u.otoPriceNGN, 0),
                    order.amountPaidUSD -
                      order.upsells.reduce((acc, u) => acc + u.otoPriceUSD, 0),
                    currency
                  )}
                </span>
              </div>

              {order.upsells.map((u) => (
                <div key={u.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-[#121417]">{u.title}</p>
                    <p className="text-xs text-[#0D4A36]">Portfolio Bundle Addition ({u.savingsPercent}% Saved)</p>
                  </div>
                  <span className="font-mono tabular-nums font-semibold text-[#121417]">
                    {formatCurrency(u.otoPriceNGN, u.otoPriceUSD, currency)}
                  </span>
                </div>
              ))}

              <div className="pt-4 flex items-center justify-between gap-4">
                <span className="font-semibold text-[#121417]">Total Settled in Escrow</span>
                <span className="font-mono tabular-nums text-xl font-semibold text-[#0D4A36]">
                  {formatCurrency(order.amountPaidNGN, order.amountPaidUSD, currency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Direct Agent & Developer WhatsApp Desk + Site Tour Booking */}
        <div className="lg:col-span-5 space-y-6">
          {/* Direct WhatsApp to Realtor & Developer */}
          <div className="bg-[#121417] text-white rounded-xl p-6 space-y-5">
            <div className="flex items-center gap-2 text-xs text-[#E8C57B] font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Direct WhatsApp Access · Zero Middlemen</span>
            </div>
            <h2 className="font-editorial text-2xl font-semibold">
              Reach Your Realtor or Site Developer Instantly on WhatsApp
            </h2>

            <div className="space-y-3">
              {/* Assigned Lead Realtor */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <UserCheck className="w-5 h-5 text-[#E8C57B] shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">{order.realtorName}</p>
                    <p className="text-xs text-[#B8B4AC]">Assigned Lead Realtor · Title & Escrow Desk</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={realtorWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#0D4A36] hover:bg-[#13664B] text-white text-xs font-semibold rounded-md transition-colors whitespace-nowrap"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Realtor</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    type="button"
                    onClick={() => onOpenWhatsApp(`Order #${order.orderId} Realtor Desk`)}
                    className="px-3 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Live Chat Here
                  </button>
                </div>
              </div>

              {/* Project Developer / Site Engineer */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <HardHat className="w-5 h-5 text-[#E8C57B] shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">{order.developerName}</p>
                    <p className="text-xs text-[#B8B4AC]">Lead Project Developer · Construction & Handover</p>
                  </div>
                </div>
                <a
                  href={developerWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-white text-[#121417] hover:bg-[#F2EFE9] text-xs font-semibold rounded-md transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#0D4A36]" />
                  <span>Message Project Developer on WhatsApp</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Site Inspection / Live Video Walkthrough Scheduler */}
          <form onSubmit={handleBookInspection} className="bg-white border border-[#E4DFD5] rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0D4A36]" />
              <h3 className="text-base font-semibold text-[#121417]">
                Schedule Physical or Live Video Inspection
              </h3>
            </div>
            <p className="text-xs text-[#52565E] leading-relaxed">
              Choose whether you or your Lagos representative will visit in person, or connect via
              live WhatsApp video from anywhere in the world.
            </p>

            <div className="space-y-3">
              <div>
                <label htmlFor="tour-type" className="block text-xs font-medium text-[#3B3F46] mb-1">
                  Inspection Format
                </label>
                <select
                  id="tour-type"
                  value={inspectionType}
                  onChange={(e) =>
                    setInspectionType(
                      e.target.value as 'Physical Lagos Tour' | 'Live WhatsApp Video Tour'
                    )
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#D8D2C5] rounded-md text-[#121417] focus:outline-none focus:border-[#0D4A36]"
                >
                  <option value="Live WhatsApp Video Tour">Live WhatsApp Video Tour (Diaspora)</option>
                  <option value="Physical Lagos Tour">Physical Site Walkthrough (Lagos)</option>
                </select>
              </div>

              <div>
                <label htmlFor="tour-date" className="block text-xs font-medium text-[#3B3F46] mb-1">
                  Preferred Date
                </label>
                <input
                  id="tour-date"
                  type="date"
                  value={inspectionDate}
                  onChange={(e) => setInspectionDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#D8D2C5] rounded-md text-[#121417] focus:outline-none focus:border-[#0D4A36]"
                />
              </div>
            </div>

            {tourSavedNotice && (
              <p className="text-xs font-medium text-[#0D4A36] bg-[#F0F7F4] border border-[#BFE0D1] rounded-md px-3 py-2">
                Confirmed: {inspectionType} scheduled for {inspectionDate}. Calendar & WhatsApp link sent.
              </p>
            )}

            <button
              type="submit"
              disabled={isSavingTour}
              className="w-full px-4 py-2.5 bg-[#0D4A36] hover:bg-[#093627] disabled:opacity-60 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
            >
              {isSavingTour ? 'Locking Inspection Slot...' : 'Confirm Inspection Slot'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
