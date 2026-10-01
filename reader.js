/* ============================================================
   INOREADER — reader.js   (full app logic)
   ============================================================ */

'use strict';

// ══════════════════════════════════════════
//  AUTH GUARD
// ══════════════════════════════════════════
const AUTH = {
  getSession: () => { try { return JSON.parse(localStorage.getItem('ino_session')); } catch { return null; } },
  clearSession: () => localStorage.removeItem('ino_session'),
  getUserData: () => { try { return JSON.parse(localStorage.getItem('ino_userdata') || '{}'); } catch { return {}; } },
  saveUserData: (d) => localStorage.setItem('ino_userdata', JSON.stringify(d)),
};

// If not logged in, redirect to login
const session = AUTH.getSession();
if (!session) { window.location.href = 'login.html'; }

// ══════════════════════════════════════════
//  SEED DATA — Feeds & Articles
// ══════════════════════════════════════════
const DEFAULT_FEEDS = [
  { id: 'f1', name: 'TechCrunch', url: 'techcrunch.com', color: '#00A2FF', emoji: '⚡', category: 'Tech' },
  { id: 'f2', name: 'The Verge', url: 'theverge.com', color: '#FF3B30', emoji: '🔺', category: 'Tech' },
  { id: 'f3', name: 'Hacker News', url: 'news.ycombinator.com', color: '#FF6600', emoji: '🟠', category: 'Tech' },
  { id: 'f4', name: 'MIT Tech Review', url: 'technologyreview.com', color: '#8B0000', emoji: '🔬', category: 'Science' },
  { id: 'f5', name: 'Bloomberg', url: 'bloomberg.com', color: '#2F5496', emoji: '📈', category: 'Finance' },
  { id: 'f6', name: 'NASA News', url: 'nasa.gov/news', color: '#0B3D91', emoji: '🚀', category: 'Science' },
];

const ARTICLE_TEMPLATES = [
  {
    feedId: 'f1', feedName: 'TechCrunch',
    title: "OpenAI's latest model sets new benchmarks in reasoning and code generation",
    excerpt: "The model demonstrates unprecedented performance across a range of standardized benchmarks, particularly in mathematical reasoning and software engineering tasks that previously stumped AI systems.",
    content: `<p>OpenAI has unveiled a new foundation model that has set new state-of-the-art benchmarks across numerous evaluation suites, marking what the company calls "a significant leap in reasoning capability."</p>
<h2>Key Improvements</h2>
<p>The model shows remarkable gains in areas that have historically been challenging for large language models:</p>
<ul>
<li>Mathematical reasoning: 94.2% accuracy on the MATH benchmark, up from 87.1%</li>
<li>Code generation: Passes 85% of competitive programming problems</li>
<li>Multi-step logical inference: Near-human performance on formal logic tasks</li>
</ul>
<p>Perhaps most striking is the model's ability to maintain coherence across extremely long contexts, something that has hampered previous generations of AI.</p>
<blockquote>"We're seeing emergent capabilities we didn't anticipate during training. The model is capable of solving problems we haven't explicitly trained it on." — OpenAI Research Lead</blockquote>
<h2>Safety Considerations</h2>
<p>Alongside the capability gains, OpenAI has outlined a series of new safety measures incorporated into the model's training pipeline, including constitutional AI techniques and expanded red-teaming exercises.</p>
<p>The company plans to roll out the model to API customers first, followed by a gradual consumer rollout over the coming weeks.</p>`,
    tags: ['AI', 'OpenAI', 'LLM'],
    readTime: 4,
    heroImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    daysAgo: 0,
  },
  {
    feedId: 'f2', feedName: 'The Verge',
    title: "Apple's M4 Ultra chip benchmarks leak ahead of Mac Pro announcement",
    excerpt: "Early results suggest performance gains of up to 40% over the previous generation, with memory bandwidth doubled for machine learning workloads.",
    content: `<p>Leaked benchmark results circulating across developer forums and hardware enthusiast communities suggest Apple's upcoming M4 Ultra chip delivers substantial gains over its predecessor in nearly every measurable metric.</p>
<h2>What the Numbers Say</h2>
<p>According to the leaked Geekbench and Cinebench scores, the M4 Ultra achieves:</p>
<ul>
<li>Single-core CPU: ~3,800 points (up ~22% from M3 Ultra)</li>
<li>Multi-core CPU: ~24,000 points (up ~38% from M3 Ultra)</li>
<li>Metal GPU score: Roughly double the M3 Ultra</li>
</ul>
<h2>Memory Architecture Changes</h2>
<p>Sources familiar with the matter suggest Apple has made significant changes to the memory subsystem, pushing unified memory bandwidth to nearly 800 GB/s — a critical spec for on-device AI inference workloads.</p>
<p>The new Mac Pro is expected to be announced at an event later this month, with configurations offering up to 192GB of unified memory at launch.</p>`,
    tags: ['Apple', 'Chips', 'Mac'],
    readTime: 3,
    heroImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    daysAgo: 0,
  },
  {
    feedId: 'f3', feedName: 'Hacker News',
    title: "Show HN: I built an open-source alternative to Notion using local-first sync",
    excerpt: "After two years of development, I'm releasing a fully open-source workspace tool that uses CRDTs for conflict-free real-time collaboration without a central server.",
    content: `<p>Two years ago I started building what I thought would be a weekend project. Today I'm shipping version 1.0 of an open-source, local-first workspace tool. Here's what I learned.</p>
<h2>Why Local-First?</h2>
<p>The core idea is simple: your data lives on your device first. Sync happens opportunistically, and conflict resolution is handled automatically using Conflict-free Replicated Data Types (CRDTs).</p>
<p>This means:</p>
<ul>
<li>The app works fully offline</li>
<li>You own your data, always</li>
<li>No vendor lock-in or subscription required</li>
<li>End-to-end encrypted sync if you choose to use it</li>
</ul>
<h2>The Technical Stack</h2>
<p>The core sync layer is written in Rust and compiled to WebAssembly, which runs in the browser, Electron, and mobile apps. The CRDT implementation is based on Automerge with several custom extensions for our document model.</p>
<blockquote>The hardest part wasn't the CRDTs — it was making the UX feel as snappy as a purely local app even when syncing hundreds of changes.</blockquote>
<p>The repository is on GitHub with an MIT license. Contributions welcome.</p>`,
    tags: ['Open Source', 'Productivity', 'Local-First'],
    readTime: 6,
    heroImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    daysAgo: 1,
  },
  {
    feedId: 'f4', feedName: 'MIT Tech Review',
    title: "A new approach to quantum error correction could make practical quantum computers viable by 2028",
    excerpt: "Researchers at MIT and Google Quantum AI have demonstrated a surface code implementation that achieves error rates below the fault-tolerance threshold using just 72 physical qubits.",
    content: `<p>For decades, the path to practical quantum computing has been blocked by a fundamental problem: quantum systems are exquisitely sensitive to environmental disturbances, causing calculations to fail.</p>
<p>Now, a joint team from MIT and Google Quantum AI has published results in <em>Nature</em> that could change that picture dramatically.</p>
<h2>The Breakthrough</h2>
<p>The team demonstrated a surface code quantum error correction scheme that achieves logical error rates of 10⁻⁶ per cycle — well below the 1% threshold typically required for fault-tolerant quantum computation — using only 72 physical qubits per logical qubit.</p>
<p>Previous implementations required several hundred to thousands of physical qubits to achieve the same reliability.</p>
<h2>Why This Matters</h2>
<p>Current quantum computers, like IBM's 1000+ qubit systems, are considered "noisy intermediate-scale quantum" (NISQ) devices — powerful enough for research, but too error-prone for practical applications like drug discovery or cryptography.</p>
<p>If this error correction technique scales as expected, it could make quantum advantage in real-world tasks possible within 3-5 years, researchers say.</p>`,
    tags: ['Quantum', 'Research', 'Computing'],
    readTime: 7,
    heroImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
    daysAgo: 1,
  },
  {
    feedId: 'f5', feedName: 'Bloomberg',
    title: "Global venture capital funding rebounds 28% in Q3 as AI deals dominate",
    excerpt: "AI-focused companies captured 42% of all venture dollars deployed globally in the third quarter, with late-stage rounds for infrastructure plays accounting for the lion's share.",
    content: `<p>Global venture capital investment climbed to $89.4 billion in the third quarter, a 28% increase year-over-year, with artificial intelligence companies accounting for the overwhelming majority of large rounds, according to data from PitchBook.</p>
<h2>Where the Money Is Going</h2>
<p>The breakdown of AI investment reveals a maturing sector:</p>
<ul>
<li><strong>Foundation model companies:</strong> $21.3B (mostly late-stage)</li>
<li><strong>AI infrastructure & compute:</strong> $18.7B</li>
<li><strong>Vertical AI applications:</strong> $14.1B</li>
<li><strong>AI-enabled SaaS:</strong> $8.9B</li>
</ul>
<p>The largest single round of the quarter was a $6.6B investment into a compute infrastructure startup, reflecting investors' bets on the continued scaling of AI training workloads.</p>
<h2>Geographic Shifts</h2>
<p>The United States maintained its dominance at 52% of global deal value, but Southeast Asia and the Middle East saw notable upticks as sovereign wealth funds accelerated their technology mandates.</p>`,
    tags: ['VC', 'Finance', 'AI'],
    readTime: 5,
    heroImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    daysAgo: 2,
  },
  {
    feedId: 'f6', feedName: 'NASA News',
    title: "James Webb Space Telescope captures earliest galaxy ever observed, just 280 million years after the Big Bang",
    excerpt: "The galaxy, designated JADES-GS-z14-0, is unexpectedly bright and large for its age, challenging existing models of how galaxies formed in the early universe.",
    content: `<p>Astronomers using the James Webb Space Telescope have confirmed the most distant galaxy ever observed — a surprisingly bright and structured object that existed when the universe was only 280 million years old.</p>
<h2>A Surprisingly Mature Galaxy</h2>
<p>What makes JADES-GS-z14-0 particularly puzzling is not just its age, but its size and luminosity. The galaxy contains more than 400 million solar masses worth of stars — far more than astronomers expected to find so early in cosmic history.</p>
<p>"According to our current models of galaxy formation, you simply shouldn't have this much stellar mass this early," said Dr. Emma Robertson, the study's lead author. "It suggests either our models are wrong, or there's a population of very massive, very early galaxies we hadn't anticipated."</p>
<h2>What This Means for Cosmology</h2>
<p>The discovery adds to a growing body of JWST observations that are challenging the Lambda-CDM model of cosmology, which describes how matter clumped together after the Big Bang to form the structures we see today.</p>
<p>Researchers are now analyzing spectroscopic data from the galaxy to determine its chemical composition, which could provide additional clues about its formation history.</p>`,
    tags: ['Space', 'JWST', 'Cosmology'],
    readTime: 5,
    heroImage: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80',
    daysAgo: 2,
  },
  {
    feedId: 'f1', feedName: 'TechCrunch',
    title: "Stripe acquires stablecoin startup Bridge for $1.1B in largest crypto acquisition of the year",
    excerpt: "The deal signals Stripe's renewed commitment to crypto payments infrastructure after a period of stepping back from the space during the 2022 downturn.",
    content: `<p>Stripe has agreed to acquire Bridge, a stablecoin infrastructure startup, in a deal valued at approximately $1.1 billion — marking the largest acquisition in the cryptocurrency space so far this year.</p>
<h2>What Bridge Does</h2>
<p>Bridge provides APIs that allow businesses to issue, manage, and transfer stablecoins across multiple blockchains. Its platform abstracts away the complexity of working with different networks, presenting a unified interface similar to how Stripe itself abstracts card payment rails.</p>
<h2>Strategic Rationale</h2>
<p>The acquisition signals a significant reversal for Stripe, which had wound down its crypto payment product in 2022 amid the broader market downturn. The company appears to be betting that dollar-pegged stablecoins represent the most realistic near-term use case for blockchain technology in payments.</p>
<blockquote>"Stablecoins are a genuinely better way to move money internationally. We've been watching this space carefully for years and believe the timing is right." — Patrick Collison, Stripe CEO</blockquote>`,
    tags: ['Fintech', 'Crypto', 'M&A'],
    readTime: 4,
    heroImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80',
    daysAgo: 3,
  },
  {
    feedId: 'f2', feedName: 'The Verge',
    title: "Sony announces PlayStation 6 for holiday 2026 with AI-upscaling and 8K support",
    excerpt: "The next-generation console uses a custom AMD GPU with integrated neural processing units to enable real-time ray tracing at 4K/120fps as its baseline target.",
    content: `<p>Sony has officially announced the PlayStation 6, confirming a holiday 2026 release window and revealing key technical specifications for the first time.</p>
<h2>The Specs</h2>
<p>The PS6 is built around a custom AMD chip that integrates dedicated neural processing units alongside the GPU, enabling what Sony calls "PlayStation Spectral Super Resolution" — its proprietary AI upscaling technology.</p>
<ul>
<li>Target frame rate: 4K/120fps (upscaled to 8K/60fps on compatible displays)</li>
<li>Storage: 2TB NVMe SSD with ~11 GB/s transfer speeds</li>
<li>Memory: 28GB GDDR7 unified pool</li>
<li>Backward compatibility: All PS4 and PS5 titles</li>
</ul>
<h2>The Controller</h2>
<p>The DualSense 2 controller retains haptic feedback and adaptive triggers but adds a redesigned grip, a built-in microphone array, and a dedicated AI button that activates PlayStation's voice assistant.</p>`,
    tags: ['Gaming', 'Sony', 'PlayStation'],
    readTime: 4,
    heroImage: 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=800&q=80',
    daysAgo: 3,
  },
  {
    feedId: 'f3', feedName: 'Hacker News',
    title: "Ask HN: What's your current tech stack for personal projects in 2026?",
    excerpt: "A discussion thread exploring how developer preferences have shifted, with particular interest in the rise of TypeScript, Rust, and local-first architectures.",
    content: `<p>This popular Ask HN thread drew hundreds of responses from developers sharing what they're building with in 2026. Here's a summary of the major trends:</p>
<h2>Frontend</h2>
<p>React remains dominant, but there's notable momentum behind Svelte and SolidJS for projects where bundle size and performance are priorities. TypeScript adoption is near-universal — the conversation has shifted from "should I use TypeScript?" to "what tsconfig settings do you use?"</p>
<h2>Backend</h2>
<p>Go and Rust are increasingly popular for services where performance matters. Python maintains a stronghold in data pipelines and ML-adjacent projects. Many respondents are running serverless-first architectures using platforms like Cloudflare Workers or Deno Deploy.</p>
<h2>Databases</h2>
<p>SQLite is having an unexpected renaissance for small-to-medium applications, often accessed through Turso (distributed SQLite) or simply embedded in the application process. PostgreSQL remains the default for anything requiring more.</p>
<blockquote>The theme running through most responses: fewer moving parts, more boring technology, local-first where possible.</blockquote>`,
    tags: ['Dev', 'Community', 'Tech Stack'],
    readTime: 5,
    heroImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
    daysAgo: 4,
  },
  {
    feedId: 'f4', feedName: 'MIT Tech Review',
    title: "Brain-computer interfaces achieve 'typing at thought speed' for the first time",
    excerpt: "A new BCI system from Synchron decoded intended keystrokes from motor cortex signals at speeds exceeding 90 words per minute with 99.2% accuracy in three paralyzed patients.",
    content: `<p>For the first time, a brain-computer interface has enabled a paralyzed patient to communicate at speeds comparable to typical smartphone typing, according to results published in <em>Science</em>.</p>
<h2>The Study</h2>
<p>Three participants with amyotrophic lateral sclerosis (ALS) used Synchron's Stentrode device — a minimally invasive BCI that's implanted via the jugular vein and sits inside a blood vessel near the motor cortex — to type using imagined finger movements.</p>
<p>The system achieved:</p>
<ul>
<li>Mean typing speed: 93 words per minute</li>
<li>Accuracy: 99.2% (with autocorrect assistance)</li>
<li>Latency: Under 50 milliseconds from intention to character display</li>
</ul>
<h2>How It Works</h2>
<p>Rather than decoding arbitrary neural patterns, the system maps imagined single finger presses to specific characters. A large language model running on a paired device provides real-time next-word prediction, dramatically accelerating text entry.</p>`,
    tags: ['BCI', 'Neuroscience', 'Medical'],
    readTime: 6,
    heroImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
    daysAgo: 5,
  },
];

const SUGGESTED_FEEDS_CATALOG = [
  { id: 'sf1', name: 'Wired', url: 'wired.com', color: '#B20000', emoji: '⚡', category: 'Tech' },
  { id: 'sf2', name: 'Ars Technica', url: 'arstechnica.com', color: '#FF4E00', emoji: '🖥', category: 'Tech' },
  { id: 'sf3', name: 'Nature', url: 'nature.com', color: '#009900', emoji: '🌿', category: 'Science' },
  { id: 'sf4', name: 'Reuters', url: 'reuters.com', color: '#CC0000', emoji: '📰', category: 'News' },
  { id: 'sf5', name: 'The Economist', url: 'economist.com', color: '#E3120B', emoji: '📊', category: 'Finance' },
  { id: 'sf6', name: 'Daring Fireball', url: 'daringfireball.net', color: '#333', emoji: '⭐', category: 'Tech' },
];

const AI_SUMMARIES = {
  'f1': ['This article covers a major development in the AI/tech space.', '• Key point: Significant performance or strategic milestone achieved\n• Industry impact: Likely to influence competitors and market dynamics\n• What to watch: Follow-up announcements expected within 30 days'],
  'f2': ['Hardware or product announcement with competitive implications.', '• Spec comparison: Improvements range from 22–40% over previous generation\n• Market timing: Positioned against direct competitors\n• Consumer impact: Availability and pricing details to follow'],
  'f3': ['Community discussion or developer project gaining traction.', '• Core thesis: Open-source or local-first approach to common problem\n• Reception: Strong community interest with actionable technical details\n• Technical merit: Solid engineering with reproducible results reported'],
  'f4': ['Peer-reviewed research with potential long-term implications.', '• Methodology: Rigorous experimental setup with statistically significant results\n• Significance: Could advance the field by 3-5 years if replicated\n• Limitations: Small sample size; further validation needed at scale'],
  'f5': ['Financial or market analysis with investment implications.', '• Macro trend: Sector consolidation continuing; AI remains dominant\n• Numbers: Key metrics show 20-40% growth vs prior comparable period\n• Risk factors: Regulatory environment and interest rates remain headwinds'],
  'f6': ['Scientific discovery with implications for our understanding of the cosmos.', '• Discovery: New observation challenges or refines existing theoretical models\n• Method: Data collected from next-generation observational instruments\n• Next steps: Follow-up studies planned; peer review process underway'],
};

// ══════════════════════════════════════════
//  STATE
// ══════════════════════════════════════════
let state = {
  feeds: [],
  articles: [],
  currentView: 'all',
  currentFeedId: null,
  selectedArticleId: null,
  viewMode: 'list',
  sortOrder: 'newest',
  searchQuery: '',
  fontSize: 16,
  readerFont: 'inter',
  sidebarCollapsed: false,
  darkMode: false,
  compactMode: false,
  preferences: {},
};

// Load from localStorage or use defaults
function loadState() {
  const saved = AUTH.getUserData();
  state.feeds = saved.feeds || [...DEFAULT_FEEDS];
  state.darkMode = saved.darkMode || false;
  state.compactMode = saved.compactMode || false;
  state.readerFont = saved.readerFont || 'inter';
  state.fontSize = saved.fontSize || 16;
  state.sidebarCollapsed = saved.sidebarCollapsed || false;

  // Build articles from templates, assign ids and read/star/save state
  state.articles = ARTICLE_TEMPLATES.map((t, i) => {
    const savedArt = (saved.articleStates || {})[`a${i}`] || {};
    return {
      ...t,
      id: `a${i}`,
      read: savedArt.read || false,
      starred: savedArt.starred || false,
      savedLater: savedArt.savedLater || false,
      date: new Date(Date.now() - t.daysAgo * 86400000 - Math.random() * 18000000),
    };
  });
}

function persistState() {
  const articleStates = {};
  state.articles.forEach(a => {
    articleStates[a.id] = { read: a.read, starred: a.starred, savedLater: a.savedLater };
  });
  AUTH.saveUserData({
    feeds: state.feeds,
    darkMode: state.darkMode,
    compactMode: state.compactMode,
    readerFont: state.readerFont,
    fontSize: state.fontSize,
    sidebarCollapsed: state.sidebarCollapsed,
    articleStates,
  });
}

// ══════════════════════════════════════════
//  DOM REFS
// ══════════════════════════════════════════
const $ = (id) => document.getElementById(id);
const appShell = $('app-shell');
const sidebar = $('sidebar');
const feedsNav = $('feeds-nav');
const articlesContainer = $('articles-container');
const emptyState = $('empty-state');
const panelTitle = $('panel-title');
const panelCount = $('panel-count');
const readerPlaceholder = $('reader-placeholder');
const readerContent = $('reader-content');
const readerBody = $('reader-body');

// ══════════════════════════════════════════
//  TOAST
// ══════════════════════════════════════════
function showToast(msg, icon = 'ℹ️') {
  const container = $('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${msg}</span>`;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, 3000);
}

// ══════════════════════════════════════════
//  RENDER: USER INFO
// ══════════════════════════════════════════
function renderUser() {
  if (!session) return;
  $('user-avatar').textContent = session.avatar || session.name?.[0] || 'U';
  $('user-name').textContent = session.name || session.username || session.email || 'User';
  $('user-plan').textContent = session.plan === 'pro_trial' ? '⭐ Pro Trial' : session.plan === 'pro' ? '⭐ Pro' : 'Free';
}

// ══════════════════════════════════════════
//  RENDER: SIDEBAR FEEDS
// ══════════════════════════════════════════
function renderFeedsSidebar() {
  feedsNav.innerHTML = '';
  const searchQ = $('sidebar-search-input').value.toLowerCase();

  state.feeds
    .filter(f => !searchQ || f.name.toLowerCase().includes(searchQ))
    .forEach(feed => {
      const unread = state.articles.filter(a => a.feedId === feed.id && !a.read).length;
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.className = 'sidebar-nav-item' + (state.currentFeedId === feed.id && state.currentView === 'feed' ? ' active' : '');
      btn.dataset.feedId = feed.id;
      btn.innerHTML = `
        <div class="feed-item-dot" style="background:${feed.color}">${feed.emoji}</div>
        <span>${feed.name}</span>
        ${unread > 0 ? `<span class="nav-badge has-count">${unread}</span>` : `<span class="nav-badge">0</span>`}
      `;
      btn.addEventListener('click', () => selectFeed(feed.id));
      li.appendChild(btn);
      feedsNav.appendChild(li);
    });
}

// ══════════════════════════════════════════
//  RENDER: BADGE COUNTS
// ══════════════════════════════════════════
function updateBadges() {
  const all = state.articles.length;
  const unread = state.articles.filter(a => !a.read).length;
  const starred = state.articles.filter(a => a.starred).length;
  const savedLater = state.articles.filter(a => a.savedLater).length;

  $('badge-all').textContent = all;
  $('badge-all').className = 'nav-badge' + (all > 0 ? ' has-count' : '');
  $('badge-unread').textContent = unread;
  $('badge-unread').className = 'nav-badge' + (unread > 0 ? ' has-count' : '');
  $('badge-starred').textContent = starred;
  $('badge-starred').className = 'nav-badge' + (starred > 0 ? ' has-count' : '');
  $('badge-read-later').textContent = savedLater;
  $('badge-read-later').className = 'nav-badge' + (savedLater > 0 ? ' has-count' : '');
}

// ══════════════════════════════════════════
//  GET FILTERED ARTICLES
// ══════════════════════════════════════════
function getFilteredArticles() {
  let articles = [...state.articles];

  // View filter
  if (state.currentView === 'unread') articles = articles.filter(a => !a.read);
  else if (state.currentView === 'starred') articles = articles.filter(a => a.starred);
  else if (state.currentView === 'read-later') articles = articles.filter(a => a.savedLater);
  else if (state.currentView === 'feed') articles = articles.filter(a => a.feedId === state.currentFeedId);

  // Sort filter
  if ($('sort-select').value === 'unread') articles = articles.filter(a => !a.read);

  // Search
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    articles = articles.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.feedName.toLowerCase().includes(q) ||
      (a.excerpt || '').toLowerCase().includes(q)
    );
  }

  // Sort
  articles.sort((a, b) => {
    const order = $('sort-select').value;
    if (order === 'oldest') return a.date - b.date;
    return b.date - a.date;
  });

  return articles;
}

// ══════════════════════════════════════════
//  RENDER: ARTICLE LIST
// ══════════════════════════════════════════
function formatDate(date) {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
}

function renderArticleList() {
  const articles = getFilteredArticles();

  // Panel title
  const titles = { all: 'All Items', unread: 'Unread', starred: 'Starred', 'read-later': 'Read Later' };
  if (state.currentView === 'feed') {
    const feed = state.feeds.find(f => f.id === state.currentFeedId);
    panelTitle.textContent = feed ? feed.name : 'Feed';
  } else {
    panelTitle.textContent = titles[state.currentView] || 'All Items';
  }
  panelCount.textContent = `${articles.length} article${articles.length !== 1 ? 's' : ''}`;

  // Clear container
  articlesContainer.innerHTML = '';
  articlesContainer.className = 'articles-container';
  if (state.viewMode === 'card') articlesContainer.classList.add('card-view');
  if (state.viewMode === 'magazine') articlesContainer.classList.add('magazine-view');

  if (articles.length === 0) {
    emptyState.style.display = 'flex';
    const msgs = {
      unread: 'No unread articles — all caught up! ✓',
      starred: 'No starred articles yet. Click ★ on any article.',
      'read-later': 'Your reading list is empty.',
    };
    $('empty-state-msg').textContent = msgs[state.currentView] || 'No articles match your filter.';
    return;
  }
  emptyState.style.display = 'none';

  articles.forEach(article => {
    const feed = state.feeds.find(f => f.id === article.feedId);
    const item = document.createElement('div');
    item.className = 'article-item' + (article.read ? ' read' : '') + (state.selectedArticleId === article.id ? ' selected' : '');
    item.dataset.id = article.id;

    const hasImage = article.heroImage;
    const thumbHtml = state.viewMode !== 'magazine'
      ? (hasImage
        ? `<img class="article-item-thumb" src="${article.heroImage}" alt="" loading="lazy" onerror="this.style.display='none'">`
        : `<div class="article-item-thumb-placeholder" style="background:${feed?.color}22">${feed?.emoji || '📰'}</div>`)
      : '';

    const magazineThumb = state.viewMode === 'magazine'
      ? (hasImage
        ? `<img class="article-item-thumb" src="${article.heroImage}" alt="" loading="lazy" onerror="this.style.display='none'">`
        : `<div class="article-item-thumb-placeholder" style="background:${feed?.color}22">${feed?.emoji || '📰'}</div>`)
      : '';

    item.innerHTML = `
      ${!article.read ? '<div class="unread-dot"></div>' : ''}
      ${thumbHtml}
      <div class="article-item-body">
        <div class="article-item-source">
          <span class="source-dot" style="background:${feed?.color || '#1875F3'}"></span>
          ${article.feedName}
        </div>
        <div class="article-item-title">${article.title}</div>
        <div class="article-item-meta">
          <span>${formatDate(article.date)}</span>
          <span>·</span>
          <span>${article.readTime} min read</span>
          ${article.starred ? '<span>·</span><span>⭐</span>' : ''}
          ${article.savedLater ? '<span>·</span><span>🔖</span>' : ''}
        </div>
      </div>
      ${magazineThumb}
      <div class="article-item-actions">
        <button class="article-item-action-btn ${article.starred ? 'starred' : ''}" data-action="star" title="Star">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="${article.starred ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </button>
        <button class="article-item-action-btn ${article.savedLater ? 'saved' : ''}" data-action="save" title="Read later">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="${article.savedLater ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
        </button>
        <button class="article-item-action-btn" data-action="mark-read" title="${article.read ? 'Mark unread' : 'Mark read'}">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        </button>
      </div>
    `;

    // Article click — open reader
    item.addEventListener('click', (e) => {
      if (e.target.closest('[data-action]')) return;
      selectArticle(article.id);
    });

    // Action buttons
    item.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleArticleAction(article.id, btn.dataset.action);
      });
    });

    articlesContainer.appendChild(item);
  });
}

// ══════════════════════════════════════════
//  ARTICLE ACTIONS
// ══════════════════════════════════════════
function handleArticleAction(id, action) {
  const article = state.articles.find(a => a.id === id);
  if (!article) return;

  if (action === 'star') {
    article.starred = !article.starred;
    showToast(article.starred ? 'Article starred' : 'Star removed', article.starred ? '⭐' : '✕');
  } else if (action === 'save') {
    article.savedLater = !article.savedLater;
    showToast(article.savedLater ? 'Saved for later' : 'Removed from reading list', article.savedLater ? '🔖' : '✕');
  } else if (action === 'mark-read') {
    article.read = !article.read;
    showToast(article.read ? 'Marked as read' : 'Marked as unread', '✓');
  }

  persistState();
  renderArticleList();
  updateBadges();
  renderFeedsSidebar();
  if (state.selectedArticleId === id) updateReaderToolbar();
}

// ══════════════════════════════════════════
//  SELECT ARTICLE
// ══════════════════════════════════════════
function selectArticle(id) {
  state.selectedArticleId = id;
  const article = state.articles.find(a => a.id === id);
  if (!article) return;

  // Mark as read
  if (!article.read) {
    article.read = true;
    persistState();
    updateBadges();
    renderFeedsSidebar();
  }

  // Update selected state in list
  document.querySelectorAll('.article-item').forEach(el => {
    el.classList.toggle('selected', el.dataset.id === id);
    if (el.dataset.id === id) el.classList.add('read');
  });

  // Render reader
  renderReader(article);
}

// ══════════════════════════════════════════
//  RENDER: READER
// ══════════════════════════════════════════
function renderReader(article) {
  const feed = state.feeds.find(f => f.id === article.feedId);

  readerPlaceholder.style.display = 'none';
  readerContent.style.display = 'flex';

  // Feed tag
  $('reader-feed-tag').textContent = article.feedName;
  $('reader-feed-tag').style.background = `${feed?.color}20`;
  $('reader-feed-tag').style.color = feed?.color || '#1875F3';

  // Source / date / read time
  $('reader-source').textContent = article.feedName;
  $('reader-date').textContent = article.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  $('reader-read-time').textContent = `${article.readTime} min read`;

  // Title
  $('reader-title').textContent = article.title;

  // Tags
  const tagsEl = $('reader-tags');
  tagsEl.innerHTML = (article.tags || []).map(t => `<span class="reader-tag">${t}</span>`).join('');

  // Hero image
  const heroWrap = $('reader-hero-img-wrap');
  heroWrap.innerHTML = article.heroImage
    ? `<img src="${article.heroImage}" alt="${article.title}" loading="lazy" onerror="this.parentNode.style.display='none'">`
    : '';

  // Content
  $('reader-article-content').innerHTML = article.content || `<p>${article.excerpt}</p>`;

  // Apply font & size
  applyReaderFont();

  // Hide AI card
  $('ai-summary-card').classList.remove('show');

  // Toolbar
  updateReaderToolbar();

  // Open on mobile
  document.getElementById('article-reader-panel').classList.add('mobile-open');

  // Scroll reader to top
  readerBody.scrollTop = 0;
}

function updateReaderToolbar() {
  const article = state.articles.find(a => a.id === state.selectedArticleId);
  if (!article) return;

  const starBtn = $('reader-star-btn');
  starBtn.classList.toggle('active', article.starred);
  starBtn.title = article.starred ? 'Unstar (S)' : 'Star (S)';

  const saveBtn = $('reader-save-btn');
  saveBtn.classList.toggle('saved-active', article.savedLater);
  saveBtn.title = article.savedLater ? 'Remove from read later (B)' : 'Save for later (B)';
}

// ══════════════════════════════════════════
//  VIEW & SORT
// ══════════════════════════════════════════
function selectView(viewName) {
  state.currentView = viewName;
  state.currentFeedId = null;
  state.selectedArticleId = null;

  // Update nav active states
  document.querySelectorAll('#smart-nav .sidebar-nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.view === viewName);
  });
  document.querySelectorAll('#feeds-nav .sidebar-nav-item').forEach(el => el.classList.remove('active'));

  readerPlaceholder.style.display = 'flex';
  readerContent.style.display = 'none';
  document.getElementById('article-reader-panel').classList.remove('mobile-open');

  renderArticleList();
}

function selectFeed(feedId) {
  state.currentView = 'feed';
  state.currentFeedId = feedId;
  state.selectedArticleId = null;

  document.querySelectorAll('#smart-nav .sidebar-nav-item').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('#feeds-nav .sidebar-nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.feedId === feedId);
  });

  readerPlaceholder.style.display = 'flex';
  readerContent.style.display = 'none';
  document.getElementById('article-reader-panel').classList.remove('mobile-open');

  renderArticleList();
}

// ══════════════════════════════════════════
//  READER FONT
// ══════════════════════════════════════════
function applyReaderFont() {
  const fontMap = { inter: "'Inter', sans-serif", merriweather: "'Merriweather', serif" };
  document.documentElement.style.setProperty('--reader-font', fontMap[state.readerFont] || fontMap.inter);
  document.documentElement.style.setProperty('--reader-font-size', state.fontSize + 'px');
}

// ══════════════════════════════════════════
//  DARK MODE
// ══════════════════════════════════════════
function setDarkMode(on) {
  state.darkMode = on;
  document.body.classList.toggle('dark', on);
  $('pref-dark-mode').checked = on;
  persistState();
}

// ══════════════════════════════════════════
//  ADD FEED MODAL
// ══════════════════════════════════════════
function openAddFeed() {
  $('add-feed-modal').classList.add('active');
  $('add-feed-input').focus();
  renderSuggestedFeeds();
}
function closeAddFeed() {
  $('add-feed-modal').classList.remove('active');
  $('add-feed-input').value = '';
}

function renderSuggestedFeeds() {
  const list = $('suggested-list');
  list.innerHTML = '';
  SUGGESTED_FEEDS_CATALOG.forEach(sf => {
    const isAdded = state.feeds.some(f => f.id === sf.id || f.url === sf.url);
    const div = document.createElement('div');
    div.className = 'suggested-feed-item' + (isAdded ? ' already-added' : '');
    div.innerHTML = `
      <div class="suggested-feed-icon" style="background:${sf.color}18; color:${sf.color}; font-size:1.1rem;">${sf.emoji}</div>
      <div class="suggested-feed-info">
        <div class="suggested-feed-name">${sf.name}</div>
        <div class="suggested-feed-url">${sf.url}</div>
      </div>
      <svg class="suggested-feed-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
    `;
    if (!isAdded) {
      div.addEventListener('click', () => {
        $('add-feed-input').value = sf.url;
        $('add-feed-input').focus();
      });
    }
    list.appendChild(div);
  });
}

function addFeed(urlOrName) {
  const query = urlOrName.trim();
  if (!query) return;

  // Check catalog first
  const catalogFeed = SUGGESTED_FEEDS_CATALOG.find(sf =>
    sf.url.includes(query) || sf.name.toLowerCase().includes(query.toLowerCase())
  );

  const alreadyAdded = catalogFeed && state.feeds.some(f => f.id === catalogFeed.id);
  if (alreadyAdded) { showToast('Already subscribed to this feed', '⚠️'); return; }

  let newFeed;
  if (catalogFeed) {
    newFeed = { ...catalogFeed };
  } else {
    const name = query.replace(/https?:\/\//i, '').split('/')[0];
    newFeed = {
      id: 'custom_' + Date.now(),
      name: name.charAt(0).toUpperCase() + name.slice(1),
      url: query,
      color: '#' + Math.floor(Math.random()*0xffffff).toString(16).padStart(6,'0'),
      emoji: '📡',
      category: 'Custom',
    };
  }

  state.feeds.push(newFeed);

  // Add a demo article for new feed
  state.articles.unshift({
    id: 'new_' + Date.now(),
    feedId: newFeed.id,
    feedName: newFeed.name,
    title: `Latest from ${newFeed.name}`,
    excerpt: `You've subscribed to ${newFeed.name}. New articles will appear here.`,
    content: `<p>Welcome to your ${newFeed.name} feed! In a real RSS reader, articles from this feed would appear here automatically as soon as they're published.</p><p>This is a demo article to confirm your subscription is working.</p>`,
    tags: [newFeed.category || 'News'],
    readTime: 1,
    heroImage: null,
    daysAgo: 0,
    date: new Date(),
    read: false,
    starred: false,
    savedLater: false,
  });

  persistState();
  renderFeedsSidebar();
  updateBadges();
  renderArticleList();
  closeAddFeed();
  showToast(`Subscribed to ${newFeed.name}`, '✅');
}

// ══════════════════════════════════════════
//  PREFERENCES MODAL
// ══════════════════════════════════════════
function openPreferences() {
  $('pref-dark-mode').checked = state.darkMode;
  $('pref-compact').checked = state.compactMode;
  document.querySelector(`input[name="font"][value="${state.readerFont}"]`).checked = true;
  $('preferences-modal').classList.add('active');
}
function closePreferences() { $('preferences-modal').classList.remove('active'); }

// ══════════════════════════════════════════
//  AI SUMMARY
// ══════════════════════════════════════════
function generateSummary(article) {
  const summaryData = AI_SUMMARIES[article.feedId] || ['This article covers an important development in its field.', '• Key insight extracted from the content\n• Secondary finding with supporting evidence\n• Recommended action or next steps to follow'];
  const [intro, bullets] = summaryData;

  const html = `
    <p style="margin-bottom:12px;">${intro}</p>
    <ul style="padding-left:18px;">
      ${bullets.split('\n').map(b => b.trim()).filter(Boolean).map(b => `<li style="margin-bottom:8px;">${b.replace(/^•\s*/, '')}</li>`).join('')}
    </ul>
    <p style="margin-top:12px;font-size:0.78rem;opacity:.5;">Generated by Inoreader Intelligence · ${new Date().toLocaleTimeString()}</p>
  `;
  return html;
}

// ══════════════════════════════════════════
//  KEYBOARD SHORTCUTS
// ══════════════════════════════════════════
function navigateArticle(direction) {
  const articles = getFilteredArticles();
  const idx = articles.findIndex(a => a.id === state.selectedArticleId);
  let nextIdx = direction === 'next' ? idx + 1 : idx - 1;
  if (nextIdx < 0) nextIdx = articles.length - 1;
  if (nextIdx >= articles.length) nextIdx = 0;
  if (articles[nextIdx]) selectArticle(articles[nextIdx].id);
}

document.addEventListener('keydown', (e) => {
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
  const article = state.articles.find(a => a.id === state.selectedArticleId);

  switch(e.key.toLowerCase()) {
    case 'j': navigateArticle('next'); break;
    case 'k': navigateArticle('prev'); break;
    case 's':
      if (article) handleArticleAction(article.id, 'star');
      break;
    case 'b':
      if (article) handleArticleAction(article.id, 'save');
      break;
    case 'm':
      if (article) handleArticleAction(article.id, 'mark-read');
      break;
    case 'escape':
      $('add-feed-modal').classList.remove('active');
      $('preferences-modal').classList.remove('active');
      document.getElementById('article-reader-panel').classList.remove('mobile-open');
      break;
    case 'f': case '/':
      e.preventDefault();
      $('sidebar-search-input').focus();
      break;
  }
});

// ══════════════════════════════════════════
//  EVENT LISTENERS
// ══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  renderUser();
  renderFeedsSidebar();
  updateBadges();
  renderArticleList();
  applyReaderFont();

  if (state.darkMode) document.body.classList.add('dark');
  if (state.compactMode) document.body.classList.add('compact');
  if (state.sidebarCollapsed) appShell.classList.add('sidebar-collapsed');

  // ── Smart nav ──
  document.querySelectorAll('#smart-nav .sidebar-nav-item').forEach(btn => {
    btn.addEventListener('click', () => selectView(btn.dataset.view));
  });

  // ── Sidebar search ──
  $('sidebar-search-input').addEventListener('input', renderFeedsSidebar);

  // ── Sidebar collapse ──
  $('sidebar-collapse').addEventListener('click', () => {
    state.sidebarCollapsed = !state.sidebarCollapsed;
    appShell.classList.toggle('sidebar-collapsed', state.sidebarCollapsed);
    persistState();
  });

  // ── View mode toggles ──
  document.querySelectorAll('.view-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.viewMode = btn.dataset.viewMode;
      document.querySelectorAll('.view-toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderArticleList();
    });
  });

  // ── Sort ──
  $('sort-select').addEventListener('change', renderArticleList);

  // ── Mark all read ──
  $('mark-all-read-btn').addEventListener('click', () => {
    const articles = getFilteredArticles();
    articles.forEach(a => { a.read = true; });
    persistState();
    renderArticleList();
    updateBadges();
    renderFeedsSidebar();
    showToast(`Marked ${articles.length} articles as read`, '✓');
  });

  // ── Refresh ──
  $('refresh-btn').addEventListener('click', () => {
    $('refresh-btn').classList.add('spinning');
    setTimeout(() => {
      $('refresh-btn').classList.remove('spinning');
      showToast('Feed refreshed — no new articles', '🔄');
    }, 1400);
  });

  // ── Add feed ──
  $('add-feed-btn').addEventListener('click', openAddFeed);
  $('close-add-feed').addEventListener('click', closeAddFeed);
  $('cancel-add-feed').addEventListener('click', closeAddFeed);
  $('confirm-add-feed').addEventListener('click', () => addFeed($('add-feed-input').value));
  $('add-feed-input').addEventListener('keydown', e => { if (e.key === 'Enter') addFeed(e.target.value); });
  $('add-feed-modal').addEventListener('click', e => { if (e.target === $('add-feed-modal')) closeAddFeed(); });

  // ── Reader toolbar ──
  $('reader-back-btn').addEventListener('click', () => {
    document.getElementById('article-reader-panel').classList.remove('mobile-open');
  });

  $('reader-star-btn').addEventListener('click', () => {
    if (state.selectedArticleId) handleArticleAction(state.selectedArticleId, 'star');
  });
  $('reader-save-btn').addEventListener('click', () => {
    if (state.selectedArticleId) handleArticleAction(state.selectedArticleId, 'save');
  });
  $('reader-share-btn').addEventListener('click', () => {
    const article = state.articles.find(a => a.id === state.selectedArticleId);
    if (article && navigator.clipboard) {
      navigator.clipboard.writeText(article.title);
      showToast('Article title copied to clipboard', '📋');
    }
  });
  $('reader-external-btn').addEventListener('click', () => {
    const article = state.articles.find(a => a.id === state.selectedArticleId);
    if (article) showToast(`Would open: ${article.feedName} article`, '🔗');
  });
  $('next-article-btn').addEventListener('click', () => navigateArticle('next'));
  $('prev-article-btn').addEventListener('click', () => navigateArticle('prev'));

  // ── Font size ──
  $('font-decrease').addEventListener('click', () => {
    state.fontSize = Math.max(12, state.fontSize - 1);
    applyReaderFont(); persistState();
  });
  $('font-increase').addEventListener('click', () => {
    state.fontSize = Math.min(24, state.fontSize + 1);
    applyReaderFont(); persistState();
  });

  // ── AI Summary ──
  $('ai-summarize-btn').addEventListener('click', () => {
    const article = state.articles.find(a => a.id === state.selectedArticleId);
    if (!article) return;
    const card = $('ai-summary-card');
    $('ai-summary-body').innerHTML = '<div style="color:rgba(255,255,255,.5);font-size:0.85rem;padding:8px 0;">Analyzing article…</div>';
    card.classList.add('show');
    $('ai-summarize-btn').style.display = 'none';
    setTimeout(() => {
      $('ai-summary-body').innerHTML = generateSummary(article);
    }, 1200);
  });
  $('ai-summary-close').addEventListener('click', () => {
    $('ai-summary-card').classList.remove('show');
    $('ai-summarize-btn').style.display = 'inline-flex';
  });

  // ── User menu ──
  $('user-menu-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    $('user-dropdown').classList.toggle('open');
  });
  document.addEventListener('click', () => $('user-dropdown').classList.remove('open'));
  $('user-dropdown').addEventListener('click', e => e.stopPropagation());

  $('theme-toggle-btn').addEventListener('click', () => {
    setDarkMode(!state.darkMode);
    $('user-dropdown').classList.remove('open');
    showToast(state.darkMode ? 'Dark mode on' : 'Light mode on', state.darkMode ? '🌙' : '☀️');
  });

  $('logout-btn').addEventListener('click', () => {
    AUTH.clearSession();
    window.location.href = 'login.html';
  });

  $('preferences-btn').addEventListener('click', () => {
    $('user-dropdown').classList.remove('open');
    openPreferences();
  });

  // ── Preferences modal ──
  $('close-preferences').addEventListener('click', closePreferences);
  $('close-preferences-btn').addEventListener('click', closePreferences);
  $('preferences-modal').addEventListener('click', e => { if (e.target === $('preferences-modal')) closePreferences(); });

  $('pref-dark-mode').addEventListener('change', (e) => setDarkMode(e.target.checked));
  $('pref-compact').addEventListener('change', (e) => {
    state.compactMode = e.target.checked;
    document.body.classList.toggle('compact', state.compactMode);
    persistState();
  });

  $('save-preferences-btn').addEventListener('click', () => {
    const fontChoice = document.querySelector('input[name="font"]:checked')?.value || 'inter';
    state.readerFont = fontChoice;
    applyReaderFont();
    persistState();
    closePreferences();
    showToast('Preferences saved', '✓');
  });

  // ── Mobile sidebar ──
  $('mobile-sidebar-btn').addEventListener('click', () => {
    sidebar.classList.toggle('mobile-open');
    // Create/toggle overlay
    let overlay = document.querySelector('.mobile-sidebar-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'mobile-sidebar-overlay';
      overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:999;';
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
        overlay.remove();
      });
      document.body.appendChild(overlay);
    } else { overlay.remove(); }
  });

  // ── Update landing page links to point to login/signup ──
  // (this is the reader app; the landing page links already updated)
});
