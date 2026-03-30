import { format, parseISO, isValid } from 'date-fns';

export const STATUSES  = ['Applied', 'Interviewing', 'Offer', 'Rejected'];
export const PLATFORMS = ['LinkedIn', 'Company Site', 'Referral', 'Naukri', 'Indeed', 'AngelList', 'Other'];
export const LOC_TYPES = ['Remote', 'On-site', 'Hybrid'];

export const STATUS_META = {
  Applied:      { bg: 'rgba(59,130,246,.1)',  text: '#60a5fa', dot: '#3b82f6', border: 'rgba(59,130,246,.25)' },
  Interviewing: { bg: 'rgba(16,185,129,.1)',  text: '#34d399', dot: '#10b981', border: 'rgba(16,185,129,.25)' },
  Offer:        { bg: 'rgba(168,85,247,.1)',  text: '#c084fc', dot: '#a855f7', border: 'rgba(168,85,247,.25)' },
  Rejected:     { bg: 'rgba(239,68,68,.1)',   text: '#f87171', dot: '#ef4444', border: 'rgba(239,68,68,.25)'  },
};

export const STATUS_COLORS = {
  Applied:      '#3b82f6',
  Interviewing: '#10b981',
  Offer:        '#a855f7',
  Rejected:     '#ef4444',
};

/** Format salary in Indian short form: ₹12.5L */
export const fmtSalary = (n) => {
  if (!n) return '—';
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${n.toLocaleString('en-IN')}`;
};

/** Format a date string to "12 Mar 2026" */
export const fmtDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    const d = parseISO(dateStr);
    return isValid(d) ? format(d, 'dd MMM yyyy') : '—';
  } catch {
    return '—';
  }
};

/** Map company name → clearbit domain */
const DOMAIN_MAP = {
  google: 'google.com', stripe: 'stripe.com', figma: 'figma.com',
  notion: 'notion.so', atlassian: 'atlassian.com', razorpay: 'razorpay.com',
  amazon: 'amazon.com', microsoft: 'microsoft.com', netflix: 'netflix.com',
  spotify: 'spotify.com', airbnb: 'airbnb.com', uber: 'uber.com',
  flipkart: 'flipkart.com', swiggy: 'swiggy.in', zomato: 'zomato.com',
  paytm: 'paytm.com', infosys: 'infosys.com', wipro: 'wipro.com',
  tcs: 'tcs.com', apple: 'apple.com',
};

export const domainOf = (company) => {
  const key = company?.toLowerCase().trim() || '';
  return DOMAIN_MAP[key] || key.replace(/\s+/g, '') + '.com';
};

/** Unique ID */
export const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

/** Month label from a date string */
export const monthLabel = (dateStr) => {
  try { return format(parseISO(dateStr), 'MMM'); } catch { return '?'; }
};

/** Group array by a key function */
export const groupBy = (arr, keyFn) =>
  arr.reduce((acc, item) => {
    const k = keyFn(item);
    (acc[k] = acc[k] || []).push(item);
    return acc;
  }, {});
