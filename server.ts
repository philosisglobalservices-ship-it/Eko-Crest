import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { PROPERTIES, RELATED_UPSELLS, MAILCHIMP_SEQUENCE_TEMPLATE } from './src/data/properties.ts';
import type { LeadSubscriber, PropertyOrder, PaymentPlanType } from './src/types/funnel.ts';

const app = express();
const PORT = 3000;

app.use(express.json());

const subscribers = new Map<string, LeadSubscriber>();
const orders = new Map<string, PropertyOrder>();
const whatsappInquiries: Array<{
  id: string;
  name: string;
  topic: string;
  message: string;
  createdAt: string;
}> = [];

async function syncToMailchimp(payload: {
  firstName: string;
  email: string;
  whatsapp: string;
  buyerProfile: string;
}): Promise<{ synced: boolean; mode: 'live_api' | 'local_sequence_queued'; detail?: string }> {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX || 'us21';

  if (!apiKey || !audienceId) {
    return {
      synced: false,
      mode: 'local_sequence_queued',
      detail: 'Mailchimp API keys not configured in .env; first-time sequence queued locally.',
    };
  }

  try {
    const auth = Buffer.from(`anystring:${apiKey}`).toString('base64');
    const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: payload.email,
        status: 'subscribed',
        merge_fields: {
          FNAME: payload.firstName,
          PHONE: payload.whatsapp,
          PROFILE: payload.buyerProfile,
        },
        tags: ['lagos-funnel-first-time', 'webinar-replay-unlocked'],
      }),
    });

    if (response.ok || response.status === 400) {
      return {
        synced: true,
        mode: 'live_api',
      };
    }

    return {
      synced: false,
      mode: 'local_sequence_queued',
      detail: `Mailchimp returned HTTP ${response.status}; fallback sequence active.`,
    };
  } catch {
    return {
      synced: false,
      mode: 'local_sequence_queued',
      detail: 'Mailchimp network unreachable; local sequence queued.',
    };
  }
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    mailchimpConfigured: Boolean(process.env.MAILCHIMP_API_KEY && process.env.MAILCHIMP_AUDIENCE_ID),
  });
});

app.post('/api/mailchimp/subscribe', async (req, res) => {
  const { firstName, email, whatsapp, buyerProfile } = req.body ?? {};

  if (!firstName || typeof firstName !== 'string' || firstName.trim().length < 2) {
    return res.status(400).json({ error: 'Please enter your full name.' });
  }
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (!whatsapp || typeof whatsapp !== 'string' || whatsapp.trim().length < 7) {
    return res.status(400).json({ error: 'Please enter a valid WhatsApp phone number.' });
  }

  const mcResult = await syncToMailchimp({
    firstName: firstName.trim(),
    email: email.trim().toLowerCase(),
    whatsapp: whatsapp.trim(),
    buyerProfile: buyerProfile || 'Diaspora Investor',
  });

  const subscriber: LeadSubscriber = {
    id: `SUB-${Date.now().toString(36).toUpperCase()}`,
    firstName: firstName.trim(),
    email: email.trim().toLowerCase(),
    whatsapp: whatsapp.trim(),
    buyerProfile: buyerProfile || 'Diaspora Investor',
    subscribedAt: new Date().toISOString(),
    mailchimpSynced: mcResult.synced,
    mailchimpMode: mcResult.mode,
    tags: ['lagos-funnel-first-time', 'webinar-replay-unlocked'],
    sequence: MAILCHIMP_SEQUENCE_TEMPLATE,
  };

  subscribers.set(subscriber.email, subscriber);
  return res.status(201).json({ subscriber, detail: mcResult.detail });
});

app.post('/api/orders', (req, res) => {
  const {
    propertyId,
    paymentPlan,
    currency,
    paymentMethod,
    buyerName,
    buyerEmail,
    buyerWhatsapp,
  } = req.body ?? {};

  const property = PROPERTIES.find((p) => p.id === propertyId);
  if (!property) {
    return res.status(404).json({ error: 'Selected property was not found.' });
  }
  if (!buyerName || !buyerEmail || !buyerWhatsapp) {
    return res.status(400).json({ error: 'Buyer name, email, and WhatsApp number are required.' });
  }

  const plan: PaymentPlanType =
    paymentPlan === 'outright' || paymentPlan === 'deposit30' || paymentPlan === 'reservation'
      ? paymentPlan
      : 'reservation';

  let amountPaidNGN = property.reservationFeeNGN;
  let amountPaidUSD = property.reservationFeeUSD;

  if (plan === 'outright') {
    amountPaidNGN = Math.round(property.priceNGN * 0.95);
    amountPaidUSD = Math.round(property.priceUSD * 0.95);
  } else if (plan === 'deposit30') {
    amountPaidNGN = Math.round(property.priceNGN * 0.3);
    amountPaidUSD = Math.round(property.priceUSD * 0.3);
  }

  const orderId = `EKO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date();
  const formattedTime = now.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });

  const order: PropertyOrder = {
    orderId,
    propertyId: property.id,
    propertyTitle: property.title,
    district: property.district,
    titleDocument: property.titleDocument,
    registryCode: property.registryCode,
    paymentPlan: plan,
    amountPaidNGN,
    amountPaidUSD,
    totalPropertyPriceNGN: plan === 'outright' ? amountPaidNGN : property.priceNGN,
    totalPropertyPriceUSD: plan === 'outright' ? amountPaidUSD : property.priceUSD,
    currency: currency === 'USD' ? 'USD' : 'NGN',
    paymentMethod: paymentMethod || 'Instant Bank Transfer / Escrow',
    buyerName: String(buyerName).trim(),
    buyerEmail: String(buyerEmail).trim().toLowerCase(),
    buyerWhatsapp: String(buyerWhatsapp).trim(),
    realtorName: property.realtorName,
    realtorPhone: property.realtorPhone,
    developerName: property.developer,
    developerPhone: property.developerPhone,
    createdAt: now.toISOString(),
    upsells: [],
    milestones: [
      {
        step: 1,
        title: 'Escrow Allocation & Payment Receipt Confirmed',
        description: `Unit allocation locked under ${orderId} with ${property.titleDocument} dossier assigned.`,
        status: 'completed',
        timestamp: `Today, ${formattedTime}`,
      },
      {
        step: 2,
        title: 'Alausa Land Registry & Title Charting Verification',
        description: `Our legal desk shares live Lagos State Registry search confirmation (${property.registryCode}) via email & WhatsApp.`,
        status: 'in_progress',
        timestamp: 'Est. within 24–48 hours',
      },
      {
        step: 3,
        title: 'Contract of Sale & Deed of Assignment Execution',
        description: 'Countersigned legal title package prepared for Lagos physical or couriered diaspora execution.',
        status: 'upcoming',
        timestamp: 'Day 3–7',
      },
      {
        step: 4,
        title: 'Site Inspection & Physical Key Handover',
        description: 'Walkthrough with Eko Crest Lead Engineer and facility management onboarding.',
        status: 'upcoming',
        timestamp: property.completionStatus,
      },
    ],
  };

  orders.set(orderId, order);
  return res.status(201).json({ order });
});

app.post('/api/orders/:orderId/upsell', (req, res) => {
  const { orderId } = req.params;
  const { upsellId } = req.body ?? {};
  const order = orders.get(orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found.' });
  }
  const upsell = RELATED_UPSELLS.find((u) => u.id === upsellId);
  if (!upsell) {
    return res.status(404).json({ error: 'Related offer not found.' });
  }
  if (!order.upsells.some((u) => u.id === upsell.id)) {
    order.upsells.push(upsell);
    order.amountPaidNGN += upsell.otoPriceNGN;
    order.amountPaidUSD += upsell.otoPriceUSD;
    order.totalPropertyPriceNGN += upsell.otoPriceNGN;
    order.totalPropertyPriceUSD += upsell.otoPriceUSD;
  }
  return res.json({ order });
});

app.post('/api/orders/:orderId/inspection', (req, res) => {
  const { orderId } = req.params;
  const { inspectionDate, inspectionType } = req.body ?? {};
  const order = orders.get(orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found.' });
  }
  order.inspectionDate = inspectionDate;
  order.inspectionType = inspectionType;
  return res.json({ order });
});

app.get('/api/orders/:orderId', (req, res) => {
  const order = orders.get(req.params.orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found.' });
  }
  return res.json({ order });
});

app.post('/api/whatsapp/inquiry', (req, res) => {
  const { name, topic, message } = req.body ?? {};
  const entry = {
    id: `WA-${Date.now().toString(36).toUpperCase()}`,
    name: name || 'Prospective Buyer',
    topic: topic || 'Property Inquiry',
    message: message || '',
    createdAt: new Date().toISOString(),
  };
  whatsappInquiries.push(entry);
  return res.status(201).json({ entry });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Eko Crest Realty server running on http://localhost:${PORT}`);
  });
}

startServer();
