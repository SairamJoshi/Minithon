import React, { useState, useEffect, useRef } from 'react';
import '../styles/reader.css';
import { AUTH } from '../utils/auth';

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
  f1: ['This article covers a major development in the AI/tech space.', '• Key point: Significant performance or strategic milestone achieved\n• Industry impact: Likely to influence competitors and market dynamics\n• What to watch: Follow-up announcements expected within 30 days'],
  f2: ['Hardware or product announcement with competitive implications.', '• Spec comparison: Improvements range from 22–40% over previous generation\n• Market timing: Positioned against direct competitors\n• Consumer impact: Availability and pricing details to follow'],
  f3: ['Community discussion or developer project gaining traction.', '• Core thesis: Open-source or local-first approach to common problem\n• Reception: Strong community interest with actionable technical details\n• Technical merit: Solid engineering with reproducible results reported'],
  f4: ['Peer-reviewed research with potential long-term implications.', '• Methodology: Rigorous experimental setup with statistically significant results\n• Significance: Could advance the field by 3-5 years if replicated\n• Limitations: Small sample size; further validation needed at scale'],
  f5: ['Financial or market analysis with investment implications.', '• Macro trend: Sector consolidation continuing; AI remains dominant\n• Numbers: Key metrics show 20-40% growth vs prior comparable period\n• Risk factors: Regulatory environment and interest rates remain headwinds'],
  f6: ['Scientific discovery with implications for our understanding of the cosmos.', '• Discovery: New observation challenges or refines existing theoretical models\n• Method: Data collected from next-generation observational instruments\n• Next steps: Follow-up studies planned; peer review process underway'],
};

export default function ReaderPage({ onNavigate }) {
  // Session
  const [session] = useState(() => {
    const s = AUTH.getSession();
    if (s) return s;
    // Default demo session if accessed directly
    return { name: 'Alex Morgan', username: 'alex_m', email: 'alex@example.com', avatar: 'A', plan: 'pro_trial' };
  });

  // App state
  const [feeds, setFeeds] = useState([]);
  const [articles, setArticles] = useState([]);
  const [currentView, setCurrentView] = useState('all'); // 'all', 'unread', 'starred', 'read-later', 'feed'
  const [currentFeedId, setCurrentFeedId] = useState(null);
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'card', 'magazine'
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest', 'oldest', 'unread'
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const [readerFont, setReaderFont] = useState('inter');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileReaderOpen, setMobileReaderOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Modals
  const [addFeedOpen, setAddFeedOpen] = useState(false);
  const [addFeedInput, setAddFeedInput] = useState('');
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  // AI Summary Card state
  const [aiSummaryShown, setAiSummaryShown] = useState(false);
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);
  const [aiSummaryContent, setAiSummaryContent] = useState('');

  // Toasts
  const [toasts, setToasts] = useState([]);
  const toastIdRef = useRef(0);

  const showToast = (msg, icon = 'ℹ️') => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, msg, icon }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = AUTH.getUserData();
    const loadedFeeds = saved.feeds || [...DEFAULT_FEEDS];
    setFeeds(loadedFeeds);

    const loadedDark = saved.darkMode || false;
    setDarkMode(loadedDark);
    if (loadedDark) document.body.classList.add('dark');
    else document.body.classList.remove('dark');

    const loadedCompact = saved.compactMode || false;
    setCompactMode(loadedCompact);
    if (loadedCompact) document.body.classList.add('compact');
    else document.body.classList.remove('compact');

    setReaderFont(saved.readerFont || 'inter');
    setFontSize(saved.fontSize || 16);
    setSidebarCollapsed(saved.sidebarCollapsed || false);

    const savedArticleStates = saved.articleStates || {};
    const builtArticles = ARTICLE_TEMPLATES.map((t, i) => {
      const artId = `a${i}`;
      const stateObj = savedArticleStates[artId] || {};
      return {
        ...t,
        id: artId,
        read: stateObj.read || false,
        starred: stateObj.starred || false,
        savedLater: stateObj.savedLater || false,
        date: new Date(Date.now() - t.daysAgo * 86400000 - Math.random() * 18000000),
      };
    });
    setArticles(builtArticles);
  }, []);

  // Persist state updates
  const persistState = (newFeeds, newArticles, newDark, newCompact, newFont, newSize, newCollapsed) => {
    const articleStates = {};
    (newArticles || articles).forEach((a) => {
      articleStates[a.id] = { read: a.read, starred: a.starred, savedLater: a.savedLater };
    });
    AUTH.saveUserData({
      feeds: newFeeds || feeds,
      darkMode: newDark !== undefined ? newDark : darkMode,
      compactMode: newCompact !== undefined ? newCompact : compactMode,
      readerFont: newFont || readerFont,
      fontSize: newSize || fontSize,
      sidebarCollapsed: newCollapsed !== undefined ? newCollapsed : sidebarCollapsed,
      articleStates,
    });
  };

  // Font CSS Variables
  useEffect(() => {
    const fontMap = { inter: "'Inter', sans-serif", merriweather: "'Merriweather', serif" };
    document.documentElement.style.setProperty('--reader-font', fontMap[readerFont] || fontMap.inter);
    document.documentElement.style.setProperty('--reader-font-size', `${fontSize}px`);
  }, [readerFont, fontSize]);

  // Dark mode effect
  const toggleDarkMode = (val) => {
    const next = val !== undefined ? val : !darkMode;
    setDarkMode(next);
    document.body.classList.toggle('dark', next);
    persistState(feeds, articles, next, compactMode, readerFont, fontSize, sidebarCollapsed);
    showToast(next ? 'Dark mode on' : 'Light mode on', next ? '🌙' : '☀️');
  };

  // Compact mode effect
  const toggleCompactMode = (val) => {
    const next = val !== undefined ? val : !compactMode;
    setCompactMode(next);
    document.body.classList.toggle('compact', next);
    persistState(feeds, articles, darkMode, next, readerFont, fontSize, sidebarCollapsed);
  };

  // Badges calculations
  const badgeAll = articles.length;
  const badgeUnread = articles.filter((a) => !a.read).length;
  const badgeStarred = articles.filter((a) => a.starred).length;
  const badgeSavedLater = articles.filter((a) => a.savedLater).length;

  // Filtered Articles
  const filteredArticles = articles.filter((a) => {
    if (currentView === 'unread' && a.read) return false;
    if (currentView === 'starred' && !a.starred) return false;
    if (currentView === 'read-later' && !a.savedLater) return false;
    if (currentView === 'feed' && a.feedId !== currentFeedId) return false;

    if (sortOrder === 'unread' && a.read) return false;

    return true;
  }).sort((a, b) => {
    if (sortOrder === 'oldest') return a.date - b.date;
    return b.date - a.date;
  });

  const selectedArticle = articles.find((a) => a.id === selectedArticleId);

  // Article selection
  const selectArticle = (id) => {
    setSelectedArticleId(id);
    setMobileReaderOpen(true);
    setAiSummaryShown(false);

    // Auto mark as read
    const updated = articles.map((a) => (a.id === id ? { ...a, read: true } : a));
    setArticles(updated);
    persistState(feeds, updated, darkMode, compactMode, readerFont, fontSize, sidebarCollapsed);
  };

  // Article actions
  const handleArticleAction = (id, action, e) => {
    if (e) e.stopPropagation();
    let toastTxt = '';
    let toastIco = '✓';

    const updated = articles.map((a) => {
      if (a.id !== id) return a;
      if (action === 'star') {
        const nextStarred = !a.starred;
        toastTxt = nextStarred ? 'Article starred' : 'Star removed';
        toastIco = nextStarred ? '⭐' : '✕';
        return { ...a, starred: nextStarred };
      }
      if (action === 'save') {
        const nextSave = !a.savedLater;
        toastTxt = nextSave ? 'Saved for later' : 'Removed from reading list';
        toastIco = nextSave ? '🔖' : '✕';
        return { ...a, savedLater: nextSave };
      }
      if (action === 'mark-read') {
        const nextRead = !a.read;
        toastTxt = nextRead ? 'Marked as read' : 'Marked as unread';
        toastIco = '✓';
        return { ...a, read: nextRead };
      }
      return a;
    });

    setArticles(updated);
    persistState(feeds, updated, darkMode, compactMode, readerFont, fontSize, sidebarCollapsed);
    if (toastTxt) showToast(toastTxt, toastIco);
  };

  // Mark all read
  const handleMarkAllRead = () => {
    const updated = articles.map((a) => ({ ...a, read: true }));
    setArticles(updated);
    persistState(feeds, updated, darkMode, compactMode, readerFont, fontSize, sidebarCollapsed);
    showToast(`Marked ${filteredArticles.length} articles as read`, '✓');
  };

  // Refresh
  const [refreshSpinning, setRefreshSpinning] = useState(false);
  const handleRefresh = () => {
    setRefreshSpinning(true);
    setTimeout(() => {
      setRefreshSpinning(false);
      showToast('Feed refreshed — no new articles', '🔄');
    }, 1400);
  };

  // Navigate next / prev
  const navigateArticle = (direction) => {
    const idx = filteredArticles.findIndex((a) => a.id === selectedArticleId);
    let nextIdx = direction === 'next' ? idx + 1 : idx - 1;
    if (nextIdx < 0) nextIdx = filteredArticles.length - 1;
    if (nextIdx >= filteredArticles.length) nextIdx = 0;
    if (filteredArticles[nextIdx]) {
      selectArticle(filteredArticles[nextIdx].id);
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      switch (e.key.toLowerCase()) {
        case 'j':
          navigateArticle('next');
          break;
        case 'k':
          navigateArticle('prev');
          break;
        case 's':
          if (selectedArticleId) handleArticleAction(selectedArticleId, 'star');
          break;
        case 'b':
          if (selectedArticleId) handleArticleAction(selectedArticleId, 'save');
          break;
        case 'm':
          if (selectedArticleId) handleArticleAction(selectedArticleId, 'mark-read');
          break;
        case 'escape':
          setAddFeedOpen(false);
          setPreferencesOpen(false);
          setMobileReaderOpen(false);
          break;
        case 'f':
        case '/':
          e.preventDefault();
          const searchEl = document.getElementById('sidebar-search-input');
          if (searchEl) searchEl.focus();
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedArticleId, filteredArticles, articles]);

  // Format relative date
  const formatDate = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  // Add Feed Handler
  const handleAddFeed = (query) => {
    const q = (query || addFeedInput).trim();
    if (!q) return;

    const catalogFeed = SUGGESTED_FEEDS_CATALOG.find((sf) =>
      sf.url.toLowerCase().includes(q.toLowerCase()) || sf.name.toLowerCase().includes(q.toLowerCase())
    );

    const alreadyAdded = catalogFeed && feeds.some((f) => f.id === catalogFeed.id);
    if (alreadyAdded) {
      showToast('Already subscribed to this feed', '⚠️');
      return;
    }

    let newFeed;
    if (catalogFeed) {
      newFeed = { ...catalogFeed };
    } else {
      const name = q.replace(/https?:\/\//i, '').split('/')[0];
      newFeed = {
        id: `custom_${Date.now()}`,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        url: q,
        color: '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0'),
        emoji: '📡',
        category: 'Custom',
      };
    }

    const updatedFeeds = [...feeds, newFeed];
    const newDemoArticle = {
      id: `new_${Date.now()}`,
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
    };

    const updatedArticles = [newDemoArticle, ...articles];
    setFeeds(updatedFeeds);
    setArticles(updatedArticles);
    persistState(updatedFeeds, updatedArticles, darkMode, compactMode, readerFont, fontSize, sidebarCollapsed);
    setAddFeedOpen(false);
    setAddFeedInput('');
    showToast(`Subscribed to ${newFeed.name}`, '✅');
  };

  // AI Summarize
  const triggerAISummary = (article) => {
    setAiSummaryShown(true);
    setAiSummaryLoading(true);
    setTimeout(() => {
      const summaryData = AI_SUMMARIES[article.feedId] || [
        'This article covers an important development in its field.',
        '• Key insight extracted from the content\n• Secondary finding with supporting evidence\n• Recommended action or next steps to follow',
      ];
      const [intro, bullets] = summaryData;
      setAiSummaryContent({
        intro,
        bullets: bullets.split('\n').map((b) => b.trim()).filter(Boolean).map((b) => b.replace(/^•\s*/, '')),
      });
      setAiSummaryLoading(false);
    }, 1200);
  };

  // Sign out
  const handleLogout = () => {
    AUTH.clearSession();
    if (onNavigate) onNavigate('login');
  };

  const getPanelTitle = () => {
    if (currentView === 'feed') {
      const feed = feeds.find((f) => f.id === currentFeedId);
      return feed ? feed.name : 'Feed';
    }
    const map = { all: 'All Items', unread: 'Unread', starred: 'Starred', 'read-later': 'Read Later' };
    return map[currentView] || 'All Items';
  };

  return (
    <div className={`app-shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`} id="app-shell">
      {/* ═══ SIDEBAR ═══ */}
      <aside className={`sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`} id="sidebar">
        <div className="sidebar-header">
          <a
            href="index.html"
            className="sidebar-logo"
            onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('home'); }}
          >
            <div className="sidebar-logo-icon">
              <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="23" fill="#1875F3" />
                <circle cx="30" cy="18" r="7" fill="white" />
              </svg>
            </div>
            <span>inoreader</span>
          </a>
          <button
            className="ekai-back-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              background: 'linear-gradient(135deg, rgba(124, 92, 252, 0.15), rgba(92, 156, 252, 0.15))',
              border: '1px solid rgba(124, 92, 252, 0.4)',
              borderRadius: '6px',
              color: '#7c5cfc',
              fontSize: '0.72rem',
              fontWeight: '600',
              cursor: 'pointer',
              marginLeft: 'auto',
              marginRight: '6px',
              whiteSpace: 'nowrap',
            }}
            onClick={() => {
              if (onNavigate) onNavigate('ekai');
              else window.location.href = '/';
            }}
            title="Go to EKAI Intelligence Dashboard"
          >
            <span>⚡ EKAI</span>
          </button>
          <button
            className="sidebar-collapse-btn"
            id="sidebar-collapse"
            aria-label="Collapse sidebar"
            onClick={() => {
              const next = !sidebarCollapsed;
              setSidebarCollapsed(next);
              persistState(feeds, articles, darkMode, compactMode, readerFont, fontSize, next);
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
        </div>

        {/* Search */}
        <div className="sidebar-search">
          <div className="sidebar-search-inner">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text"
              id="sidebar-search-input"
              placeholder="Search feeds…"
              autoComplete="off"
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Nav: Smart views */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Smart Views</div>
          <ul className="sidebar-nav-list" id="smart-nav">
            <li>
              <button
                className={`sidebar-nav-item ${currentView === 'all' ? 'active' : ''}`}
                onClick={() => { setCurrentView('all'); setCurrentFeedId(null); setSelectedArticleId(null); }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
                <span>All Items</span>
                <span className={`nav-badge ${badgeAll > 0 ? 'has-count' : ''}`} id="badge-all">{badgeAll}</span>
              </button>
            </li>
            <li>
              <button
                className={`sidebar-nav-item ${currentView === 'unread' ? 'active' : ''}`}
                onClick={() => { setCurrentView('unread'); setCurrentFeedId(null); setSelectedArticleId(null); }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span>Unread</span>
                <span className={`nav-badge ${badgeUnread > 0 ? 'has-count' : ''}`} id="badge-unread">{badgeUnread}</span>
              </button>
            </li>
            <li>
              <button
                className={`sidebar-nav-item ${currentView === 'starred' ? 'active' : ''}`}
                onClick={() => { setCurrentView('starred'); setCurrentFeedId(null); setSelectedArticleId(null); }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <span>Starred</span>
                <span className={`nav-badge ${badgeStarred > 0 ? 'has-count' : ''}`} id="badge-starred">{badgeStarred}</span>
              </button>
            </li>
            <li>
              <button
                className={`sidebar-nav-item ${currentView === 'read-later' ? 'active' : ''}`}
                onClick={() => { setCurrentView('read-later'); setCurrentFeedId(null); setSelectedArticleId(null); }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
                <span>Read Later</span>
                <span className={`nav-badge ${badgeSavedLater > 0 ? 'has-count' : ''}`} id="badge-read-later">{badgeSavedLater}</span>
              </button>
            </li>
          </ul>

          {/* Subscriptions */}
          <div className="sidebar-section-label" style={{ marginTop: '16px' }}>
            Subscriptions
            <button
              className="add-feed-btn"
              id="add-feed-btn"
              title="Add new subscription"
              onClick={() => setAddFeedOpen(true)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          </div>
          <ul className="sidebar-nav-list" id="feeds-nav">
            {feeds
              .filter((f) => !sidebarSearch || f.name.toLowerCase().includes(sidebarSearch.toLowerCase()))
              .map((feed) => {
                const unreadCount = articles.filter((a) => a.feedId === feed.id && !a.read).length;
                const isActive = currentView === 'feed' && currentFeedId === feed.id;
                return (
                  <li key={feed.id}>
                    <button
                      className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                      onClick={() => {
                        setCurrentView('feed');
                        setCurrentFeedId(feed.id);
                        setSelectedArticleId(null);
                        setMobileSidebarOpen(false);
                      }}
                    >
                      <div className="feed-item-dot" style={{ background: feed.color }}>{feed.emoji}</div>
                      <span>{feed.name}</span>
                      <span className={`nav-badge ${unreadCount > 0 ? 'has-count' : ''}`}>{unreadCount}</span>
                    </button>
                  </li>
                );
              })}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="sidebar-user" id="sidebar-user">
          <div className="user-avatar" id="user-avatar">{session.avatar || session.name?.[0] || 'U'}</div>
          <div className="user-info">
            <span className="user-name" id="user-name">{session.name || session.username || 'User'}</span>
            <span className="user-plan" id="user-plan">
              {session.plan === 'pro_trial' ? '⭐ Pro Trial' : session.plan === 'pro' ? '⭐ Pro' : 'Free'}
            </span>
          </div>
          <button
            className="user-menu-btn"
            id="user-menu-btn"
            aria-label="User menu"
            onClick={(e) => { e.stopPropagation(); setUserDropdownOpen(!userDropdownOpen); }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
          </button>

          {/* User Dropdown */}
          <div className={`user-dropdown ${userDropdownOpen ? 'open' : ''}`} id="user-dropdown">
            <a
              href="signup.html"
              className="user-dropdown-item"
              onClick={(e) => { e.preventDefault(); setUserDropdownOpen(false); if (onNavigate) onNavigate('signup'); }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              My Account
            </a>
            <button
              className="user-dropdown-item"
              id="preferences-btn"
              onClick={() => { setUserDropdownOpen(false); setPreferencesOpen(true); }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/></svg>
              Preferences
            </button>
            <div className="user-dropdown-divider"></div>
            <button
              className="user-dropdown-item"
              id="theme-toggle-btn"
              onClick={() => { setUserDropdownOpen(false); toggleDarkMode(); }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              Toggle Dark Mode
            </button>
            <div className="user-dropdown-divider"></div>
            <button
              className="user-dropdown-item danger"
              id="logout-btn"
              onClick={() => { setUserDropdownOpen(false); handleLogout(); }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="mobile-sidebar-overlay"
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 999 }}
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ═══ ARTICLE LIST PANEL ═══ */}
      <section className="article-list-panel" id="article-list-panel">
        <div className="panel-header">
          <div className="panel-header-left">
            <button
              className="mobile-sidebar-btn"
              id="mobile-sidebar-btn"
              aria-label="Open sidebar"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <h2 className="panel-title" id="panel-title">{getPanelTitle()}</h2>
            <span className="panel-count" id="panel-count">{filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="panel-header-right">
            <button
              className="panel-action-btn"
              id="mark-all-read-btn"
              title="Mark all as read"
              onClick={handleMarkAllRead}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/><polyline points="20 6 9 17 17 6"/></svg>
            </button>
            <button
              className={`panel-action-btn ${refreshSpinning ? 'spinning' : ''}`}
              id="refresh-btn"
              title="Refresh"
              onClick={handleRefresh}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
            </button>

            {/* View Mode Toggles */}
            <div className="view-toggle-group">
              <button
                className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                id="view-list"
                title="List view"
                onClick={() => setViewMode('list')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              </button>
              <button
                className={`view-toggle-btn ${viewMode === 'card' ? 'active' : ''}`}
                id="view-card"
                title="Card view"
                onClick={() => setViewMode('card')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              </button>
              <button
                className={`view-toggle-btn ${viewMode === 'magazine' ? 'active' : ''}`}
                id="view-magazine"
                title="Magazine view"
                onClick={() => setViewMode('magazine')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              </button>
            </div>

            {/* Filter */}
            <select
              className="filter-select"
              id="sort-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="unread">Unread only</option>
            </select>
          </div>
        </div>

        {/* Articles List */}
        <div
          className={`articles-container ${viewMode === 'card' ? 'card-view' : viewMode === 'magazine' ? 'magazine-view' : ''}`}
          id="articles-container"
        >
          {filteredArticles.length === 0 ? (
            <div className="empty-state" id="empty-state" style={{ display: 'flex' }}>
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--gray-300)' }}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              <h3>No articles here</h3>
              <p id="empty-state-msg">
                {currentView === 'unread'
                  ? 'No unread articles — all caught up! ✓'
                  : currentView === 'starred'
                  ? 'No starred articles yet. Click ★ on any article.'
                  : currentView === 'read-later'
                  ? 'Your reading list is empty.'
                  : 'Subscribe to some feeds to get started'}
              </p>
            </div>
          ) : (
            filteredArticles.map((article) => {
              const feed = feeds.find((f) => f.id === article.feedId);
              const isSelected = selectedArticleId === article.id;
              const hasHero = article.heroImage;

              return (
                <div
                  key={article.id}
                  className={`article-item ${article.read ? 'read' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => selectArticle(article.id)}
                >
                  {!article.read && <div className="unread-dot"></div>}

                  {viewMode !== 'magazine' && (
                    hasHero ? (
                      <img
                        className="article-item-thumb"
                        src={article.heroImage}
                        alt=""
                        loading="lazy"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="article-item-thumb-placeholder" style={{ background: `${feed?.color}22` }}>
                        {feed?.emoji || '📰'}
                      </div>
                    )
                  )}

                  <div className="article-item-body">
                    <div className="article-item-source">
                      <span className="source-dot" style={{ background: feed?.color || '#1875F3' }}></span>
                      {article.feedName}
                    </div>
                    <div className="article-item-title">{article.title}</div>
                    <div className="article-item-meta">
                      <span>{formatDate(article.date)}</span>
                      <span>·</span>
                      <span>{article.readTime} min read</span>
                      {article.starred && <><span>·</span><span>⭐</span></>}
                      {article.savedLater && <><span>·</span><span>🔖</span></>}
                    </div>
                  </div>

                  {viewMode === 'magazine' && (
                    hasHero ? (
                      <img
                        className="article-item-thumb"
                        src={article.heroImage}
                        alt=""
                        loading="lazy"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="article-item-thumb-placeholder" style={{ background: `${feed?.color}22` }}>
                        {feed?.emoji || '📰'}
                      </div>
                    )
                  )}

                  <div className="article-item-actions">
                    <button
                      className={`article-item-action-btn ${article.starred ? 'starred' : ''}`}
                      title="Star"
                      onClick={(e) => handleArticleAction(article.id, 'star', e)}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill={article.starred ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    </button>
                    <button
                      className={`article-item-action-btn ${article.savedLater ? 'saved' : ''}`}
                      title="Read later"
                      onClick={(e) => handleArticleAction(article.id, 'save', e)}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill={article.savedLater ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
                    </button>
                    <button
                      className="article-item-action-btn"
                      title={article.read ? 'Mark unread' : 'Mark read'}
                      onClick={(e) => handleArticleAction(article.id, 'mark-read', e)}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* ═══ ARTICLE READER PANEL ═══ */}
      <main className={`article-reader-panel ${mobileReaderOpen ? 'mobile-open' : ''}`} id="article-reader-panel">
        {!selectedArticle ? (
          <div className="reader-placeholder" id="reader-placeholder">
            <div className="placeholder-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--gray-300)' }}><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
            </div>
            <h3>Select an article to read</h3>
            <p>Click any article on the left to open it here</p>
            <div className="placeholder-tips">
              <div className="tip"><kbd>J</kbd> Next article</div>
              <div className="tip"><kbd>K</kbd> Previous article</div>
              <div className="tip"><kbd>S</kbd> Star article</div>
              <div className="tip"><kbd>B</kbd> Save for later</div>
            </div>
          </div>
        ) : (
          <div className="reader-content" id="reader-content" style={{ display: 'flex' }}>
            {/* Toolbar */}
            <div className="reader-toolbar">
              <div className="reader-toolbar-left">
                <button
                  className="reader-back-btn"
                  id="reader-back-btn"
                  title="Back to list"
                  onClick={() => setMobileReaderOpen(false)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <div
                  className="reader-feed-tag"
                  id="reader-feed-tag"
                  style={{
                    background: `${feeds.find((f) => f.id === selectedArticle.feedId)?.color}20`,
                    color: feeds.find((f) => f.id === selectedArticle.feedId)?.color || '#1875F3',
                  }}
                >
                  {selectedArticle.feedName}
                </div>
              </div>

              <div className="reader-toolbar-right">
                <button
                  className={`reader-tool-btn ${selectedArticle.starred ? 'active' : ''}`}
                  id="reader-star-btn"
                  title={selectedArticle.starred ? 'Unstar (S)' : 'Star (S)'}
                  onClick={() => handleArticleAction(selectedArticle.id, 'star')}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </button>
                <button
                  className={`reader-tool-btn ${selectedArticle.savedLater ? 'saved-active' : ''}`}
                  id="reader-save-btn"
                  title={selectedArticle.savedLater ? 'Remove from read later (B)' : 'Save for later (B)'}
                  onClick={() => handleArticleAction(selectedArticle.id, 'save')}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
                </button>
                <button
                  className="reader-tool-btn"
                  id="reader-share-btn"
                  title="Share"
                  onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(selectedArticle.title);
                      showToast('Article title copied to clipboard', '📋');
                    }
                  }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                </button>
                <button
                  className="reader-tool-btn"
                  id="reader-external-btn"
                  title="Open original"
                  onClick={() => showToast(`Would open: ${selectedArticle.feedName} article`, '🔗')}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </button>
                <div className="font-size-ctrl">
                  <button
                    className="reader-tool-btn"
                    id="font-decrease"
                    onClick={() => {
                      const next = Math.max(12, fontSize - 1);
                      setFontSize(next);
                      persistState(feeds, articles, darkMode, compactMode, readerFont, next, sidebarCollapsed);
                    }}
                  >
                    A-
                  </button>
                  <button
                    className="reader-tool-btn"
                    id="font-increase"
                    onClick={() => {
                      const next = Math.min(24, fontSize + 1);
                      setFontSize(next);
                      persistState(feeds, articles, darkMode, compactMode, readerFont, next, sidebarCollapsed);
                    }}
                  >
                    A+
                  </button>
                </div>
                <button
                  className="reader-tool-btn prev-next-btn"
                  id="prev-article-btn"
                  title="Previous (K)"
                  onClick={() => navigateArticle('prev')}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <button
                  className="reader-tool-btn prev-next-btn"
                  id="next-article-btn"
                  title="Next (J)"
                  onClick={() => navigateArticle('next')}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
            </div>

            {/* Article Body */}
            <div className="reader-body" id="reader-body">
              <div className="reader-article-head">
                <div className="reader-meta-top">
                  <span className="reader-source" id="reader-source">{selectedArticle.feedName}</span>
                  <span className="reader-dot">·</span>
                  <span className="reader-date" id="reader-date">
                    {selectedArticle.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="reader-dot">·</span>
                  <span className="reader-read-time" id="reader-read-time">{selectedArticle.readTime} min read</span>
                </div>
                <h1 className="reader-title" id="reader-title">{selectedArticle.title}</h1>
                <div className="reader-tags" id="reader-tags">
                  {(selectedArticle.tags || []).map((t) => (
                    <span key={t} className="reader-tag">{t}</span>
                  ))}
                </div>
              </div>

              {selectedArticle.heroImage && (
                <div className="reader-hero-img-wrap" id="reader-hero-img-wrap">
                  <img
                    src={selectedArticle.heroImage}
                    alt={selectedArticle.title}
                    loading="lazy"
                    onError={(e) => { e.currentTarget.parentNode.style.display = 'none'; }}
                  />
                </div>
              )}

              <div
                className="reader-article-content"
                id="reader-article-content"
                dangerouslySetInnerHTML={{ __html: selectedArticle.content || `<p>${selectedArticle.excerpt}</p>` }}
              />

              {/* AI Summary Card */}
              {aiSummaryShown && (
                <div className={`ai-summary-card ${aiSummaryShown ? 'show' : ''}`} id="ai-summary-card">
                  <div className="ai-summary-header">
                    <div className="ai-summary-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                    </div>
                    <span>Inoreader Intelligence</span>
                    <button
                      className="ai-summary-close"
                      id="ai-summary-close"
                      onClick={() => setAiSummaryShown(false)}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="ai-summary-body" id="ai-summary-body">
                    {aiSummaryLoading ? (
                      <div style={{ color: 'rgba(255,255,255,.5)', fontSize: '0.85rem', padding: '8px 0' }}>
                        Analyzing article…
                      </div>
                    ) : (
                      <>
                        <p style={{ marginBottom: '12px' }}>{aiSummaryContent.intro}</p>
                        <ul style={{ paddingLeft: '18px' }}>
                          {(aiSummaryContent.bullets || []).map((b, i) => (
                            <li key={i} style={{ marginBottom: '8px' }}>{b}</li>
                          ))}
                        </ul>
                        <p style={{ marginTop: '12px', fontSize: '0.78rem', opacity: 0.5 }}>
                          Generated by Inoreader Intelligence · {new Date().toLocaleTimeString()}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {!aiSummaryShown && (
                <button
                  className="ai-summarize-btn"
                  id="ai-summarize-btn"
                  onClick={() => triggerAISummary(selectedArticle)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                  Summarize with AI
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ═══ ADD FEED MODAL ═══ */}
      {addFeedOpen && (
        <div
          className="modal-overlay active"
          id="add-feed-modal"
          onClick={(e) => { if (e.target.id === 'add-feed-modal') setAddFeedOpen(false); }}
        >
          <div className="modal-box">
            <div className="modal-box-header">
              <h3>Add Subscription</h3>
              <button className="modal-box-close" id="close-add-feed" onClick={() => setAddFeedOpen(false)}>✕</button>
            </div>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginBottom: '20px' }}>Enter a website URL, RSS feed, or search by keyword</p>

            <div className="add-feed-input-wrap">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                type="text"
                id="add-feed-input"
                placeholder="e.g. https://techcrunch.com or 'AI news'"
                autoComplete="off"
                value={addFeedInput}
                onChange={(e) => setAddFeedInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddFeed(); }}
                autoFocus
              />
            </div>

            <div className="suggested-feeds" id="suggested-feeds">
              <div className="suggested-label">Popular feeds</div>
              <div className="suggested-list" id="suggested-list">
                {SUGGESTED_FEEDS_CATALOG.map((sf) => {
                  const isAdded = feeds.some((f) => f.id === sf.id || f.url === sf.url);
                  return (
                    <div
                      key={sf.id}
                      className={`suggested-feed-item ${isAdded ? 'already-added' : ''}`}
                      onClick={() => {
                        if (!isAdded) setAddFeedInput(sf.url);
                      }}
                    >
                      <div className="suggested-feed-icon" style={{ background: `${sf.color}18`, color: sf.color, fontSize: '1.1rem' }}>
                        {sf.emoji}
                      </div>
                      <div className="suggested-feed-info">
                        <div className="suggested-feed-name">{sf.name}</div>
                        <div className="suggested-feed-url">{sf.url}</div>
                      </div>
                      <svg className="suggested-feed-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="modal-box-footer">
              <button className="modal-cancel-btn" id="cancel-add-feed" onClick={() => setAddFeedOpen(false)}>Cancel</button>
              <button className="modal-confirm-btn" id="confirm-add-feed" onClick={() => handleAddFeed()}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Subscribe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ PREFERENCES MODAL ═══ */}
      {preferencesOpen && (
        <div
          className="modal-overlay active"
          id="preferences-modal"
          onClick={(e) => { if (e.target.id === 'preferences-modal') setPreferencesOpen(false); }}
        >
          <div className="modal-box" style={{ maxWidth: '480px' }}>
            <div className="modal-box-header">
              <h3>Preferences</h3>
              <button className="modal-box-close" id="close-preferences" onClick={() => setPreferencesOpen(false)}>✕</button>
            </div>
            <div className="pref-section">
              <h4>Display</h4>
              <div className="pref-row">
                <div>
                  <strong>Dark mode</strong>
                  <span>Switch to dark theme</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    id="pref-dark-mode"
                    checked={darkMode}
                    onChange={(e) => toggleDarkMode(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="pref-row">
                <div>
                  <strong>Compact list view</strong>
                  <span>Show more articles at once</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    id="pref-compact"
                    checked={compactMode}
                    onChange={(e) => toggleCompactMode(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="pref-row">
                <div>
                  <strong>Mark as read on scroll</strong>
                  <span>Auto-mark articles when scrolled past</span>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" id="pref-auto-read" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
            <div className="pref-section">
              <h4>Reading Font</h4>
              <div className="font-picker">
                <label className="font-opt">
                  <input
                    type="radio"
                    name="font"
                    value="inter"
                    checked={readerFont === 'inter'}
                    onChange={() => {
                      setReaderFont('inter');
                      persistState(feeds, articles, darkMode, compactMode, 'inter', fontSize, sidebarCollapsed);
                    }}
                  />
                  <span style={{ fontFamily: 'Inter' }}>Inter (Sans-serif)</span>
                </label>
                <label className="font-opt">
                  <input
                    type="radio"
                    name="font"
                    value="merriweather"
                    checked={readerFont === 'merriweather'}
                    onChange={() => {
                      setReaderFont('merriweather');
                      persistState(feeds, articles, darkMode, compactMode, 'merriweather', fontSize, sidebarCollapsed);
                    }}
                  />
                  <span style={{ fontFamily: 'Merriweather' }}>Merriweather (Serif)</span>
                </label>
              </div>
            </div>
            <div className="modal-box-footer" style={{ marginTop: '24px' }}>
              <button className="modal-cancel-btn" id="close-preferences-btn" onClick={() => setPreferencesOpen(false)}>Close</button>
              <button
                className="modal-confirm-btn"
                id="save-preferences-btn"
                onClick={() => {
                  setPreferencesOpen(false);
                  showToast('Preferences saved', '✓');
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ TOAST CONTAINER ═══ */}
      <div className="toast-container" id="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="toast show">
            <span className="toast-icon">{t.icon}</span>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
