export type FunnelStage = 'squeeze' | 'sales' | 'thankyou' | 'delivery';

export type District = 'All' | 'Old Ikoyi' | 'Eko Atlantic' | 'Victoria Island' | 'Lekki Phase 1';

export type PaymentPlanType = 'outright' | 'deposit30' | 'reservation';

export interface PropertyListing {
  id: string;
  slug: string;
  title: string;
  district: Exclude<District, 'All'>;
  address: string;
  priceNGN: number;
  priceUSD: number;
  reservationFeeNGN: number;
  reservationFeeUSD: number;
  titleDocument: string;
  registryCode: string;
  annualYield: string;
  projectedAppreciation: string;
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  unitsTotal: number;
  unitsRemaining: number;
  completionStatus: string;
  developer: string;
  realtorName: string;
  realtorPhone: string;
  developerPhone: string;
  image: string;
  summary: string;
  highlights: string[];
  valueStack: {
    item: string;
    valueNGN: number;
  }[];
}

export interface UpsellOffer {
  id: string;
  title: string;
  district: string;
  category: string;
  regularPriceNGN: number;
  otoPriceNGN: number;
  regularPriceUSD: number;
  otoPriceUSD: number;
  savingsPercent: number;
  description: string;
  image: string;
  deliverables: string[];
}

export interface MailchimpEmailStep {
  day: string;
  subject: string;
  purpose: string;
  preview: string;
  status: 'Dispatched' | 'Scheduled';
}

export interface LeadSubscriber {
  id: string;
  firstName: string;
  email: string;
  whatsapp: string;
  buyerProfile: string;
  subscribedAt: string;
  mailchimpSynced: boolean;
  mailchimpMode: 'live_api' | 'local_sequence_queued';
  tags: string[];
  sequence: MailchimpEmailStep[];
}

export interface OrderMilestone {
  step: number;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  timestamp?: string;
}

export interface PropertyOrder {
  orderId: string;
  propertyId: string;
  propertyTitle: string;
  district: string;
  titleDocument: string;
  registryCode: string;
  paymentPlan: PaymentPlanType;
  amountPaidNGN: number;
  amountPaidUSD: number;
  totalPropertyPriceNGN: number;
  totalPropertyPriceUSD: number;
  currency: 'NGN' | 'USD';
  paymentMethod: string;
  buyerName: string;
  buyerEmail: string;
  buyerWhatsapp: string;
  realtorName: string;
  realtorPhone: string;
  developerName: string;
  developerPhone: string;
  createdAt: string;
  upsells: UpsellOffer[];
  milestones: OrderMilestone[];
  inspectionDate?: string;
  inspectionType?: 'Physical Lagos Tour' | 'Live WhatsApp Video Tour';
}

export interface WebinarChapter {
  timeLabel: string;
  seconds: number;
  title: string;
  speakerTakeaway: string;
  slideBulletPoints: string[];
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  location: string;
  propertyAcquired: string;
  beforeState: string;
  outcome: string;
  quote: string;
}
