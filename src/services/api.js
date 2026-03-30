// import axios from 'axios';

// const dummyClient = axios.create({
//   baseURL: 'https://dummyjson.com',
//   timeout: 10000,
// });

// /**
//  * Fetch mock job listings from dummyjson /products.
//  * We map product fields → job application fields.
//  */
// export const fetchMockJobs = async () => {
//   const { data } = await dummyClient.get('/products?limit=20&skip=0');
//   return data.products;
// };

// /**
//  * Returns the Clearbit logo URL for a given company domain.
//  * Actual image fetching is handled in the <CompanyLogo> component.
//  */
// export const getLogoUrl = (domain) =>
//   `https://logo.clearbit.com/${domain}`;

// /**
//  * Map a dummyjson product → our job application data model.
//  */
// export const mapProductToJob = (product, index) => {
//   const companies = [
//     'Google','Stripe','Figma','Notion','Atlassian','Razorpay',
//     'Amazon','Microsoft','Netflix','Spotify','Airbnb','Uber',
//     'Flipkart','Swiggy','Zomato','Paytm','Infosys','Wipro','TCS','Apple',
//   ];
//   const roles = [
//     'Frontend Engineer','Backend Developer','Full Stack Engineer',
//     'Product Designer','UX Researcher','Data Scientist',
//     'DevOps Engineer','Mobile Developer','QA Engineer','Product Manager',
//   ];
//   const platforms = ['LinkedIn','Company Site','Referral','Naukri','Indeed','AngelList'];
//   const statuses  = ['Applied','Interviewing','Offer','Rejected'];
//   const locations = ['Remote','On-site','Hybrid'];

//   const daysAgo = (n) => {
//     const d = new Date();
//     d.setDate(d.getDate() - n);
//     return d.toISOString().split('T')[0];
//   };

//   return {
//     id:            String(product.id),
//     company:       companies[index % companies.length],
//     role:          roles[index % roles.length],
//     location:      locations[index % locations.length],
//     salary:        Math.round(product.price * 3800 / 100) * 100,   // map price → salary (INR)
//     platform:      platforms[index % platforms.length],
//     status:        statuses[index % statuses.length],
//     appliedDate:   daysAgo((index + 1) * 6),
//     interviewDate: index % 3 === 0 ? daysAgo(-(index + 2)) : '',
//     notes:         product.description?.slice(0, 100) || '',
//     bookmarked:    index % 5 === 0,
//     _fromApi:      true,
//   };

// };


import axios from 'axios';

// ── Axios instance for DummyJSON ──────────────────────────────────────────────
const dummyApi = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Clearbit Logo URL helper ──────────────────────────────────────────────────
/**
 * Returns the Clearbit logo URL for a given domain.
 * @param {string} domain  e.g. "google.com"
 * @returns {string}
 */
export const getLogoUrl = (domain) =>
  domain ? `https://logo.clearbit.com/${domain}` : '';

/**
 * Best-effort: derive a domain from a company name.
 * e.g. "Google LLC" → "google.com"
 */
export const domainOf = (company = '') => {
  const cleaned = company
    .toLowerCase()
    .replace(/\s+(inc|llc|ltd|corp|co|pvt|technologies|tech|solutions|group|global|systems|services)\.?$/gi, '')
    .trim()
    .replace(/\s+/g, '')          // remove spaces
    .replace(/[^a-z0-9-]/g, ''); // strip special chars
  return cleaned ? `${cleaned}.com` : '';
};

// ── Status / Platform / Location pools (for realistic mapping) ────────────────
const STATUSES   = ['Applied', 'Interviewing', 'Offer', 'Rejected', 'Saved'];
const PLATFORMS  = ['LinkedIn', 'Naukri', 'Internshala', 'AngelList', 'Indeed', 'Company Site', 'Referral'];
const LOC_TYPES  = ['Remote', 'On-site', 'Hybrid'];

// Real company roster so logos actually resolve via Clearbit
const COMPANIES = [
  { name: 'Google',        domain: 'google.com'        },
  { name: 'Microsoft',     domain: 'microsoft.com'     },
  { name: 'Amazon',        domain: 'amazon.com'        },
  { name: 'Meta',          domain: 'meta.com'          },
  { name: 'Apple',         domain: 'apple.com'         },
  { name: 'Netflix',       domain: 'netflix.com'       },
  { name: 'Uber',          domain: 'uber.com'          },
  { name: 'Airbnb',        domain: 'airbnb.com'        },
  { name: 'Stripe',        domain: 'stripe.com'        },
  { name: 'Shopify',       domain: 'shopify.com'       },
  { name: 'Atlassian',     domain: 'atlassian.com'     },
  { name: 'Salesforce',    domain: 'salesforce.com'    },
  { name: 'Adobe',         domain: 'adobe.com'         },
  { name: 'Spotify',       domain: 'spotify.com'       },
  { name: 'Twitter',       domain: 'twitter.com'       },
  { name: 'LinkedIn',      domain: 'linkedin.com'      },
  { name: 'Slack',         domain: 'slack.com'         },
  { name: 'Zoom',          domain: 'zoom.us'           },
  { name: 'Notion',        domain: 'notion.so'         },
  { name: 'Figma',         domain: 'figma.com'         },
  { name: 'GitHub',        domain: 'github.com'        },
  { name: 'Vercel',        domain: 'vercel.com'        },
  { name: 'Twilio',        domain: 'twilio.com'        },
  { name: 'Databricks',    domain: 'databricks.com'    },
  { name: 'Snowflake',     domain: 'snowflake.com'     },
  { name: 'Infosys',       domain: 'infosys.com'       },
  { name: 'Wipro',         domain: 'wipro.com'         },
  { name: 'TCS',           domain: 'tcs.com'           },
  { name: 'Flipkart',      domain: 'flipkart.com'      },
  { name: 'Swiggy',        domain: 'swiggy.com'        },
];

const ROLES = [
  'Frontend Engineer', 'Backend Developer', 'Full Stack Engineer',
  'Product Manager', 'Data Scientist', 'ML Engineer',
  'DevOps Engineer', 'Cloud Architect', 'UI/UX Designer',
  'Android Developer', 'iOS Developer', 'QA Engineer',
  'Security Engineer', 'SRE', 'Data Analyst',
];

// Random seeded pick (deterministic per index)
const pick = (arr, seed) => arr[seed % arr.length];

// Random salary band (in INR)
const salary = (seed) => {
  const bands = [600000, 900000, 1200000, 1500000, 1800000, 2400000, 3000000, 3600000];
  return bands[seed % bands.length];
};

// Random applied date within last 6 months
const appliedDate = (seed) => {
  const now  = new Date();
  const days = (seed * 7) % 180;
  now.setDate(now.getDate() - days);
  return now.toISOString().split('T')[0];
};

// Occasionally add an interview date
const interviewDate = (seed, appDate) => {
  if (seed % 3 !== 0) return null;
  const d = new Date(appDate);
  d.setDate(d.getDate() + ((seed % 14) + 3));
  return d.toISOString().split('T')[0];
};

/**
 * Maps a DummyJSON product to a job application object.
 * The product fields (id, title, price, …) are repurposed for job fields.
 *
 * @param {Object} product  Raw product from DummyJSON API
 * @param {number} index    Position index for deterministic variation
 * @returns {Object}        Job application object
 */
export const mapProductToJob = (product, index) => {
  const company = COMPANIES[index % COMPANIES.length];
  const aDate   = appliedDate(product.id);

  return {
    // Identity
    id:            String(product.id),
    _fromApi:      true,

    // Job details  (mapped from product fields)
    company:       company.name,
    domain:        company.domain,                         // used by Clearbit
    role:          pick(ROLES, product.id + index),
    salary:        salary(product.id),

    // Tracking
    status:        pick(STATUSES,  product.id),
    platform:      pick(PLATFORMS, product.id + 2),
    location:      pick(LOC_TYPES, product.id + 1),

    // Dates
    appliedDate:   aDate,
    interviewDate: interviewDate(product.id, aDate),

    // Extras
    notes:         product.description?.slice(0, 120) || '',
    bookmarked:    product.id % 7 === 0,                   // bookmark every 7th
  };
};

// ── API functions ─────────────────────────────────────────────────────────────

/**
 * Fetches mock job listings from DummyJSON /products endpoint using Axios.
 * Returns the raw products array.
 */
export const fetchMockJobs = async () => {
  const response = await dummyApi.get('/products', {
    params: { limit: 30, skip: 0 },
  });
  // DummyJSON wraps results: { products: [...], total, skip, limit }
  return response.data.products;
};

/**
 * Fetches a single product by id (useful for edit page pre-fill).
 * @param {string|number} id
 */
export const fetchJobById = async (id) => {
  const response = await dummyApi.get(`/products/${id}`);
  return response.data;
};

/**
 * Simulates a POST to create a job (DummyJSON /products/add).
 * Returns the echoed object (id will be fake from DummyJSON).
 */
export const createJob = async (jobData) => {
  const response = await dummyApi.post('/products/add', jobData);
  return response.data;
};

/**
 * Simulates a PATCH update (DummyJSON /products/:id).
 */
export const updateJob = async (id, jobData) => {
  const response = await dummyApi.patch(`/products/${id}`, jobData);
  return response.data;
};

/**
 * Simulates a DELETE (DummyJSON /products/:id).
 */
export const deleteJob = async (id) => {
  const response = await dummyApi.delete(`/products/${id}`);
  return response.data;
};

// ── Axios interceptors (logging / global error handling) ─────────────────────
dummyApi.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

dummyApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg = error.response?.data?.message || error.message || 'API error';
    console.error('[API Error]', msg);
    return Promise.reject(new Error(msg));
  },
);

export default dummyApi;