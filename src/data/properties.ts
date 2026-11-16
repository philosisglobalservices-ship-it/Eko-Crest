import {
  MailchimpEmailStep,
  PropertyListing,
  TestimonialItem,
  UpsellOffer,
  WebinarChapter,
} from '../types/funnel';

export const HERO_IMAGE = '/src/assets/images/hero_lagos_penthouse_1794512679847.jpg';
export const WEBINAR_POSTER = '/src/assets/images/webinar_speaker_studio_1794512680484.jpg';

export const WHATSAPP_NUMBER = '2348095550192';

export const PROPERTIES: PropertyListing[] = [
  {
    id: 'ikoyi-bourdillon-villa',
    slug: 'bourdillon-limestone-villa',
    title: 'The Bourdillon Limestone Residence',
    district: 'Old Ikoyi',
    address: '14B Bourdillon Road, Old Ikoyi, Lagos',
    priceNGN: 950_000_000,
    priceUSD: 615_000,
    reservationFeeNGN: 10_000_000,
    reservationFeeUSD: 6_500,
    titleDocument: "Governor's Consent & Lagos Registry Search",
    registryCode: 'LSR-IKY-2026-091',
    annualYield: '11.8% Net Rental Yield',
    projectedAppreciation: '+28.4% 24-Mo Projected Appreciation',
    bedrooms: 5,
    bathrooms: 6,
    areaSqm: 780,
    unitsTotal: 4,
    unitsRemaining: 1,
    completionStatus: 'Ready for Immediate Handover',
    developer: 'Eko Crest Engineering & Development Ltd.',
    realtorName: 'Tunde Adeyemi',
    realtorPhone: '2348095550192',
    developerPhone: '2348095550440',
    image: '/src/assets/images/property_ikoyi_villa_1794512680468.jpg',
    summary:
      'Architectural detached limestone villa with private lap pool, smart automation, 24/7 independent power grid, and full Governor’s Consent verified at Alausa Land Registry.',
    highlights: [
      'Verified Governor’s Consent (File No. LSR-IKY-2026-091)',
      'Private 14m saltwater lap pool and landscaped palm courtyard',
      'Dual dedicated transformers + solar-hybrid backup microgrid',
      '2-room detached staff quarters + biometric security gatehouse',
    ],
    valueStack: [
      { item: 'Alausa Land Registry Legal Search & Charting Fee Waived', valueNGN: 2_500_000 },
      { item: 'Independent Structural & MEP Snagging Audit', valueNGN: 1_200_000 },
      { item: '12-Month Corporate Expat Tenant Placement Retainer', valueNGN: 4_800_000 },
    ],
  },
  {
    id: 'eko-atlantic-pearl',
    slug: 'atlantic-pearl-oceanfront',
    title: 'Atlantic Pearl Oceanfront Sky Suite',
    district: 'Eko Atlantic',
    address: 'Plot 8A Marina Boulevard, Eko Atlantic City, Lagos',
    priceNGN: 720_000_000,
    priceUSD: 465_000,
    reservationFeeNGN: 7_500_000,
    reservationFeeUSD: 4_850,
    titleDocument: 'Certificate of Occupancy (Eko Atlantic C of O)',
    registryCode: 'EAC-MAR-2026-312',
    annualYield: '13.4% USD-Indexed Short-Let Yield',
    projectedAppreciation: '+31.0% 24-Mo Projected Appreciation',
    bedrooms: 4,
    bathrooms: 5,
    areaSqm: 520,
    unitsTotal: 8,
    unitsRemaining: 2,
    completionStatus: 'Q1 2027 Key Handover (88% Complete)',
    developer: 'Eko Crest Engineering & Development Ltd.',
    realtorName: 'Tunde Adeyemi',
    realtorPhone: '2348095550192',
    developerPhone: '2348095550440',
    image: '/src/assets/images/property_eko_atlantic_1794512682155.jpg',
    summary:
      'Panoramic ocean-facing residence inside Africa’s premier coastal financial hub. Priced with dollar-indexed corporate lease demand from multinational executives.',
    highlights: [
      'Direct Eko Atlantic C of O + Sovereign Sea-Wall Protection',
      'Uninterrupted Atlantic Ocean view with floor-to-ceiling acoustic glass',
      'Private elevator lobby, concierge desk, and marina berth priority',
      'Zero flooding risk with elevated 8.5m coastal engineering grade',
    ],
    valueStack: [
      { item: 'Eko Atlantic Legal Perfection & Survey Package', valueNGN: 1_950_000 },
      { item: 'Custom Italian Travertine Kitchen Upgrade', valueNGN: 3_500_000 },
      { item: '12-Month Short-Let Revenue Management Onboarding', valueNGN: 3_200_000 },
    ],
  },
  {
    id: 'vi-azura-suites',
    slug: 'adeola-odeku-executive-suites',
    title: 'The Azura Executive Suites',
    district: 'Victoria Island',
    address: '29 Adeola Odeku Corridor, Victoria Island, Lagos',
    priceNGN: 485_000_000,
    priceUSD: 315_000,
    reservationFeeNGN: 5_000_000,
    reservationFeeUSD: 3_250,
    titleDocument: "Certificate of Occupancy & Governor's Consent",
    registryCode: 'LSR-VI-2026-504',
    annualYield: '14.2% Corporate Lease & Airbnb Yield',
    projectedAppreciation: '+24.6% 24-Mo Projected Appreciation',
    bedrooms: 3,
    bathrooms: 4,
    areaSqm: 340,
    unitsTotal: 10,
    unitsRemaining: 3,
    completionStatus: 'Ready for Immediate Handover',
    developer: 'Eko Crest Engineering & Development Ltd.',
    realtorName: 'Chidinma Okafor',
    realtorPhone: '2348095550192',
    developerPhone: '2348095550440',
    image: '/src/assets/images/property_vi_suites_1794512682216.jpg',
    summary:
      'High-occupancy diplomatic and multinational residential tower steps from major oil, banking, and tech headquarters in Victoria Island.',
    highlights: [
      '91% historical annual corporate occupancy rate on Adeola Odeku',
      'Full C of O & Governor’s Consent ready for instant deed transfer',
      '24-hour armed estate patrol, rooftop lounge, and executive gym',
      'Eligible for 30% initial allocation + 12-month milestone balance',
    ],
    valueStack: [
      { item: 'Deed of Assignment & Registry Filing Fee Waived', valueNGN: 1_450_000 },
      { item: 'Smart Keyless Lock & Hospitality Setup Kit', valueNGN: 950_000 },
      { item: 'Guaranteed First-Year Corporate Tenant Sourcing', valueNGN: 2_600_000 },
    ],
  },
  {
    id: 'lekki-sovereign-terrace',
    slug: 'admiralty-sovereign-terrace',
    title: 'Admiralty Sovereign Smart Terrace',
    district: 'Lekki Phase 1',
    address: 'Plot 12 Admiralty Way Enclave, Lekki Phase 1, Lagos',
    priceNGN: 340_000_000,
    priceUSD: 220_000,
    reservationFeeNGN: 3_500_000,
    reservationFeeUSD: 2_300,
    titleDocument: "Governor's Consent (Lekki Phase 1 Block)",
    registryCode: 'LSR-LK1-2026-778',
    annualYield: '12.6% Short-Let & Family Rental Yield',
    projectedAppreciation: '+26.2% 24-Mo Projected Appreciation',
    bedrooms: 4,
    bathrooms: 5,
    areaSqm: 410,
    unitsTotal: 6,
    unitsRemaining: 2,
    completionStatus: 'Ready for Immediate Handover',
    developer: 'Eko Crest Engineering & Development Ltd.',
    realtorName: 'Chidinma Okafor',
    realtorPhone: '2348095550192',
    developerPhone: '2348095550440',
    image: '/src/assets/images/property_lekki_terrace_1794512681904.jpg',
    summary:
      'Elevated-grade smart terrace duplex behind a gated security enclave off Admiralty Way, engineered for zero storm-water pooling and peak family or executive demand.',
    highlights: [
      'Verified Governor’s Consent with zero encumbrance certificate',
      'Raised 1.4m road-level plinth + dedicated storm-water drainage',
      'Fully fitted Bosch kitchen, cinema pre-wiring, and 3-car court',
      'Fastest liquidity tier in Lagos Island for 24-month resale',
    ],
    valueStack: [
      { item: 'Governor’s Consent Search & Legal Dossier Fee Waived', valueNGN: 1_100_000 },
      { item: '10kVA Hybrid Inverter + Lithium Backup Pre-Installed', valueNGN: 2_800_000 },
      { item: '6-Month Facility Service Charge Credit', valueNGN: 900_000 },
    ],
  },
];

export const RELATED_UPSELLS: UpsellOffer[] = [
  {
    id: 'upsell-turnkey-furnish',
    title: 'Executive Hospitality Turnkey & Short-Let Yield Package',
    district: 'Applicable to Your Allocated Residence',
    category: 'Yield Accelerator Add-On',
    regularPriceNGN: 42_000_000,
    otoPriceNGN: 29_500_000,
    regularPriceUSD: 27_200,
    otoPriceUSD: 19_100,
    savingsPercent: 30,
    description:
      'Skip 4 months of furnishing logistics. Our interior architecture team outfits your residence to 5-star diplomatic standards and lists it immediately with our corporate housing desk.',
    image: '/src/assets/images/property_eko_atlantic_1794512682155.jpg',
    deliverables: [
      'Bespoke living, dining, and master suite designer furnishings',
      'Smart TV, high-speed Starlink fiber installation, and biometric locks',
      'Priority placement with oil & tech expat corporate housing desks',
    ],
  },
  {
    id: 'upsell-vi-studio-lot',
    title: 'Victoria Island Co-Investment Studio Suite (Portfolio Bundle)',
    district: 'Victoria Island',
    category: 'Related Cashflow Property',
    regularPriceNGN: 195_000_000,
    otoPriceNGN: 168_000_000,
    regularPriceUSD: 126_000,
    otoPriceUSD: 108_500,
    savingsPercent: 14,
    description:
      'Pair your primary Lagos residence with a high-turnover corporate studio in Victoria Island. Lock an exclusive ₦27M portfolio-bundle discount valid only on this confirmation page.',
    image: '/src/assets/images/property_vi_suites_1794512682216.jpg',
    deliverables: [
      '1-Bedroom furnished corporate suite with C of O',
      'Projected ₦24M/year net short-let cashflow to offset service charges',
      'Combined Deed of Assignment legal processing at zero extra legal fee',
    ],
  },
];

export const WEBINAR_CHAPTERS: WebinarChapter[] = [
  {
    timeLabel: '00:00',
    seconds: 0,
    title: 'Why Idle Currency Loses to Lagos Island Brick & Mortar',
    speakerTakeaway:
      'Gary Vee attention thesis applied to Lagos: supply on Ikoyi & VI waterfronts is fixed while diaspora and corporate demand doubles every 36 months.',
    slideBulletPoints: [
      'Ikoyi & Eko Atlantic land supply cannot be manufactured',
      'Prime island rents repriced +68% over the past 24 months',
      'Why waiting 6 months costs an average of ₦45M–₦90M in entry equity',
    ],
  },
  {
    timeLabel: '04:15',
    seconds: 255,
    title: 'The 3-Step Alausa Registry & Title Verification Shield',
    speakerTakeaway:
      'Dan Lok risk-reversal standard: never wire a single naira before verifying Governor’s Consent, charting coordinates, and escrow release triggers.',
    slideBulletPoints: [
      'Step 1: Survey Plan coordinate charting against Lagos State GIS',
      'Step 2: Physical Alausa Land Registry file & encumbrance verification',
      'Step 3: Solicitor-held escrow until Contract of Sale & Deed sign-off',
    ],
  },
  {
    timeLabel: '09:40',
    seconds: 580,
    title: 'The 11%–14% Rental Yield & Equity Compounding Math',
    speakerTakeaway:
      'Real numbers from 18 expatriate & short-let units across Adeola Odeku, Bourdillon, and Admiralty Way.',
    slideBulletPoints: [
      'Corporate annual leases billed in stable high-yield tranches',
      'Short-let hospitality suites achieving 82%–91% annual occupancy',
      'How a 30% allocation deposit locks 100% of today’s developer valuation',
    ],
  },
  {
    timeLabel: '14:20',
    seconds: 860,
    title: 'How the 24-Hour Private Allocation Window Works',
    speakerTakeaway:
      'Why we cap each release to verified briefing attendees and waive up to ₦8.5M in legal charting & tenant-placement fees for 24 hours.',
    slideBulletPoints: [
      'Instant lock-in via escrow reservation or 30% allocation deposit',
      'Live WhatsApp video walkthrough with site engineer within 2 hours',
      'Real-time milestone tracking from registry search to key handover',
    ],
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'test-1',
    name: 'Dr. Babatunde Ogunleye',
    role: 'Consultant Orthopaedic Surgeon',
    location: 'London, UK · Acquired in Old Ikoyi',
    propertyAcquired: 'The Bourdillon Limestone Residence',
    beforeState: 'Hesitant for 4 years due to fear of Lagos title disputes while living abroad',
    outcome: 'Verified Governor’s Consent in 72 hours; property appreciated +31% in 18 months',
    quote:
      'Their solicitor walked my UK lawyer through the Alausa Land Registry charting live on WhatsApp video before I moved my 30% deposit. Everything happened on schedule down to key handover.',
  },
  {
    id: 'test-2',
    name: 'Ngozi Nwosu-Coker',
    role: 'Managing Director, Energy Logistics',
    location: 'Victoria Island, Lagos · Acquired 2 Units',
    propertyAcquired: 'The Azura Executive Suites',
    beforeState: 'Holding excess treasury cash losing purchasing power to inflation',
    outcome: '14.2% net annual yield leased to an international oil & gas consultancy',
    quote:
      'Eko Crest treated the transaction like an institutional acquisition. My Adeola Odeku suite was leased to an expatriate director 19 days after handover.',
  },
  {
    id: 'test-3',
    name: 'Chukwuemeka & Amaka Eze',
    role: 'Tech Founder & Corporate Counsel',
    location: 'Houston, TX · Acquired in Lekki Phase 1',
    propertyAcquired: 'Admiralty Sovereign Smart Terrace',
    beforeState: 'Burned by slow off-plan promises from an unverified developer in 2022',
    outcome: 'Locked ₦5M reservation, inspected live via developer feed, settled balance in 60 days',
    quote:
      'Having direct WhatsApp access to both Tunde and the project site engineer plus the live milestone tracker made buying from Houston completely stress-free.',
  },
];

export const MAILCHIMP_SEQUENCE_TEMPLATE: MailchimpEmailStep[] = [
  {
    day: 'Day 0 (Immediate)',
    subject: 'Your Private Lagos Property Briefing & Title Verification Dossier',
    purpose: 'Delivers webinar replay link, Alausa C of O checklist, and 24-hour reservation pass.',
    preview: 'Includes direct links to Governor’s Consent sample charting and escrow protocol.',
    status: 'Dispatched',
  },
  {
    day: 'Day 1 (+24h)',
    subject: 'Ikoyi vs. Eko Atlantic vs. VI: Where Smart Capital Is Moving in 2026',
    purpose: 'Gary Vee style market transparency breaking down rental yields and resale liquidity.',
    preview: 'Side-by-side table of 11.8%–14.2% net rental yields and historical appreciation.',
    status: 'Scheduled',
  },
  {
    day: 'Day 2 (+48h)',
    subject: 'How Diaspora Buyers Verify Lagos Land Titles Without Boarding a Flight',
    purpose: 'Dan Lok style risk-reversal walkthrough with independent solicitor verification.',
    preview: 'Step-by-step Alausa Land Registry audit and WhatsApp live-site video tour booking.',
    status: 'Scheduled',
  },
  {
    day: 'Day 3 (+72h)',
    subject: 'Case Study: How Dr. Ogunleye Locked +31% Equity in Old Ikoyi',
    purpose: 'Social proof story addressing legal objections and corporate tenant placement.',
    preview: 'Full transaction timeline from ₦10M reservation to 19-day expat lease signing.',
    status: 'Scheduled',
  },
  {
    day: 'Day 5 (Final Notice)',
    subject: 'Allocation Closing: Remaining Units & Developer Price Revision Notice',
    purpose: 'Scarcity trigger before next construction tranche revaluation.',
    preview: 'Direct WhatsApp priority link to lock remaining inventory at current valuation.',
    status: 'Scheduled',
  },
];

export function formatCurrency(amountNGN: number, amountUSD: number, currency: 'NGN' | 'USD'): string {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amountUSD);
  }
  return `₦${new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 }).format(amountNGN)}`;
}
