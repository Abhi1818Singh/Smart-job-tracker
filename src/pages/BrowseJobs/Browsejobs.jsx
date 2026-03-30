import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  MdSearch, MdClose, MdBookmark, MdBookmarkBorder,
  MdLocationOn, MdAttachMoney, MdWork, MdOpenInNew,
  MdFilterList, MdRefresh, MdArrowBack, MdArrowForward,
  MdStar, MdAccessTime, MdBusiness, MdCode, MdTrendingUp,
  MdCheckCircle, MdAddCircle, MdExpandMore,
} from 'react-icons/md';
import useApplications from '../../hooks/useApplications';
import './BrowseJobs.css';

// ── Constants ────────────────────────────────────────────────────────────────
const CLEARBIT = (domain) => `https://logo.clearbit.com/${domain}`;

const COMPANIES = [
  { name: 'Google',      domain: 'google.com',      color: '#4285F4' },
  { name: 'Microsoft',   domain: 'microsoft.com',   color: '#00A4EF' },
  { name: 'Amazon',      domain: 'amazon.com',      color: '#FF9900' },
  { name: 'Meta',        domain: 'meta.com',        color: '#0082FB' },
  { name: 'Apple',       domain: 'apple.com',       color: '#555555' },
  { name: 'Netflix',     domain: 'netflix.com',     color: '#E50914' },
  { name: 'Uber',        domain: 'uber.com',        color: '#000000' },
  { name: 'Airbnb',      domain: 'airbnb.com',      color: '#FF5A5F' },
  { name: 'Stripe',      domain: 'stripe.com',      color: '#635BFF' },
  { name: 'Shopify',     domain: 'shopify.com',     color: '#96BF48' },
  { name: 'Atlassian',   domain: 'atlassian.com',   color: '#0052CC' },
  { name: 'Salesforce',  domain: 'salesforce.com',  color: '#00A1E0' },
  { name: 'Adobe',       domain: 'adobe.com',       color: '#FF0000' },
  { name: 'Spotify',     domain: 'spotify.com',     color: '#1DB954' },
  { name: 'Notion',      domain: 'notion.so',       color: '#000000' },
  { name: 'Figma',       domain: 'figma.com',       color: '#F24E1E' },
  { name: 'GitHub',      domain: 'github.com',      color: '#181717' },
  { name: 'Vercel',      domain: 'vercel.com',      color: '#000000' },
  { name: 'Twilio',      domain: 'twilio.com',      color: '#F22F46' },
  { name: 'Snowflake',   domain: 'snowflake.com',   color: '#29B5E8' },
  { name: 'Infosys',     domain: 'infosys.com',     color: '#007CC3' },
  { name: 'Wipro',       domain: 'wipro.com',       color: '#341C77' },
  { name: 'TCS',         domain: 'tcs.com',         color: '#C00' },
  { name: 'Flipkart',    domain: 'flipkart.com',    color: '#2874F0' },
  { name: 'Swiggy',      domain: 'swiggy.com',      color: '#FC8019' },
  { name: 'Razorpay',    domain: 'razorpay.com',    color: '#3395FF' },
  { name: 'Zepto',       domain: 'zeptonow.com',    color: '#8B5CF6' },
  { name: 'CRED',        domain: 'cred.club',       color: '#1A1A2E' },
  { name: 'Meesho',      domain: 'meesho.com',      color: '#9B2C8A' },
  { name: 'PhonePe',     domain: 'phonepe.com',     color: '#5F259F' },
];

const ROLES = [
  'Frontend Engineer', 'Backend Developer', 'Full Stack Engineer',
  'Product Manager', 'Data Scientist', 'ML Engineer',
  'DevOps Engineer', 'Cloud Architect', 'UI/UX Designer',
  'Android Developer', 'iOS Developer', 'QA Engineer',
  'Security Engineer', 'Site Reliability Engineer', 'Data Analyst',
  'Software Engineer', 'Engineering Manager', 'Technical Lead',
];

const LOC_TYPES  = ['Remote', 'On-site', 'Hybrid'];
const PLATFORMS  = ['LinkedIn', 'Naukri', 'AngelList', 'Indeed', 'Company Site', 'Referral'];
const EXP_LEVELS = ['0–1 yrs', '1–3 yrs', '3–5 yrs', '5–8 yrs', '8+ yrs'];
const CATEGORIES = ['All', 'Engineering', 'Design', 'Product', 'Data', 'DevOps', 'Management'];

const SKILLS_POOL = {
  Engineering: ['React', 'Node.js', 'TypeScript', 'Python', 'Java', 'Go', 'Rust', 'GraphQL', 'REST APIs', 'Microservices'],
  Design:      ['Figma', 'Sketch', 'Adobe XD', 'Prototyping', 'User Research', 'Design Systems', 'Illustrator'],
  Product:     ['Roadmapping', 'Agile', 'Jira', 'A/B Testing', 'Analytics', 'Stakeholder Mgmt', 'PRDs'],
  Data:        ['Python', 'SQL', 'Spark', 'TensorFlow', 'PyTorch', 'Tableau', 'dbt', 'Airflow'],
  DevOps:      ['Kubernetes', 'Docker', 'Terraform', 'AWS', 'GCP', 'Azure', 'CI/CD', 'Ansible'],
  Management:  ['Team Leadership', 'OKRs', 'Hiring', 'Roadmapping', 'Cross-functional', 'Mentoring'],
};

const SALARY_BANDS = [600000, 900000, 1200000, 1500000, 1800000, 2400000, 3000000, 3600000, 4800000, 6000000];

const pick = (arr, seed) => arr[Math.abs(seed) % arr.length];

const fmtSalary = (n) => {
  if (!n) return '—';
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L/yr`;
  return `₹${n.toLocaleString('en-IN')}`;
};

const timeAgo = (seed) => {
  const opts = ['Just now', '2h ago', '1d ago', '3d ago', '1w ago', '2w ago'];
  return opts[seed % opts.length];
};

const categoryOf = (role) => {
  if (/engineer|developer|full.stack|ios|android|software|lead|sre|reliability/i.test(role)) return 'Engineering';
  if (/design|ux|ui/i.test(role)) return 'Design';
  if (/product.manager|pm\b/i.test(role)) return 'Product';
  if (/data|ml|machine|analyst|scientist/i.test(role)) return 'Data';
  if (/devops|cloud|architect|sre/i.test(role)) return 'DevOps';
  if (/manager|management|lead/i.test(role)) return 'Management';
  return 'Engineering';
};

// Map a DummyJSON product → rich job listing
const mapToJob = (product, index) => {
  const company = COMPANIES[index % COMPANIES.length];
  const role    = pick(ROLES, product.id + index);
  const cat     = categoryOf(role);
  const skills  = (SKILLS_POOL[cat] || SKILLS_POOL.Engineering)
    .sort(() => (product.id % 3) - 1)
    .slice(0, 4 + (product.id % 3));

  return {
    id:          product.id,
    company:     company.name,
    domain:      company.domain,
    companyColor:company.color,
    role,
    category:    cat,
    location:    pick(LOC_TYPES,  product.id),
    platform:    pick(PLATFORMS,  product.id + 1),
    exp:         pick(EXP_LEVELS, product.id + 2),
    salary:      SALARY_BANDS[product.id % SALARY_BANDS.length],
    salaryMax:   SALARY_BANDS[(product.id + 2) % SALARY_BANDS.length],
    skills,
    rating:      (3.5 + (product.id % 15) / 10).toFixed(1),
    postedAgo:   timeAgo(product.id),
    openings:    1 + (product.id % 4),
    remote:      product.id % 3 === 0,

    // Rich detail fields from product
    description: product.description,
    fullDesc: `We are looking for a talented ${role} to join our growing team at ${company.name}. 
    
In this role, you will work on cutting-edge projects that impact millions of users worldwide. You'll collaborate with world-class engineers, designers, and product managers to build products that matter.

What you'll do:
• Design, build, and maintain high-performance, scalable systems
• Collaborate with cross-functional teams to define and ship new features  
• Participate in code reviews and contribute to engineering best practices
• Mentor junior engineers and contribute to team culture
• Work closely with product and design to shape the roadmap

What we're looking for:
• ${product.id % 2 === 0 ? '3+' : '2+'} years of experience in ${skills.slice(0, 2).join(' and ')}
• Strong problem-solving skills and attention to detail
• Experience with ${skills.slice(2, 4).join(', ')}
• Excellent communication and collaboration skills
• Passion for building great products`,

    benefits: [
      'Competitive salary & equity',
      'Health, dental & vision insurance',
      'Flexible remote work policy',
      'Learning & development budget',
      'Home office stipend',
      '30 days paid leave',
    ].slice(0, 3 + (product.id % 3)),

    // raw product data kept for reference
    _raw: { title: product.title, price: product.price, brand: product.brand },
  };
};

// ── Logo with fallback ────────────────────────────────────────────────────────
const CompanyLogo = ({ domain, company, color, size = 40 }) => {
  const [err, setErr] = useState(false);
  if (err) {
    return (
      <div
        className="bj-logo-fallback"
        style={{ width: size, height: size, background: color || '#3b82f6', fontSize: size * 0.4 }}
      >
        {company?.[0]?.toUpperCase()}
      </div>
    );
  }
  return (
    <img
      className="bj-logo-img"
      src={CLEARBIT(domain)}
      alt={company}
      width={size} height={size}
      onError={() => setErr(true)}
    />
  );
};

// ── Skill chip ────────────────────────────────────────────────────────────────
const SkillChip = ({ label }) => <span className="bj-skill-chip">{label}</span>;

// ── Job card ──────────────────────────────────────────────────────────────────
const JobCard = ({ job, onSelect, isSelected, onSave, isSaved }) => (
  <div
    className={`bj-card ${isSelected ? 'bj-card--active' : ''}`}
    onClick={() => onSelect(job)}
  >
    <div className="bj-card-top">
      <CompanyLogo domain={job.domain} company={job.company} color={job.companyColor} size={44} />
      <div className="bj-card-meta">
        <div className="bj-card-company">{job.company}</div>
        <div className="bj-card-role">{job.role}</div>
      </div>
      <button
        className={`bj-save-btn ${isSaved ? 'bj-save-btn--saved' : ''}`}
        onClick={(e) => { e.stopPropagation(); onSave(job); }}
        title={isSaved ? 'Saved' : 'Save job'}
      >
        {isSaved ? <MdBookmark size={18} /> : <MdBookmarkBorder size={18} />}
      </button>
    </div>

    <div className="bj-card-tags">
      <span className="bj-tag bj-tag--loc"><MdLocationOn size={12} />{job.location}</span>
      <span className="bj-tag bj-tag--cat">{job.category}</span>
      <span className="bj-tag bj-tag--exp">{job.exp}</span>
    </div>

    <div className="bj-card-salary">
      <MdAttachMoney size={14} />
      <span>{fmtSalary(job.salary)}</span>
      {job.salaryMax !== job.salary && <span className="bj-salary-sep">–</span>}
      {job.salaryMax !== job.salary && <span>{fmtSalary(job.salaryMax)}</span>}
    </div>

    <div className="bj-card-skills">
      {job.skills.slice(0, 3).map((s) => <SkillChip key={s} label={s} />)}
      {job.skills.length > 3 && <span className="bj-skill-more">+{job.skills.length - 3}</span>}
    </div>

    <div className="bj-card-footer">
      <span className="bj-posted"><MdAccessTime size={12} />{job.postedAgo}</span>
      <span className="bj-openings">{job.openings} opening{job.openings > 1 ? 's' : ''}</span>
    </div>
  </div>
);

// ── Detail Drawer ─────────────────────────────────────────────────────────────
const JobDetail = ({ job, onClose, onApply, isApplied, isSaved, onSave }) => {
  if (!job) return (
    <div className="bj-detail bj-detail--empty">
      <div className="bj-detail-empty-icon">🔍</div>
      <p>Select a job to see details</p>
    </div>
  );

  return (
    <div className="bj-detail">
      {/* Header */}
      <div className="bj-detail-header">
        <button className="bj-detail-close" onClick={onClose}><MdClose size={20} /></button>
        <div className="bj-detail-company-row">
          <CompanyLogo domain={job.domain} company={job.company} color={job.companyColor} size={56} />
          <div>
            <div className="bj-detail-company">{job.company}</div>
            <div className="bj-detail-role">{job.role}</div>
            <div className="bj-detail-rating">
              <MdStar size={14} color="#f59e0b" />
              <span>{job.rating}</span>
              <span className="bj-detail-rating-sep">·</span>
              <span>{job.openings} opening{job.openings > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="bj-detail-stats">
          {[
            { icon: <MdLocationOn size={15} />,   label: 'Location', val: job.location  },
            { icon: <MdAttachMoney size={15} />,  label: 'Salary',   val: `${fmtSalary(job.salary)} – ${fmtSalary(job.salaryMax)}` },
            { icon: <MdWork size={15} />,          label: 'Exp',      val: job.exp       },
            { icon: <MdBusiness size={15} />,      label: 'Platform', val: job.platform  },
          ].map((s) => (
            <div key={s.label} className="bj-detail-stat">
              <span className="bj-detail-stat-icon">{s.icon}</span>
              <div>
                <div className="bj-detail-stat-label">{s.label}</div>
                <div className="bj-detail-stat-val">{s.val}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bj-detail-cta">
          <button
            className={`bj-apply-btn ${isApplied ? 'bj-apply-btn--applied' : ''}`}
            onClick={() => onApply(job)}
            disabled={isApplied}
          >
            {isApplied
              ? <><MdCheckCircle size={16} /> Added to Applications</>
              : <><MdAddCircle size={16} /> Add to Applications</>}
          </button>
          <button
            className={`bj-save-detail-btn ${isSaved ? 'bj-save-detail-btn--saved' : ''}`}
            onClick={() => onSave(job)}
          >
            {isSaved ? <MdBookmark size={16} /> : <MdBookmarkBorder size={16} />}
            {isSaved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="bj-detail-body">
        {/* Skills */}
        <section className="bj-detail-section">
          <h4 className="bj-detail-section-title"><MdCode size={15} /> Required Skills</h4>
          <div className="bj-detail-skills">
            {job.skills.map((s) => <SkillChip key={s} label={s} />)}
          </div>
        </section>

        {/* About */}
        <section className="bj-detail-section">
          <h4 className="bj-detail-section-title"><MdTrendingUp size={15} /> About the Role</h4>
          <div className="bj-detail-desc">
            {job.fullDesc.split('\n').map((line, i) => {
              const trimmed = line.trim();
              if (!trimmed) return <br key={i} />;
              if (trimmed.startsWith('•')) return (
                <div key={i} className="bj-detail-bullet">{trimmed.slice(1).trim()}</div>
              );
              return <p key={i}>{trimmed}</p>;
            })}
          </div>
        </section>

        {/* Benefits */}
        <section className="bj-detail-section">
          <h4 className="bj-detail-section-title">🎁 Benefits</h4>
          <div className="bj-detail-benefits">
            {job.benefits.map((b) => (
              <div key={b} className="bj-benefit-item">
                <MdCheckCircle size={14} color="var(--accent-green)" /> {b}
              </div>
            ))}
          </div>
        </section>

        {/* Raw API data */}
        <section className="bj-detail-section">
          <h4 className="bj-detail-section-title">📦 Raw API Data (DummyJSON)</h4>
          <div className="bj-raw-data">
            <div className="bj-raw-row"><span>Product Title</span><span>{job._raw.title}</span></div>
            <div className="bj-raw-row"><span>Brand</span><span>{job._raw.brand || '—'}</span></div>
            <div className="bj-raw-row"><span>Price</span><span>${job._raw.price}</span></div>
            <div className="bj-raw-row"><span>Job ID</span><span>#{job.id}</span></div>
          </div>
        </section>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const BrowseJobs = () => {
  const { add, apps } = useApplications();

  const [jobs, setJobs]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [savedIds, setSavedIds]     = useState(new Set());
  const [search, setSearch]         = useState('');
  const [category, setCategory]     = useState('All');
  const [locFilter, setLocFilter]   = useState('');
  const [expFilter, setExpFilter]   = useState('');
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const PER_PAGE = 10;

  // Fetch from DummyJSON via Axios
  const fetchJobs = useCallback(async (pageNum = 1) => {
    setLoading(true);
    setError(null);
    try {
      const skip = (pageNum - 1) * PER_PAGE;
      const res  = await axios.get('https://dummyjson.com/products', {
        params: { limit: PER_PAGE, skip },
      });
      const mapped = res.data.products.map((p, i) => mapToJob(p, skip + i));
      setJobs(mapped);
      setTotalPages(Math.ceil(res.data.total / PER_PAGE));
      setSelectedJob(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchJobs(page); }, [page]);

  // Applied IDs from app context
  const appliedIds = useMemo(() => new Set(apps.map((a) => String(a.id))), [apps]);

  // Client-side filter on fetched page
  const filtered = useMemo(() => {
    let list = [...jobs];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((j) =>
        j.company.toLowerCase().includes(q) ||
        j.role.toLowerCase().includes(q) ||
        j.skills.some((s) => s.toLowerCase().includes(q))
      );
    }
    if (category !== 'All') list = list.filter((j) => j.category === category);
    if (locFilter)          list = list.filter((j) => j.location === locFilter);
    if (expFilter)          list = list.filter((j) => j.exp === expFilter);
    return list;
  }, [jobs, search, category, locFilter, expFilter]);

  const handleSave = (job) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(job.id)) { next.delete(job.id); toast.info(`Removed "${job.role}" from saved`); }
      else                  { next.add(job.id);    toast.success(`Saved "${job.role}"`); }
      return next;
    });
  };

  const handleApply = (job) => {
    if (appliedIds.has(String(job.id))) return;
    add({
      company:     job.company,
      domain:      job.domain,
      role:        job.role,
      status:      'Applied',
      platform:    job.platform,
      location:    job.location,
      salary:      job.salary,
      appliedDate: new Date().toISOString().split('T')[0],
      notes:       `Browsed from JobTrack · Skills: ${job.skills.join(', ')}`,
    });
    toast.success(`✓ Added ${job.company} – ${job.role} to Applications`);
  };

  const resetFilters = () => {
    setSearch(''); setCategory('All'); setLocFilter(''); setExpFilter('');
  };
  const hasFilters = search || category !== 'All' || locFilter || expFilter;

  return (
    <div className="bj-page anim-fadeUp">
      {/* ── Header ── */}
      <div className="bj-header">
        <div>
          <h1 className="page-title">Browse Jobs</h1>
          <p className="page-subtitle">
            {loading ? 'Fetching from DummyJSON API…' : `${filtered.length} jobs on this page · ${totalPages * PER_PAGE}+ total`}
          </p>
        </div>
        <div className="bj-header-actions">
          <button className="btn-ghost" onClick={() => fetchJobs(page)}>
            <MdRefresh size={15} /> Refresh
          </button>
          <button
            className={`btn-ghost ${showFilters ? 'bj-filter-active' : ''}`}
            onClick={() => setShowFilters((v) => !v)}
          >
            <MdFilterList size={15} />
            Filters {hasFilters && <span className="bj-filter-dot" />}
          </button>
        </div>
      </div>

      {/* ── Search ── */}
      <div className="bj-search-row">
        <div className="bj-search-wrap">
          <MdSearch size={18} className="bj-search-icon" />
          <input
            className="bj-search-input"
            placeholder="Search by role, company, or skill…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="bj-search-clear" onClick={() => setSearch('')}>
              <MdClose size={16} />
            </button>
          )}
        </div>
      </div>

      {/* ── Category tabs ── */}
      <div className="bj-cats">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`bj-cat-btn ${category === cat ? 'bj-cat-btn--active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Collapsible filters ── */}
      {showFilters && (
        <div className="bj-filters-panel anim-fadeUp">
          <div className="bj-filter-group">
            <label className="bj-filter-label">Location Type</label>
            <select className="bj-filter-select" value={locFilter} onChange={(e) => setLocFilter(e.target.value)}>
              <option value="">Any</option>
              {LOC_TYPES.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="bj-filter-group">
            <label className="bj-filter-label">Experience</label>
            <select className="bj-filter-select" value={expFilter} onChange={(e) => setExpFilter(e.target.value)}>
              <option value="">Any</option>
              {EXP_LEVELS.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          {hasFilters && (
            <button className="btn-ghost" onClick={resetFilters} style={{ alignSelf: 'flex-end' }}>
              <MdClose size={14} /> Clear All
            </button>
          )}
        </div>
      )}

      {/* ── Main Layout: list + detail ── */}
      <div className={`bj-layout ${selectedJob ? 'bj-layout--split' : ''}`}>
        {/* Job list */}
        <div className="bj-list">
          {error && (
            <div className="bj-error">
              ⚠ {error}
              <button className="btn-ghost" onClick={() => fetchJobs(page)}>Retry</button>
            </div>
          )}

          {loading ? (
            <div className="bj-loading-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bj-skeleton" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <h3>No jobs match your filters</h3>
                <p>Try clearing filters or searching something else</p>
                <button className="btn-ghost" onClick={resetFilters} style={{ marginTop: 12 }}>
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="bj-grid">
              {filtered.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onSelect={setSelectedJob}
                  isSelected={selectedJob?.id === job.id}
                  onSave={handleSave}
                  isSaved={savedIds.has(job.id)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && (
            <div className="bj-pagination">
              <button
                className="bj-page-btn"
                onClick={() => { setPage((p) => Math.max(1, p - 1)); }}
                disabled={page === 1}
              >
                <MdArrowBack size={16} /> Prev
              </button>
              <div className="bj-page-nums">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const n = Math.max(1, page - 2) + i;
                  if (n > totalPages) return null;
                  return (
                    <button
                      key={n}
                      className={`bj-page-num ${n === page ? 'bj-page-num--active' : ''}`}
                      onClick={() => setPage(n)}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
              <button
                className="bj-page-btn"
                onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); }}
                disabled={page === totalPages}
              >
                Next <MdArrowForward size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selectedJob && (
          <div className="bj-detail-panel">
            <JobDetail
              job={selectedJob}
              onClose={() => setSelectedJob(null)}
              onApply={handleApply}
              isApplied={appliedIds.has(String(selectedJob.id))}
              isSaved={savedIds.has(selectedJob.id)}
              onSave={handleSave}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseJobs;