import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Mail,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { RELATED_UPSELLS, formatCurrency } from '../data/properties';
import type { PropertyOrder, UpsellOffer } from '../types/funnel';
import { formatCountdown } from './CountdownBanner';
import { ResilientImage } from './ResilientImage';

interface ThankYouUpsellStageProps {
  order: PropertyOrder | null;
  remainingSeconds: number;
  currency: 'NGN' | 'USD';
  onOrderUpdated: (updated: PropertyOrder) => void;
  onProceedToDelivery: () => void;
  onGoToSales: () => void;
}

export function ThankYouUpsellStage({
  order,
  remainingSeconds,
  currency,
  onOrderUpdated,
  onProceedToDelivery,
  onGoToSales,
}: ThankYouUpsellStageProps) {
  const [addingId, setAddingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const { hh, mm, ss } = formatCountdown(remainingSeconds);

  async function handleAddUpsell(upsell: UpsellOffer) {
    if (!order) return;
    setErrorMsg('');
    setAddingId(upsell.id);
    try {
      const response = await fetch(`/api/orders/${order.orderId}/upsell`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upsellId: upsell.id }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorMsg(data.error || 'Unable to attach portfolio addition.');
        setAddingId(null);
        return;
      }
      onOrderUpdated(data.order);
    } catch {
      setErrorMsg('Network error attaching portfolio offer.');
    } finally {
      setAddingId(null);
    }
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-white border border-[#E4DFD5] rounded-xl p-8 text-center space-y-4">
          <p className="text-xs font-medium text-[#0D4A36]">Portfolio Upsell Stage</p>
          <h1 className="font-editorial text-3xl font-semibold text-[#121417]">
            Complete a Property Reservation to Unlock Portfolio Bundle Pricing
          </h1>
          <p className="text-sm text-[#52565E] max-w-xl mx-auto">
            Select an Old Ikoyi, Eko Atlantic, Victoria Island, or Lekki Phase 1 residence in our
            Sales Room first to generate your Allocation ID and access related post-purchase offers.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onGoToSales}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0D4A36] hover:bg-[#093627] text-white text-sm font-semibold rounded-md transition-colors cursor-pointer"
            >
              <span>Browse Available Properties</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-20 space-y-10">
      {/* Confirmed Allocation Banner */}
      <section className="bg-white border border-[#BFE0D1] rounded-xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#0D4A36]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Allocation Confirmed · Order #{order.orderId}</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#121417]">
              Thank You, {order.buyerName}. Your Lagos Allocation Is Locked.
            </h1>
            <p className="text-sm text-[#4A4E56] max-w-2xl">
              Your escrow receipt for <span className="font-semibold text-[#121417]">{order.propertyTitle}</span>{' '}
              ({order.registryCode}) has been logged, and your Mailchimp buyer onboarding dossier has
              been dispatched to <span className="font-medium text-[#121417]">{order.buyerEmail}</span>.
            </p>
          </div>

          <div className="bg-[#FAF9F6] border border-[#E4DFD5] rounded-lg p-4 min-w-[260px] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#52565E]">
              <span>Escrow Settled</span>
              <span className="font-mono tabular-nums font-semibold text-[#121417] text-sm">
                {formatCurrency(order.amountPaidNGN, order.amountPaidUSD, currency)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#52565E]">
              <span>Mailchimp Onboarding</span>
              <span className="inline-flex items-center gap-1 font-medium text-[#0D4A36]">
                <Mail className="w-3.5 h-3.5" /> Active
              </span>
            </div>
            <button
              type="button"
              onClick={onProceedToDelivery}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#121417] hover:bg-[#2A2E34] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
            >
              <span>Skip to Property Delivery Tracker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Related Properties One-Time Pitch (OTO) */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E4DFD5] pb-4">
          <div>
            <p className="text-xs font-medium text-[#8C5B12] mb-1">
              One-Time Portfolio Expansion Offer · Valid Only Before Leaving Confirmation
            </p>
            <h2 className="font-editorial text-3xl font-semibold text-[#121417]">
              Pair Your Acquisition With High-Yield Related Assets
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#52565E] shrink-0">
            <Clock className="w-3.5 h-3.5 text-[#8C5B12]" />
            <span>Bundle Pricing Closes:</span>
            <span className="font-mono tabular-nums font-semibold text-[#121417]">
              {hh}:{mm}:{ss}
            </span>
          </div>
        </div>

        {errorMsg && (
          <p className="text-xs font-medium text-[#991B1B] bg-[#FEF2F2] border border-[#FECACA] rounded-md px-3 py-2" role="alert">
            {errorMsg}
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {RELATED_UPSELLS.map((upsell) => {
            const isAdded = order.upsells.some((u) => u.id === upsell.id);
            return (
              <article
                key={upsell.id}
                className={`bg-white border rounded-xl overflow-hidden flex flex-col ${
                  isAdded ? 'border-[#0D4A36] ring-1 ring-[#0D4A36]' : 'border-[#E4DFD5]'
                }`}
              >
                <div className="aspect-[16/9] w-full bg-[#EFECE6]">
                  <ResilientImage
                    src={upsell.image}
                    alt={upsell.title}
                    className="w-full h-full object-cover"
                    fallbackTitle={upsell.title}
                  />
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#52565E]">
                      <span className="font-medium text-[#0D4A36]">{upsell.category}</span>
                      <span>Save {upsell.savingsPercent}% Bundle Rebate</span>
                    </div>
                    <h3 className="font-editorial text-2xl font-semibold text-[#121417]">
                      {upsell.title}
                    </h3>
                    <p className="text-sm text-[#4A4E56] leading-relaxed">{upsell.description}</p>

                    <ul className="space-y-1.5 text-xs text-[#3B3F46] pt-1">
                      {upsell.deliverables.map((d) => (
                        <li key={d} className="flex items-start gap-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#0D4A36] shrink-0 mt-0.5" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-[#EAE5DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-[#6B7078] line-through font-mono tabular-nums">
                        Standard: {formatCurrency(upsell.regularPriceNGN, upsell.regularPriceUSD, currency)}
                      </p>
                      <p className="font-mono tabular-nums text-xl font-semibold text-[#121417]">
                        {formatCurrency(upsell.otoPriceNGN, upsell.otoPriceUSD, currency)}
                      </p>
                    </div>

                    {isAdded ? (
                      <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F0F7F4] border border-[#BFE0D1] text-[#0D4A36] text-xs font-semibold rounded-md">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Added to Order #{order.orderId}</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={addingId === upsell.id}
                        onClick={() => handleAddUpsell(upsell)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0D4A36] hover:bg-[#093627] disabled:opacity-60 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <Plus className="w-4 h-4" />
                        <span>
                          {addingId === upsell.id ? 'Attaching to Order...' : 'Add to My Allocation'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#F5F2EC] border border-[#E4DFD5] rounded-xl p-6">
          <div>
            <p className="text-sm font-semibold text-[#121417]">
              Ready to Track Your Property & Connect With Your Assigned Engineer?
            </p>
            <p className="text-xs text-[#52565E] mt-0.5">
              Access live Alausa Land Registry verification status, WhatsApp realtor/developer channels, and inspection booking.
            </p>
          </div>
          <button
            type="button"
            onClick={onProceedToDelivery}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0D4A36] hover:bg-[#093627] text-white text-sm font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>Open Property Delivery Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
