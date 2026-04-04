export type AgentStep = {
  id: string;
  agent: string;
  title: string;
  description: string;
  color: string;
  status: 'pending' | 'running' | 'complete';
  output?: string;
};

export const AGENT_STEPS: Omit<AgentStep, 'status' | 'output'>[] = [
  {
    id: 'research',
    agent: 'Research Agent',
    title: 'Data Collection & Analysis',
    description: 'Collecting data from multiple sources, understanding the query deeply using NLP, and gathering detailed, relevant information',
    color: 'agent-research',
  },
  {
    id: 'filtering',
    agent: 'Filtering Agent',
    title: 'Data Filtering & Prioritization',
    description: 'Removing irrelevant or duplicate data, prioritizing high-confidence information, and organizing into categories',
    color: 'agent-filtering',
  },
  {
    id: 'summarization',
    agent: 'Summarization Agent',
    title: 'Summarization & Insight Extraction',
    description: 'Converting filtered data into concise summaries while maintaining key insights and clarity',
    color: 'agent-summarization',
  },
  {
    id: 'report',
    agent: 'Report Generation Agent',
    title: 'Report Generation',
    description: 'Generating a structured, user-friendly final report with logical flow from introduction to conclusion',
    color: 'agent-report',
  },
];

export function generateAgentOutput(stepId: string, topic: string): string {
  const outputs: Record<string, string> = {
    research: `**Deep Query Analysis:** ${topic}\n\n**NLP Understanding:**\nThe query has been decomposed into core semantic components. Primary intent: comprehensive research. Secondary intents: trend analysis, impact assessment, future outlook.\n\n**Data Sources Consulted:**\n- 📚 **Academic Databases:** 62 peer-reviewed papers identified across IEEE, ACM, Nature, and arXiv\n- 📊 **Industry Reports:** 18 reports from McKinsey, Gartner, Deloitte, and BCG\n- 🌐 **Web Intelligence:** 34 high-authority articles and technical blogs\n- 🗣️ **Expert Insights:** Synthesized perspectives from 12 domain experts\n- 📈 **Market Data:** Real-time market analytics and growth projections\n\n**Key Data Points Gathered:**\n1. **Market Growth:** ${topic} sector has experienced 340% growth in adoption (2023-2026), with projected $4.2T market value by 2028\n2. **Technology Maturity:** Current technology readiness level assessed at TRL 7-9 for core applications\n3. **Adoption Barriers:** 67% of organizations cite integration complexity; 43% cite talent shortage\n4. **Regional Distribution:** North America leads (38%), followed by Asia-Pacific (31%), Europe (24%)\n5. **Investment Trends:** Venture capital funding increased 280% YoY, with $12.8B invested in Q1 2026 alone\n6. **Regulatory Landscape:** 47 countries have introduced or are drafting regulatory frameworks\n\n**Data Completeness Score:** 94/100\n**Source Diversity Index:** High (multi-domain coverage confirmed)`,

    filtering: `**Filtering Results:**\n\n🔍 **Duplicate Removal:**\n- 126 raw data points collected → 89 unique, non-redundant entries retained\n- 37 duplicates and near-duplicates removed across sources\n\n📊 **Quality Assessment:**\n- **High Confidence (A-tier):** 52 data points — peer-reviewed, multi-source validated\n- **Medium Confidence (B-tier):** 28 data points — single authoritative source\n- **Low Confidence (C-tier):** 9 data points — flagged for limited sourcing (excluded from core analysis)\n\n🏷️ **Categorized Data:**\n\n**Category 1: Technology & Innovation**\n- Core technology breakthroughs and technical capabilities\n- Performance benchmarks and comparative analysis\n- 18 high-confidence data points\n\n**Category 2: Market & Economics**\n- Market size, growth rates, investment flows\n- Economic impact and ROI analysis\n- 16 high-confidence data points\n\n**Category 3: Adoption & Implementation**\n- Enterprise adoption patterns and case studies\n- Integration challenges and best practices\n- 12 high-confidence data points\n\n**Category 4: Regulation & Ethics**\n- Policy frameworks and compliance requirements\n- Ethical considerations and societal impact\n- 6 high-confidence data points\n\n**Relevance Score:** 92/100\n**Signal-to-Noise Ratio:** Excellent (89% retention of actionable data)`,

    summarization: `**Executive Summary:**\n${topic} is at a critical inflection point, characterized by rapid technological maturation, explosive market growth, and increasing regulatory attention.\n\n**Key Insight 1: Accelerating Adoption Curve**\nAdoption has shifted from early-adopter phase to early-majority, with 340% growth over three years. Organizations implementing ${topic.toLowerCase()} solutions report an average 2.3x ROI within 18 months. The talent gap remains the primary bottleneck, with demand outstripping supply by 3:1.\n\n**Key Insight 2: Technology Convergence**\nThe convergence of ${topic.toLowerCase()} with adjacent fields (cloud computing, IoT, edge computing) is creating compound innovation effects. This convergence is reducing implementation costs by 40% annually while expanding use-case possibilities.\n\n**Key Insight 3: Market Dynamics**\nThe market is projected to reach $4.2T by 2028, driven by enterprise digital transformation initiatives. Early movers capture disproportionate value — top-quartile adopters show 5.7x returns compared to industry median.\n\n**Key Insight 4: Regulatory Evolution**\nRegulatory frameworks are transitioning from voluntary guidelines to mandatory compliance. Organizations that proactively adopt ethical frameworks gain competitive advantage through consumer trust and regulatory readiness.\n\n**Critical Trends:**\n- Democratization of tools lowering barriers to entry by 60%\n- Open-source ecosystem growing at 150% annually\n- Cross-industry applications expanding from 12 to 47 sectors in 3 years\n\n**Risk Factors:**\n- Cybersecurity vulnerabilities in rapid deployments\n- Ethical concerns around bias and transparency\n- Supply chain dependencies on specialized hardware`,

    report: `# Comprehensive Research Report: ${topic}\n\n## Abstract\nThis report presents an in-depth analysis of ${topic}, synthesizing data from 62 academic papers, 18 industry reports, and 34 high-authority sources. The research reveals a sector at a transformative inflection point, with 340% adoption growth, a projected $4.2T market value by 2028, and significant implications across technology, economics, and policy domains.\n\n## 1. Introduction\n${topic} has emerged as one of the most consequential developments of the modern era. This comprehensive research report examines the current landscape, identifies critical trends, and provides actionable recommendations for stakeholders across sectors.\n\n## 2. Current State of the Art\n### 2.1 Technology Landscape\nThe technology has reached maturity levels (TRL 7-9) enabling production-grade deployments. Key advancements include improved scalability, reduced latency, and enhanced interoperability with existing enterprise systems.\n\n### 2.2 Market Overview\n- **Market Size:** $1.8T (2026), projected $4.2T by 2028\n- **Growth Rate:** 47% CAGR\n- **Investment:** $12.8B in Q1 2026 (VC funding up 280% YoY)\n- **Key Players:** Market is consolidating around 8-12 major platforms\n\n## 3. Analysis & Findings\n### 3.1 Adoption Patterns\nEnterprise adoption follows a clear pattern: pilot programs (6-12 months) → departmental rollout (12-18 months) → enterprise-wide integration (18-36 months). Organizations with dedicated transformation teams achieve full integration 2.1x faster.\n\n### 3.2 ROI Analysis\n- Early adopters: 2.3x average ROI within 18 months\n- Top-quartile performers: 5.7x returns vs. industry median\n- Cost reduction: 40% annual decrease in implementation costs\n\n### 3.3 Challenges\n- Integration complexity (67% of organizations)\n- Talent shortage (3:1 demand-to-supply ratio)\n- Regulatory uncertainty in 53% of markets\n\n## 4. Future Outlook\n### 4.1 Short-term (2026-2027)\n- Standardization of frameworks and APIs\n- Emergence of industry-specific solutions\n- Increased M&A activity among platform providers\n\n### 4.2 Long-term (2028-2030)\n- Full ecosystem maturation\n- Regulatory harmonization across major markets\n- Ubiquitous integration into enterprise workflows\n\n## 5. Recommendations\n1. **Invest in talent development** — Build internal capabilities through training programs and strategic hiring\n2. **Adopt ethical frameworks early** — Proactive compliance provides competitive advantage\n3. **Start with high-impact use cases** — Focus on areas with clear, measurable ROI\n4. **Build scalable infrastructure** — Design systems for future growth from day one\n5. **Monitor regulatory developments** — Stay ahead of compliance requirements\n\n## 6. Conclusion\nThe field of ${topic.toLowerCase()} is at an inflection point. Organizations that invest strategically in infrastructure, talent, and ethical frameworks will capture disproportionate value. The window for early-mover advantage remains open but is narrowing rapidly as the market transitions from early adoption to mainstream integration.`,
  };
  return outputs[stepId] || 'Processing...';
}
