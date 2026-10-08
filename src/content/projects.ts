export interface Project {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  stack: string[];
  summary: string;
  isFlagship: boolean;
  regionId: 'honey-chain' | 'assignmate' | 'headlyn' | 'topic-model' | 'cost-bars';
  whatItIs: string;
  whatShipped?: string;
  engineeringProblem?: string;
  accuracyNotice?: string;
  liveUrl?: string;
  repoUrl?: string;
}

export const projects: Project[] = [
  {
    id: 'honey-chain',
    title: 'Honey Chain',
    subtitle: 'Blockchain-based honey traceability and smart-beekeeping prototype',
    year: '2024',
    stack: [
      'Hyperledger Fabric 2.5.x',
      'Fabric CA 1.5.x',
      'Docker Compose',
      'Ubuntu 24.04 on WSL',
      'cryptogen',
      'configtxgen',
      'osnadmin',
      'peer CLI'
    ],
    summary:
      'Built by team Bee-Tech for Smart India Hackathon problem statement SIH26021 (Honey Mission). Creates a tamper-resistant history of a honey batch from beekeeper to consumer, with QR-based consumer verification and an architecture ready for future IoT monitoring and AI analytics.',
    isFlagship: true,
    regionId: 'honey-chain',
    whatItIs:
      'A tamper-resistant honey provenance prototype created for Smart India Hackathon problem statement SIH26021 (Honey Mission). It records each custody transition across an immutable permissioned ledger, empowering buyers to independently verify harvest source and processing milestones via a consumer QR code.',
    whatShipped:
      'A local Hyperledger Fabric network with Fabric CA, orderer, peer and cryptographic identities generated using cryptogen, configtxgen, osnadmin, and peer CLI tooling.',
    engineeringProblem:
      'Bringing up the network from scratch: provisioning the Certificate Authority hierarchy, configuring orderer and peer connection profiles, generating Fabric channel artifacts, and resolving WSL filesystem and Docker socket permissions.',
    accuracyNotice:
      'This project is a functional prototype. On-hive IoT telemetry sensors, automated colony disease classification, and predictive yield analytics are proposed architectural extensions, not shipped production features. Decentralized ledger traceability is the differentiator.',
  },
  {
    id: 'assignmate',
    title: 'AssignMate',
    subtitle: 'AI-assisted academic writing refiner',
    year: '2024',
    stack: ['React', 'Node.js', 'Express.js', 'Gemini API', 'Tailwind CSS', 'Postman'],
    summary:
      'AI-powered tool that rewrites AI-generated text into more natural-sounding writing for academic use.',
    isFlagship: false,
    regionId: 'assignmate',
    whatItIs:
      'An academic writing tool engineered to reshape stiff, repetitive AI text outputs into fluid, natural prose suited for coursework and drafts.',
    whatShipped:
      'A decoupled architecture with a secure Express.js backend managing API keys and communication with the Gemini API, paired with a fast React interface styled with Tailwind CSS.',
    engineeringProblem:
      'Handling Gemini model versioning and intermittent 404 availability errors, resolving bundler PostCSS/Tailwind configuration conflicts, and rigorously validating API contracts with Postman collections.',
  },
  {
    id: 'headlyn',
    title: 'Headlyn',
    subtitle: 'News aggregation web app',
    year: '2024',
    stack: ['React', 'JavaScript', 'GNews API', 'Vercel'],
    summary:
      'News aggregation web app with a clean, responsive interface.',
    isFlagship: false,
    regionId: 'headlyn',
    liveUrl: 'https://headlyn1.vercel.app/',
    whatItIs:
      'A news reader aggregating current headlines into focused categories with minimal overhead and reliable layout stability.',
    whatShipped:
      'Category/content retrieval, skeleton loaders for smooth layout stability during network fetches, and resilient image-handling fallbacks.',
    engineeringProblem:
      'Hit a geographic and news-source limitation in the GNews API early on. Reworked the retrieval strategy, client fallback handling, and empty-payload guards to keep reading uninterrupted.',
  },
  {
    id: 'edge-topic-modelling',
    title: 'Edge Computing Topic Modelling',
    subtitle: 'LDA topic modelling across distributed systems literature',
    year: '2024',
    stack: ['Python', 'Gensim', 'Scopus Dataset', 'NLP'],
    summary:
      'LDA topic modelling in Python (Gensim) on a Scopus dataset of 10,714 documents and 9,645 terms; text preprocessing, word-frequency analysis, perplexity comparison across topic counts.',
    isFlagship: false,
    regionId: 'topic-model',
    whatItIs:
      'An empirical NLP research study extracting dominant semantic themes from thousands of peer-reviewed edge computing research publications.',
    whatShipped:
      'End-to-end Python preprocessing pipeline, vocabulary normalization, term-frequency matrix construction, and multi-topic LDA models evaluated across varying perplexity metrics.',
    engineeringProblem:
      'Balancing computational overhead against topic coherence when training across a vocabulary of 9,645 unique terms across 10,714 document abstracts.',
  },
  {
    id: 'cloud-optimizer',
    title: 'Smart Cloud Cost Optimizer',
    subtitle: 'Resource-usage analysis and spend reduction framework',
    year: '2024',
    stack: ['Cloud Computing', 'Usage Telemetry', 'Predictive Analysis'],
    summary:
      'Group academic project in cloud computing on resource-usage analysis and predictive analysis to reduce unnecessary cloud spend. Delivered a synopsis, an IEEE-format paper and a 25-slide presentation.',
    isFlagship: false,
    regionId: 'cost-bars',
    whatItIs:
      'A cloud resource utilization and cost optimization framework designed to identify idle virtual instances, analyze utilization patterns, and recommend right-sizing.',
    whatShipped:
      'Comprehensive project synopsis, an IEEE-format research paper, and a 25-slide technical presentation analyzing predictive telemetry for cloud cost efficiency.',
    engineeringProblem:
      'Normalizing heterogenous metric frequencies and workload variances across variable cloud workload traces without compromising availability thresholds.',
    accuracyNotice:
      'Academic research project conducted as a team study. Does not employ black-box generative AI; based on resource-usage metrics and predictive analysis.',
  },
];
