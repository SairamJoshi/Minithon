// ============================================
// EKAI — Mock API Service
// Returns realistic data for frontend development.
// Replace with real API calls when integrating with backend.
// ============================================

const MOCK_DELAY = 800; // simulate network latency

// ─── Mock Story Data ───────────────────────────────────────
const MOCK_STORIES = [
  {
    id: "story_1",
    title: "RBI Announces New UPI Transaction Limit Framework",
    summary: "The Reserve Bank of India has proposed raising the UPI transaction limit from ₹1 lakh to ₹5 lakh for specific categories including tax payments, education fees, and healthcare. The new framework will be implemented in phases starting Q1 2027.",
    why_it_matters: "This could fundamentally change how large transactions are processed in India, reducing dependency on NEFT/RTGS for mid-value payments and further cementing UPI as the backbone of India's digital payment infrastructure.",
    read_min: 3,
    independence: 0.33,
    published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    tier: "urgent",
    sources: [
      { name: "Mint", url: "#", independent: true },
      { name: "Economic Times", url: "#", independent: true },
      { name: "Moneycontrol", url: "#", independent: false, derived_from: "Mint" },
      { name: "Business Standard", url: "#", independent: false, derived_from: "ET" },
      { name: "Financial Express", url: "#", independent: false, derived_from: "Mint" },
      { name: "Inc42", url: "#", independent: false, derived_from: "ET" },
    ],
    claims: [
      { text: "UPI limit to be raised to ₹5 lakh for select categories", status: "agreed", sources: ["Mint", "ET", "Business Standard"] },
      { text: "Implementation begins Q1 2027", status: "agreed", sources: ["Mint", "ET"] },
      { text: "Tax payments will be the first category enabled", status: "disputed", sources: ["Mint"], counter_sources: ["ET"] },
      { text: "NPCI to release new API specs by December 2026", status: "single", sources: ["Moneycontrol"] },
    ],
    components: {
      relevance: 0.95,
      novelty: 0.88,
      credibility: 0.91,
      urgency: 0.85,
      velocity: 0.78,
      independence: 0.33,
    },
    entities: ["RBI", "NPCI", "UPI", "Ministry of Finance"],
    key_numbers: ["₹5 lakh new limit", "₹1 lakh current limit", "Q1 2027 timeline"],
    timeline: [
      { time: "2h ago", source: "Mint", event: "Breaking: RBI proposes new UPI framework" },
      { time: "1.5h ago", source: "ET", event: "RBI confirms UPI limit increase for select categories" },
      { time: "1h ago", source: "Moneycontrol", event: "Analysis: What the new UPI limits mean for fintech" },
      { time: "45m ago", source: "Business Standard", event: "Industry reactions to RBI's UPI announcement" },
    ]
  },
  {
    id: "story_2",
    title: "PhonePe Raises $500M at $14B Valuation Ahead of IPO",
    summary: "PhonePe has closed a $500 million funding round led by General Atlantic and existing investor Tiger Global, valuing the company at $14 billion. The round signals strong investor confidence ahead of PhonePe's planned IPO in late 2027.",
    why_it_matters: "As India's largest UPI player with 48% market share, PhonePe's valuation and IPO trajectory will set the benchmark for Indian fintech valuations and could trigger a wave of fintech IPOs in 2027-28.",
    read_min: 2,
    independence: 0.67,
    published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    tier: "important",
    sources: [
      { name: "Inc42", url: "#", independent: true },
      { name: "YourStory", url: "#", independent: true },
      { name: "Mint", url: "#", independent: false, derived_from: "Inc42" },
    ],
    claims: [
      { text: "Funding round of $500M", status: "agreed", sources: ["Inc42", "YourStory", "Mint"] },
      { text: "Valuation at $14 billion", status: "agreed", sources: ["Inc42", "YourStory"] },
      { text: "IPO planned for late 2027", status: "single", sources: ["Inc42"] },
      { text: "General Atlantic led the round", status: "agreed", sources: ["Inc42", "YourStory"] },
    ],
    components: {
      relevance: 0.82,
      novelty: 0.91,
      credibility: 0.87,
      urgency: 0.52,
      velocity: 0.88,
      independence: 0.67,
    },
    entities: ["PhonePe", "General Atlantic", "Tiger Global", "Walmart"],
    key_numbers: ["$500M raised", "$14B valuation", "48% UPI market share", "Late 2027 IPO"],
    timeline: [
      { time: "4h ago", source: "Inc42", event: "Exclusive: PhonePe closes $500M round" },
      { time: "3h ago", source: "YourStory", event: "PhonePe confirms fundraise, shares IPO plans" },
      { time: "2.5h ago", source: "Mint", event: "PhonePe valued at $14B in latest round" },
    ]
  },
  {
    id: "story_3",
    title: "SEBI Proposes Regulatory Framework for AI-Powered Trading Algorithms",
    summary: "SEBI has released a consultation paper proposing mandatory registration and audit requirements for AI and ML-based trading algorithms. The framework would require algo providers to maintain explainability logs and implement circuit breakers for autonomous trading systems.",
    why_it_matters: "India could become one of the first major markets to regulate AI trading specifically. This affects every algo trading platform, quant fund, and retail trading app offering automated strategies.",
    read_min: 4,
    independence: 0.50,
    published_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    tier: "important",
    sources: [
      { name: "Economic Times", url: "#", independent: true },
      { name: "Business Standard", url: "#", independent: true },
      { name: "Moneycontrol", url: "#", independent: false, derived_from: "ET" },
      { name: "Financial Express", url: "#", independent: false, derived_from: "Business Standard" },
    ],
    claims: [
      { text: "SEBI consultation paper released for AI trading regulation", status: "agreed", sources: ["ET", "Business Standard"] },
      { text: "Mandatory registration for algo providers", status: "agreed", sources: ["ET", "Business Standard", "Moneycontrol"] },
      { text: "Explainability logs required for ML models", status: "agreed", sources: ["ET", "Business Standard"] },
      { text: "Retail algo trading could be restricted", status: "disputed", sources: ["Moneycontrol"], counter_sources: ["ET"] },
      { text: "Implementation by mid-2027", status: "single", sources: ["Financial Express"] },
    ],
    components: {
      relevance: 0.72,
      novelty: 0.85,
      credibility: 0.93,
      urgency: 0.45,
      velocity: 0.55,
      independence: 0.50,
    },
    entities: ["SEBI", "NSE", "BSE", "Zerodha", "Groww"],
    key_numbers: ["AI algo audit every 6 months", "Circuit breaker at 5% portfolio drawdown"],
    timeline: [
      { time: "6h ago", source: "ET", event: "SEBI releases AI trading consultation paper" },
      { time: "5h ago", source: "Business Standard", event: "Industry analysis: SEBI's AI trading framework" },
      { time: "4h ago", source: "Moneycontrol", event: "What SEBI's AI rules mean for retail traders" },
    ]
  },
  {
    id: "story_4",
    title: "Razorpay Launches Cross-Border UPI Payments in 5 Countries",
    summary: "Razorpay has launched international UPI payments enabling Indian users to pay merchants in Singapore, UAE, Sri Lanka, Bhutan, and Nepal directly through UPI. The service leverages NPCI International's partnerships.",
    why_it_matters: "Cross-border UPI is a strategic move that extends India's digital payment ecosystem globally. For Indian fintech companies, this opens up a massive addressable market beyond domestic transactions.",
    read_min: 2,
    independence: 0.75,
    published_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    tier: "info",
    sources: [
      { name: "YourStory", url: "#", independent: true },
      { name: "Inc42", url: "#", independent: true },
      { name: "Mint", url: "#", independent: true },
      { name: "ET", url: "#", independent: false, derived_from: "YourStory" },
    ],
    claims: [
      { text: "Live in 5 countries: Singapore, UAE, Sri Lanka, Bhutan, Nepal", status: "agreed", sources: ["YourStory", "Inc42", "Mint"] },
      { text: "Built on NPCI International infrastructure", status: "agreed", sources: ["YourStory", "Inc42"] },
      { text: "No additional charges for cross-border UPI", status: "disputed", sources: ["YourStory"], counter_sources: ["Mint"] },
    ],
    components: {
      relevance: 0.65,
      novelty: 0.72,
      credibility: 0.88,
      urgency: 0.30,
      velocity: 0.62,
      independence: 0.75,
    },
    entities: ["Razorpay", "NPCI International", "UPI"],
    key_numbers: ["5 countries", "NPCI International"],
    timeline: [
      { time: "8h ago", source: "YourStory", event: "Razorpay announces cross-border UPI" },
      { time: "7h ago", source: "Inc42", event: "Deep dive: Razorpay's international UPI strategy" },
    ]
  },
  {
    id: "story_5",
    title: "Zerodha Reports Record ₹5,000 Cr Revenue, Warns About AI Disruption",
    summary: "Zerodha has reported its highest-ever annual revenue of ₹5,000 crore for FY26. CEO Nithin Kamath simultaneously warned that AI-powered trading tools could disrupt the brokerage industry within 3–5 years.",
    why_it_matters: "Zerodha's financials validate the Indian retail trading boom, but Kamath's AI warning signals that even dominant players see technology disruption ahead. This could reshape how fintech companies invest in AI capabilities.",
    read_min: 2,
    independence: 0.50,
    published_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    tier: "info",
    sources: [
      { name: "Moneycontrol", url: "#", independent: true },
      { name: "ET", url: "#", independent: true },
      { name: "Inc42", url: "#", independent: false, derived_from: "Moneycontrol" },
      { name: "Business Standard", url: "#", independent: false, derived_from: "ET" },
    ],
    claims: [
      { text: "Revenue of ₹5,000 crore in FY26", status: "agreed", sources: ["Moneycontrol", "ET", "Inc42"] },
      { text: "AI disruption warning from Nithin Kamath", status: "agreed", sources: ["Moneycontrol", "ET"] },
      { text: "3-5 year timeline for AI disruption in broking", status: "single", sources: ["Moneycontrol"] },
    ],
    components: {
      relevance: 0.58,
      novelty: 0.65,
      credibility: 0.90,
      urgency: 0.25,
      velocity: 0.45,
      independence: 0.50,
    },
    entities: ["Zerodha", "Nithin Kamath", "SEBI"],
    key_numbers: ["₹5,000 Cr revenue", "3-5 years AI disruption timeline"],
    timeline: [
      { time: "10h ago", source: "Moneycontrol", event: "Zerodha reports record revenue" },
      { time: "9h ago", source: "ET", event: "Nithin Kamath warns about AI in broking" },
    ]
  },
  {
    id: "story_6",
    title: "India Stack Global Expansion: 12 Countries to Adopt UPI-Aadhaar Model",
    summary: "The Ministry of Electronics and IT announced that 12 countries have signed MoUs to adopt India's digital public infrastructure model, including UPI-like payments and Aadhaar-like digital identity systems.",
    why_it_matters: "India's DPI export strategy positions it as a global digital infrastructure leader. For Indian fintech companies, this creates potential opportunities to expand their platforms internationally using familiar rails.",
    read_min: 3,
    independence: 0.40,
    published_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    tier: "info",
    sources: [
      { name: "Mint", url: "#", independent: true },
      { name: "Economic Times", url: "#", independent: true },
      { name: "Financial Express", url: "#", independent: false, derived_from: "Mint" },
      { name: "Business Standard", url: "#", independent: false, derived_from: "Mint" },
      { name: "NDTV", url: "#", independent: false, derived_from: "ET" },
    ],
    claims: [
      { text: "12 countries signed MoUs", status: "agreed", sources: ["Mint", "ET"] },
      { text: "Both UPI and Aadhaar models included", status: "agreed", sources: ["Mint", "ET", "Financial Express"] },
      { text: "African nations form the majority of adopters", status: "single", sources: ["Mint"] },
    ],
    components: {
      relevance: 0.55,
      novelty: 0.70,
      credibility: 0.82,
      urgency: 0.20,
      velocity: 0.38,
      independence: 0.40,
    },
    entities: ["MeitY", "NPCI", "India Stack", "UIDAI"],
    key_numbers: ["12 countries", "MoU signed"],
    timeline: [
      { time: "12h ago", source: "Mint", event: "MeitY announces India Stack global expansion" },
      { time: "11h ago", source: "ET", event: "12 nations to adopt UPI-Aadhaar model" },
    ]
  },
  {
    id: "story_7",
    title: "Paytm's Lending Business Surges 340% After Regulatory Reset",
    summary: "Paytm's lending operations have grown 340% quarter-over-quarter after the company restructured its lending partnerships following RBI's enforcement action. New partnerships with SBI and HDFC Bank are driving the recovery.",
    why_it_matters: "Paytm's recovery demonstrates that fintech companies can bounce back from regulatory setbacks. This could influence how investors assess regulatory risk in Indian fintech and restore confidence in the sector.",
    read_min: 2,
    independence: 0.67,
    published_at: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    tier: "low",
    sources: [
      { name: "Inc42", url: "#", independent: true },
      { name: "Moneycontrol", url: "#", independent: true },
      { name: "ET", url: "#", independent: true },
    ],
    claims: [
      { text: "340% QoQ growth in lending", status: "agreed", sources: ["Inc42", "Moneycontrol"] },
      { text: "New partnerships with SBI and HDFC Bank", status: "agreed", sources: ["Inc42", "ET"] },
      { text: "Profitability expected by Q3 FY27", status: "single", sources: ["Moneycontrol"] },
    ],
    components: {
      relevance: 0.48,
      novelty: 0.60,
      credibility: 0.80,
      urgency: 0.15,
      velocity: 0.35,
      independence: 0.67,
    },
    entities: ["Paytm", "One97 Communications", "SBI", "HDFC Bank", "RBI"],
    key_numbers: ["340% QoQ growth", "SBI & HDFC partnerships"],
    timeline: [
      { time: "14h ago", source: "Inc42", event: "Paytm lending surges post-RBI reset" },
      { time: "13h ago", source: "Moneycontrol", event: "Paytm lending recovery analysis" },
    ]
  },
];

// ─── Default Weights ───────────────────────────────────────
const DEFAULT_WEIGHTS = {
  relevance: 0.30,
  novelty: 0.15,
  credibility: 0.15,
  velocity: 0.10,
  urgency: 0.15,
  independence: 0.15,
};

// ─── Simulate delay ────────────────────────────────────────
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ─── Score a story given weights ───────────────────────────
function scoreStory(story, weights) {
  const w = { ...DEFAULT_WEIGHTS, ...weights };
  return Object.keys(w).reduce((sum, key) => {
    return sum + (story.components[key] || 0) * w[key];
  }, 0);
}

// ─── Time optimizer (knapsack-like) ────────────────────────
function optimizeForTime(stories, maxMinutes, weights) {
  const scored = stories.map(s => ({
    ...s,
    final_score: scoreStory(s, weights),
  })).sort((a, b) => b.final_score - a.final_score);

  const selected = [];
  let totalTime = 0;

  for (const story of scored) {
    if (totalTime + story.read_min <= maxMinutes) {
      selected.push(story);
      totalTime += story.read_min;
    }
  }

  return { stories: selected, totalTime, totalAvailable: stories.length };
}

// ============================================
// API Functions (Mock)
// ============================================

let sessionWeights = { ...DEFAULT_WEIGHTS };

/**
 * GET /api/news — Fetch raw news articles
 */
export async function fetchNews(query = "", country = "in") {
  await delay(MOCK_DELAY);
  
  let filtered = [...MOCK_STORIES];
  
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.summary.toLowerCase().includes(q) ||
      s.entities.some(e => e.toLowerCase().includes(q))
    );
  }
  
  return {
    articles: filtered,
    total: filtered.length,
    query,
    country,
  };
}

/**
 * POST /api/briefing — Main agent endpoint
 */
export async function fetchBriefing(goal, minutes = 10) {
  await delay(MOCK_DELAY + 500); // slightly longer for "AI processing"
  
  const goalLower = goal.toLowerCase();
  
  // Simulate goal-aware relevance boosting
  const boosted = MOCK_STORIES.map(story => {
    const goalTerms = goalLower.split(/\s+/);
    const storyText = `${story.title} ${story.summary} ${story.entities.join(' ')}`.toLowerCase();
    
    let matchCount = 0;
    goalTerms.forEach(term => {
      if (term.length > 2 && storyText.includes(term)) matchCount++;
    });
    
    const goalBoost = Math.min(matchCount / Math.max(goalTerms.length, 1), 1) * 0.3;
    
    return {
      ...story,
      components: {
        ...story.components,
        relevance: Math.min(story.components.relevance + goalBoost, 1.0),
      },
    };
  });
  
  const { stories, totalTime, totalAvailable } = optimizeForTime(boosted, minutes, sessionWeights);
  
  return {
    goal,
    minutes,
    stories,
    meta: {
      total_articles_analyzed: 47 + Math.floor(Math.random() * 20),
      story_clusters: totalAvailable,
      selected_stories: stories.length,
      total_reading_time: totalTime,
      weights: { ...sessionWeights },
    },
  };
}

/**
 * GET /api/story/:id — Detailed story analysis
 */
export async function fetchStoryDetail(id) {
  await delay(MOCK_DELAY);
  
  const story = MOCK_STORIES.find(s => s.id === id);
  if (!story) throw new Error("Story not found");
  
  return {
    ...story,
    final_score: scoreStory(story, sessionWeights),
  };
}

/**
 * POST /api/feedback — Submit feedback and update weights
 */
export async function submitFeedback(storyId, feedback) {
  await delay(300);
  
  const oldWeights = { ...sessionWeights };
  
  const story = MOCK_STORIES.find(s => s.id === storyId);
  if (!story) return { success: false };
  
  // Find the story's strongest and weakest components
  const comps = story.components;
  const sorted = Object.entries(comps).sort((a, b) => b[1] - a[1]);
  
  if (feedback === "up") {
    // Boost weights of this story's strong components
    sorted.slice(0, 2).forEach(([key]) => {
      sessionWeights[key] = Math.min(sessionWeights[key] + 0.03, 0.50);
    });
  } else if (feedback === "down") {
    // Reduce weights of this story's strong components, boost weak ones
    sorted.slice(0, 2).forEach(([key]) => {
      sessionWeights[key] = Math.max(sessionWeights[key] - 0.03, 0.05);
    });
    sorted.slice(-2).forEach(([key]) => {
      sessionWeights[key] = Math.min(sessionWeights[key] + 0.03, 0.50);
    });
  }
  
  // Normalize weights to sum to 1
  const total = Object.values(sessionWeights).reduce((a, b) => a + b, 0);
  Object.keys(sessionWeights).forEach(key => {
    sessionWeights[key] = sessionWeights[key] / total;
  });
  
  return {
    success: true,
    old_weights: oldWeights,
    new_weights: { ...sessionWeights },
    story_id: storyId,
    feedback,
  };
}

/**
 * Get current weights
 */
export function getWeights() {
  return { ...sessionWeights };
}

/**
 * Reset weights
 */
export function resetWeights() {
  sessionWeights = { ...DEFAULT_WEIGHTS };
  return { ...sessionWeights };
}
