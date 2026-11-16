import { useState, FormEvent } from 'react';
import {
  ArrowRight,
  Check,
  Clock,
  Lock,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';
import {
  PROPERTIES,
  TESTIMONIALS,
  formatCurrency,
} from '../data/properties';
import type {
  District,
  LeadSubscriber,
  PaymentPlanType,
  PropertyListing,
  PropertyOrder,
} from '../types/funnel';
import { formatCountdown } from './CountdownBanner';
import { ResilientImage } from './ResilientImage';

interface SalesPageStageProps {
  remainingSeconds: number;
  subscriber: LeadSubscriber | null;
  selectedPropertyId: string;
  onSelectProperty: (id: string) => void;
  currency: 'NGN' | 'USD';
  onChangeCurrency: (curr: 'NGN' | 'USD') => void;
  onOrderComplete: (order: PropertyOrder) => void;
  onOpenWhatsApp: (topic?: string) => void;
}

const DISTRICTS: District[] = [
  'All',
  'Old Ikoyi',
  'Eko Atlantic',
  'Victoria Island',
  'Lekki Phase 1',
];

export function SalesPageStage({
  remainingSeconds,
  subscriber,
  selectedPropertyId,
  onSelectProperty,
  currency,
  onChangeCurrency,
  onOrderComplete,
  onOpenWhatsApp,
}: SalesPageStageProps) {
  const [districtFilter, setDistrictFilter] = useState<District>('All');
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlanType>('reservation');
  const [paymentMethod, setPaymentMethod] = useState('Instant Bank Transfer / Escrow (Paystack / NIP)');
  const [buyerName, setBuyerName] = useState(subscriber?.firstName || '');
  const [buyerEmail, setBuyerEmail] = useState(subscriber?.email || '');
  const [buyerWhatsapp, setBuyerWhatsapp] = useState(subscriber?.whatsapp || '');
  const [checkoutError, setCheckoutError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredProperties =
    districtFilter === 'All'
      ? PROPERTIES
      : PROPERTIES.filter((p) => p.district === districtFilter);

  const activeProperty: PropertyListing =
    PROPERTIES.find((p) => p.id === selectedPropertyId) || PROPERTIES[0];

  const { hh, mm, ss } = formatCountdown(remainingSeconds);

  function getDueNowAmounts(prop: PropertyListing, plan: PaymentPlanType) {
    if (plan === 'outright') {
      return {
        ngn: Math.round(prop.priceNGN * 0.95),
        usd: Math.round(prop.priceUSD * 0.95),
      };
    }
    if (plan === 'deposit30') {
      return {
        ngn: Math.round(prop.priceNGN * 0.3),
        usd: Math.round(prop.priceUSD * 0.3),
      };
    }
    return {
      ngn: prop.reservationFeeNGN,
      usd: prop.reservationFeeUSD,
    };
  }

  const dueNow = getDueNowAmounts(activeProperty, paymentPlan);
  const totalValueStackNGN = activeProperty.valueStack.reduce((sum, item) => sum + item.valueNGN, 0);

  async function handleCheckoutSubmit(e: FormEvent) {
    e.preventDefault();
    setCheckoutError('');

    if (buyerName.trim().length < 2) {
      setCheckoutError('Please enter the legal buyer name for your Allocation Receipt.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerEmail.trim())) {
      setCheckoutError('Please enter a valid email address to receive your legal dossier.');
      return;
    }
    if (buyerWhatsapp.trim().length < 7) {
      setCheckoutError('Please enter an active WhatsApp number for registry verification updates.');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: activeProperty.id,
          paymentPlan,
          currency,
          paymentMethod,
          buyerName: buyerName.trim(),
          buyerEmail: buyerEmail.trim(),
          buyerWhatsapp: buyerWhatsapp.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setCheckoutError(data.error || 'Could not process allocation reservation.');
        setIsProcessing(false);
        return;
      }
      onOrderComplete(data.order);
    } catch {
      setCheckoutError('Connection error while locking your allocation. Please retry.');
      setIsProcessing(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-20 space-y-12">
      {/* Sales Room Header & Filter Controls */}
      <section>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#E4DFD5]">
          <div>
            <p className="text-xs font-medium text-[#0D4A36] mb-1.5">
              Private Property Sales Room · Verified Lagos Island Inventory
            </p>
            <h1
              className="font-editorial font-semibold text-[#121417] leading-tight text-balance"
              style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)' }}
            >
              Select Your Residence & Lock Your 24-Hour Allocation
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Currency Segmented Control */}
            <div className="flex items-center gap-1 p-1 bg-[#EFECE6] rounded-lg" role="group" aria-label="Currency selector">
              <button
                type="button"
                onClick={() => onChangeCurrency('NGN')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  currency === 'NGN' ? 'bg-white text-[#121417] shadow-sm' : 'text-[#52565E] hover:text-[#121417]'
                }`}
              >
                NGN (₦)
              </button>
              <button
                type="button"
                onClick={() => onChangeCurrency('USD')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  currency === 'USD' ? 'bg-white text-[#121417] shadow-sm' : 'text-[#52565E] hover:text-[#121417]'
                }`}
              >
                USD ($)
              </button>
            </div>
          </div>
        </div>

        {/* District Filter Tabs */}
        <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-1">
          {DISTRICTS.map((district) => {
            const active = districtFilter === district;
            return (
              <button
                key={district}
                type="button"
                onClick={() => setDistrictFilter(district)}
                className={`px-3.5 py-2 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#121417] text-white border-[#121417]'
                    : 'bg-white text-[#4A4E56] border-[#E4DFD5] hover:border-[#121417]'
                }`}
              >
                {district}
              </button>
            );
          })}
        </div>

        {/* Property Cards Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProperties.map((prop) => {
            const isSelected = prop.id === activeProperty.id;
            return (
              <article
                key={prop.id}
                className={`bg-white rounded-xl overflow-hidden border transition-all flex flex-col ${
                  isSelected
                    ? 'border-[#0D4A36] ring-1 ring-[#0D4A36]'
                    : 'border-[#E4DFD5] hover:border-[#B8B2A6] hover:-translate-y-0.5'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    onSelectProperty(prop.id);
                    document.getElementById('instant-checkout-module')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="text-left flex-1 flex flex-col cursor-pointer focus-visible:outline-none"
                >
                  <div className="aspect-[4/3] w-full bg-[#EFECE6] overflow-hidden">
                    <ResilientImage
                      src={prop.image}
                      alt={prop.title}
                      className="w-full h-full object-cover"
                      fallbackTitle={prop.title}
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <p className="text-xs text-[#6B7078] truncate">
                        {prop.district} · {prop.bedrooms} Bed · {prop.areaSqm} sqm
                      </p>
                      <h2 className="text-base font-semibold text-[#121417] mt-1 leading-snug">
                        {prop.title}
                      </h2>
                      <p className="text-xs text-[#0D4A36] font-medium mt-1">
                        {prop.annualYield}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-[#F0ECE4] flex items-baseline justify-between gap-2">
                      <span className="font-mono tabular-nums text-base font-semibold text-[#121417]">
                        {formatCurrency(prop.priceNGN, prop.priceUSD, currency)}
                      </span>
                      <span className="text-xs font-medium text-[#8C5B12] whitespace-nowrap">
                        {prop.unitsRemaining} of {prop.unitsTotal} Left
                      </span>
                    </div>
                  </div>
                </button>
              </article>
            );
          })}
        </div>
      </section>

      {/* CONTIGUOUS PURCHASE & INSTANT PAYMENT MODULE (PDP + CHECKOUT) */}
      <section id="instant-checkout-module" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
        {/* Left: Selected Property Details, Value Stack & Risk Reversal */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-[#E4DFD5] rounded-xl overflow-hidden">
            <div className="aspect-[16/10] w-full bg-[#EFECE6]">
              <ResilientImage
                src={activeProperty.image}
                alt={activeProperty.title}
                className="w-full h-full object-cover"
                fallbackTitle={activeProperty.title}
              />
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#52565E] mb-2">
                  <span className="font-semibold text-[#0D4A36]">{activeProperty.district}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeProperty.address}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{activeProperty.registryCode}</span>
                </div>
                <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#121417]">
                  {activeProperty.title}
                </h2>
                <p className="text-sm sm:text-base text-[#4A4E56] leading-relaxed mt-3">
                  {activeProperty.summary}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-[#EAE5DC]">
                <div>
                  <p className="text-xs text-[#6B7078]">Full Valuation</p>
                  <p className="font-mono tabular-nums text-base font-semibold text-[#121417] mt-0.5">
                    {formatCurrency(activeProperty.priceNGN, activeProperty.priceUSD, currency)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7078]">Rental Yield</p>
                  <p className="text-sm font-semibold text-[#0D4A36] mt-0.5">
                    {activeProperty.annualYield}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7078]">Title Document</p>
                  <p className="text-sm font-semibold text-[#121417] mt-0.5">
                    {activeProperty.titleDocument.split('&')[0].trim()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7078]">Availability</p>
                  <p className="text-sm font-semibold text-[#8C5B12] mt-0.5">
                    {activeProperty.unitsRemaining} Unit{activeProperty.unitsRemaining > 1 ? 's' : ''} Remaining
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#121417] mb-3">
                  Architectural & Title Specifications
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-[#3B3F46]">
                  {activeProperty.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#0D4A36] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dan Lok Value Stack Included Within 24-Hour Window */}
              <div className="bg-[#FAF9F6] border border-[#E4DFD5] rounded-lg p-5 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-[#121417]">
                    Included Free When Reserved Within 24 Hours
                  </h3>
                  <span className="font-mono tabular-nums text-xs font-semibold text-[#0D4A36]">
                    Total Bonus: ₦{new Intl.NumberFormat('en-NG').format(totalValueStackNGN)}
                  </span>
                </div>
                <div className="divide-y divide-[#EAE5DC]">
                  {activeProperty.valueStack.map((bonus) => (
                    <div key={bonus.item} className="py-2.5 flex items-center justify-between gap-4 text-xs sm:text-sm">
                      <span className="text-[#2A2E34]">{bonus.item}</span>
                      <span className="font-mono tabular-nums text-[#52565E] shrink-0">
                        ₦{new Intl.NumberFormat('en-NG').format(bonus.valueNGN)} Value
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Reversal Guarantee */}
              <div className="flex items-start gap-3 text-xs sm:text-sm text-[#3B3F46]">
                <ShieldCheck className="w-5 h-5 text-[#0D4A36] shrink-0 mt-0.5" />
                <p>
                  <span className="font-semibold text-[#121417]">100% Title & Escrow Risk-Reversal Guarantee:</span>{' '}
                  All allocation deposits are held in a verified solicitor escrow account until your
                  independent lawyer confirms our Alausa Land Registry search ({activeProperty.registryCode}).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contiguous Instant Payment & Reservation Checkout */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 bg-white border border-[#E4DFD5] rounded-xl p-6 sm:p-7 space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-[#EAE5DC]">
            <div>
              <p className="text-xs font-medium text-[#0D4A36]">Instant Allocation Checkout</p>
              <h3 className="font-editorial text-2xl font-semibold text-[#121417] mt-0.5">
                Lock {activeProperty.district} Unit Now
              </h3>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-[#6B7078] flex items-center justify-end gap-1">
                <Clock className="w-3 h-3 text-[#8C5B12]" />
                <span>Bonus Expires</span>
              </p>
              <p className="font-mono tabular-nums text-sm font-semibold text-[#8C5B12]">
                {hh}:{mm}:{ss}
              </p>
            </div>
          </div>

          <form onSubmit={handleCheckoutSubmit} className="space-y-4">
            {/* Payment Plan Selector */}
            <div className="space-y-2">
              <span className="block text-xs font-semibold text-[#121417]">
                1. Choose Payment Structure
              </span>

              <label
                className={`block border rounded-lg p-3.5 cursor-pointer transition-colors ${
                  paymentPlan === 'reservation'
                    ? 'border-[#0D4A36] bg-[#F0F7F4]'
                    : 'border-[#E4DFD5] hover:border-[#B8B2A6]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="paymentPlan"
                      checked={paymentPlan === 'reservation'}
                      onChange={() => setPaymentPlan('reservation')}
                      className="accent-[#0D4A36]"
                    />
                    <span className="text-sm font-semibold text-[#121417]">
                      Escrow Lock-In Reservation
                    </span>
                  </div>
                  <span className="font-mono tabular-nums text-sm font-semibold text-[#0D4A36]">
                    {formatCurrency(activeProperty.reservationFeeNGN, activeProperty.reservationFeeUSD, currency)}
                  </span>
                </div>
                <p className="text-xs text-[#52565E] mt-1 pl-6">
                  Takes the unit off market for 14 days while your lawyer verifies the Alausa Registry file.
                </p>
              </label>

              <label
                className={`block border rounded-lg p-3.5 cursor-pointer transition-colors ${
                  paymentPlan === 'deposit30'
                    ? 'border-[#0D4A36] bg-[#F0F7F4]'
                    : 'border-[#E4DFD5] hover:border-[#B8B2A6]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="paymentPlan"
                      checked={paymentPlan === 'deposit30'}
                      onChange={() => setPaymentPlan('deposit30')}
                      className="accent-[#0D4A36]"
                    />
                    <span className="text-sm font-semibold text-[#121417]">
                      30% Initial Allocation Deposit
                    </span>
                  </div>
                  <span className="font-mono tabular-nums text-sm font-semibold text-[#121417]">
                    {formatCurrency(
                      Math.round(activeProperty.priceNGN * 0.3),
                      Math.round(activeProperty.priceUSD * 0.3),
                      currency
                    )}
                  </span>
                </div>
                <p className="text-xs text-[#52565E] mt-1 pl-6">
                  Locks today’s valuation with 70% spread over 12-month milestone installments.
                </p>
              </label>

              <label
                className={`block border rounded-lg p-3.5 cursor-pointer transition-colors ${
                  paymentPlan === 'outright'
                    ? 'border-[#0D4A36] bg-[#F0F7F4]'
                    : 'border-[#E4DFD5] hover:border-[#B8B2A6]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="paymentPlan"
                      checked={paymentPlan === 'outright'}
                      onChange={() => setPaymentPlan('outright')}
                      className="accent-[#0D4A36]"
                    />
                    <span className="text-sm font-semibold text-[#121417]">
                      Outright Purchase (5% Instant Rebate)
                    </span>
                  </div>
                  <span className="font-mono tabular-nums text-sm font-semibold text-[#121417]">
                    {formatCurrency(
                      Math.round(activeProperty.priceNGN * 0.95),
                      Math.round(activeProperty.priceUSD * 0.95),
                      currency
                    )}
                  </span>
                </div>
                <p className="text-xs text-[#52565E] mt-1 pl-6">
                  Immediate Deed of Assignment execution and priority corporate tenant placement.
                </p>
              </label>
            </div>

            {/* Buyer Legal Details */}
            <div className="space-y-3 pt-2 border-t border-[#EAE5DC]">
              <span className="block text-xs font-semibold text-[#121417]">
                2. Buyer & Title Deed Details
              </span>
              <input
                type="text"
                required
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="Full Legal Name (for Deed of Assignment)"
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#D8D2C5] rounded-md text-[#121417] focus:outline-none focus:border-[#0D4A36]"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="email"
                  required
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  placeholder="Email for Receipt & Title PDF"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#D8D2C5] rounded-md text-[#121417] focus:outline-none focus:border-[#0D4A36]"
                />
                <input
                  type="tel"
                  required
                  value={buyerWhatsapp}
                  onChange={(e) => setBuyerWhatsapp(e.target.value)}
                  placeholder="WhatsApp (+234 / +44 / +1)"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#D8D2C5] rounded-md text-[#121417] focus:outline-none focus:border-[#0D4A36]"
                />
              </div>

              <div>
                <label htmlFor="payment-method-select" className="block text-xs font-medium text-[#52565E] mb-1">
                  Settlement Channel
                </label>
                <select
                  id="payment-method-select"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#D8D2C5] rounded-md text-[#121417] focus:outline-none focus:border-[#0D4A36]"
                >
                  <option>Instant Bank Transfer / Escrow (Paystack / NIP)</option>
                  <option>Diaspora USD Domiciliary Wire (SWIFT / ACH)</option>
                  <option>Visa / Mastercard Corporate Settlement</option>
                </select>
              </div>
            </div>

            {checkoutError && (
              <p className="text-xs font-medium text-[#991B1B] bg-[#FEF2F2] border border-[#FECACA] rounded-md px-3 py-2" role="alert">
                {checkoutError}
              </p>
            )}

            {/* Total Due Now & Primary Pay CTA */}
            <div className="bg-[#F5F2EC] rounded-lg p-4 flex items-center justify-between">
              <span className="text-xs font-medium text-[#52565E]">Total Due Now</span>
              <span className="font-mono tabular-nums text-xl font-semibold text-[#121417]">
                {formatCurrency(dueNow.ngn, dueNow.usd, currency)}
              </span>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#0D4A36] hover:bg-[#093627] disabled:opacity-60 text-white text-sm font-semibold rounded-md transition-colors cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>
                {isProcessing
                  ? 'Confirming Escrow Allocation...'
                  : `Complete Instant Payment (${formatCurrency(dueNow.ngn, dueNow.usd, currency)})`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() =>
                onOpenWhatsApp(`${activeProperty.title} (${activeProperty.registryCode}) Title Verification`)
              }
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#D8D2C5] hover:border-[#0D4A36] text-[#121417] text-xs font-semibold rounded-md transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-[#0D4A36]" />
              <span>Verify Title Documents on WhatsApp Before Paying</span>
            </button>
          </form>
        </div>
      </section>

      {/* Adjacent Proof Strip on Sales Page */}
      <section className="pt-4 border-t border-[#E4DFD5]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="bg-white border border-[#E4DFD5] rounded-xl p-5 space-y-2">
              <p className="text-xs font-semibold text-[#0D4A36]">{t.propertyAcquired}</p>
              <p className="text-sm text-[#2A2E34] leading-relaxed">“{t.quote}”</p>
              <p className="text-xs text-[#52565E] pt-1">
                <span className="font-semibold text-[#121417]">{t.name}</span> · {t.location}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
