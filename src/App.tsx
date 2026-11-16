import { useEffect, useState } from 'react';
import { CountdownBanner } from './components/CountdownBanner';
import { DeliveryTrackingStage } from './components/DeliveryTrackingStage';
import { Header } from './components/Header';
import { SalesPageStage } from './components/SalesPageStage';
import { SqueezeWebinarStage } from './components/SqueezeWebinarStage';
import { ThankYouUpsellStage } from './components/ThankYouUpsellStage';
import { WhatsAppDrawer } from './components/WhatsAppDrawer';
import { PROPERTIES } from './data/properties';
import type { FunnelStage, LeadSubscriber, PropertyOrder } from './types/funnel';

const INITIAL_24H_SECONDS = 23 * 3600 + 54 * 60 + 18;

export default function App() {
  const [activeStage, setActiveStage] = useState<FunnelStage>('squeeze');
  const [remainingSeconds, setRemainingSeconds] = useState<number>(INITIAL_24H_SECONDS);
  const [subscriber, setSubscriber] = useState<LeadSubscriber | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(PROPERTIES[0].id);
  const [currency, setCurrency] = useState<'NGN' | 'USD'>('NGN');
  const [order, setOrder] = useState<PropertyOrder | null>(null);
  const [whatsAppOpen, setWhatsAppOpen] = useState(false);
  const [whatsAppTopic, setWhatsAppTopic] = useState<string | undefined>(undefined);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : INITIAL_24H_SECONDS));
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const totalRemainingUnits = PROPERTIES.reduce((sum, p) => sum + p.unitsRemaining, 0);

  function handleSelectStage(stage: FunnelStage) {
    setActiveStage(stage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleOpenWhatsApp(topic?: string) {
    setWhatsAppTopic(topic);
    setWhatsAppOpen(true);
  }

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#121417]">
      <CountdownBanner
        remainingSeconds={remainingSeconds}
        remainingUnitsTotal={totalRemainingUnits}
      />

      <Header
        activeStage={activeStage}
        onSelectStage={handleSelectStage}
        onOpenWhatsApp={() => handleOpenWhatsApp('Lagos Prime Property Inquiry')}
      />

      <main className="flex-1">
        {activeStage === 'squeeze' && (
          <SqueezeWebinarStage
            remainingSeconds={remainingSeconds}
            subscriber={subscriber}
            onSubscribed={(sub) => setSubscriber(sub)}
            onProceedToSales={() => handleSelectStage('sales')}
            onOpenWhatsApp={handleOpenWhatsApp}
          />
        )}

        {activeStage === 'sales' && (
          <SalesPageStage
            remainingSeconds={remainingSeconds}
            subscriber={subscriber}
            selectedPropertyId={selectedPropertyId}
            onSelectProperty={setSelectedPropertyId}
            currency={currency}
            onChangeCurrency={setCurrency}
            onOrderComplete={(newOrder) => {
              setOrder(newOrder);
              handleSelectStage('thankyou');
            }}
            onOpenWhatsApp={handleOpenWhatsApp}
          />
        )}

        {activeStage === 'thankyou' && (
          <ThankYouUpsellStage
            order={order}
            remainingSeconds={remainingSeconds}
            currency={currency}
            onOrderUpdated={setOrder}
            onProceedToDelivery={() => handleSelectStage('delivery')}
            onGoToSales={() => handleSelectStage('sales')}
          />
        )}

        {activeStage === 'delivery' && (
          <DeliveryTrackingStage
            order={order}
            currency={currency}
            onOrderUpdated={setOrder}
            onOpenWhatsApp={handleOpenWhatsApp}
            onGoToSales={() => handleSelectStage('sales')}
          />
        )}
      </main>

      <footer className="border-t border-[#E4DFD5] bg-[#F5F2EC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#52565E]">
          <div>
            <p className="font-semibold text-[#121417]">Eko Crest Realty & Development Ltd.</p>
            <p className="mt-0.5">
              14B Bourdillon Road, Old Ikoyi · Adeola Odeku, Victoria Island, Lagos
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() => handleSelectStage('squeeze')}
              className="hover:text-[#121417] cursor-pointer"
            >
              Briefing & Replay
            </button>
            <button
              type="button"
              onClick={() => handleSelectStage('sales')}
              className="hover:text-[#121417] cursor-pointer"
            >
              Properties
            </button>
            <button
              type="button"
              onClick={() => handleOpenWhatsApp('Legal & Escrow Verification')}
              className="hover:text-[#121417] cursor-pointer"
            >
              WhatsApp Verification Desk
            </button>
          </div>
        </div>
      </footer>

      <WhatsAppDrawer
        isOpen={whatsAppOpen}
        onClose={() => setWhatsAppOpen(false)}
        contextLabel={whatsAppTopic}
        visitorName={order?.buyerName || subscriber?.firstName}
      />
    </div>
  );
}
