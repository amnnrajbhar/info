// ============================================================
// Portfolio v3 — Data Layer
// Single source of truth for all content. i18n-ready.
// ============================================================

const PERSONAL = {
  name: "Aman Rajbhar",
  title: "Forward Deployed / Full Stack Engineer",
  tagline: "Angular · .NET · SQL Server",
  bio: "Full-stack engineer with 4.5+ years of turning client problems into shipped production software. I work directly with enterprise clients in insurance, pharma and fintech to discover what they need, prototype fast, and deploy it on modern stacks: React / Next.js, Angular, ASP.NET Core and SQL Server. I have led a 6-engineer migration from Angular 6 to 19, I am currently moving a large insurance platform to Next.js 16, and I build AI tools from scratch to stay close to the LLM stack.",
  email: "amanrajbhar311@gmail.com",
  phone: "+919136026638",
  location: "Mumbai, India",
  linkedin: "https://www.linkedin.com/in/amnn-rajbhar",
  github: "https://github.com/amnnrajbhar",
  resumeUrl: "https://drive.google.com/file/d/1yLZnWEKSUL2MvBb5p_VzoII4HDW1Rpnn/view?usp=sharing",
  portfolioUrl: "https://amnnrajbhar.github.io/info/",
  education: "B.Sc — University of Mumbai",
  availability: "Open to Forward Deployed & Full Stack roles",
};

const STATS = [
  { value: 4.5, suffix: "+", label: "Years Experience", isDecimal: true },
  { value: 12, suffix: "+", label: "Projects Delivered", isDecimal: false },
  { value: 2, suffix: "", label: "Companies", isDecimal: false },
  { value: 70, suffix: "%", label: "Perf. Improvement", isDecimal: false },
];

const EXPERIENCE = [
  {
    company: "Clover Infotech Private Limited",
    clients: [
      { name: "ICICI Lombard", url: "https://www.icicilombard.com/motor-insurance/two-wheeler-insurance" },
      { name: "Micro Labs (Unnati)", url: "https://unnati.microlabs.co.in/" },
    ],
    role: "Software Engineer",
    dates: "Dec 2024 — Present",
    dateShort: "2024",
    active: true,
    stack: ["Next.js 16", "React", "Angular 19", "Team Leadership", "TypeScript", "RxJS", ".NET Core", "REST APIs"],
    highlights: [
      "Currently migrating ICICI Lombard’s Two-Wheeler Insurance journey from Angular to Next.js 16 with React.",
      "Led a team of 6 engineers to migrate Micro Labs’ Unnati platform from Angular 6 to Angular 19, owning planning, code reviews and delivery.",
      "Developed high-performance web applications using Angular, TypeScript, and RxJS.",
      "Designed and implemented scalable microservices & REST APIs with .NET Core.",
      "Optimized application performance, reducing load time by 70% through OnPush change detection and lazy loading.",
      "Enhanced UI/UX with Material UI, CSS3, and modern JavaScript patterns.",
    ],
  },
  {
    company: "Benchmark Computer Solutions Limited",
    role: "Junior Software Developer",
    dates: "Aug 2022 — Dec 2024",
    dateShort: "2022",
    active: false,
    stack: ["Angular", "ASP.NET MVC", "SQL Server", "jQuery", "Git"],
    highlights: [
      "Built dynamic web applications using Angular, ASP.NET, and MVC architecture.",
      "Collaborated with cross-functional teams to develop and ship new features.",
      "Diagnosed and resolved critical production bugs, ensuring application stability.",
      "Managed version control across 12+ enterprise projects using Git & GitHub.",
    ],
  },
];

const PROJECTS_FEATURED = [
  {
    id: "money-manager",
    emoji: "💰",
    title: "Money Manager",
    description: "Full-stack personal finance management application with transaction tracking, investment portfolio, borrowing/lending, and analytics dashboard.",
    problem: "Managing personal finances across multiple accounts and investment types is cumbersome with spreadsheets.",
    solution: "Built a comprehensive finance app with real-time dashboards, secure JWT authentication, and interactive Chart.js visualizations for portfolio tracking.",
    techStack: ["Angular 17", "Node.js", "MongoDB", "JWT", "Chart.js"],
    liveUrl: "https://moneymanager-jade.vercel.app/",
    image: "assets/images/projects/money-manager.jpg",
    imageWebp: "assets/images/projects/money-manager.webp",
    githubUrl: "https://github.com/amnnrajbhar/moneyManager",
    metrics: [
      { label: "Modules", value: "8+" },
      { label: "Auth", value: "JWT Secured" },
      { label: "Charts", value: "5 Types" },
    ],
    features: ["Transaction tracking & categorization", "Investment portfolio dashboard", "Borrowing & lending management", "Analytics with Chart.js visualizations", "Secure authentication with JWT"],
    architecture: [
      { name: "Angular 17 Client", type: "Frontend UI", icon: "fa-laptop-code" },
      { name: "REST API Gateway", type: "Auth & Routing", icon: "fa-network-wired" },
      { name: "Node.js / Express", type: "Backend Microservices", icon: "fa-server" },
      { name: "MongoDB Database", type: "Data Persistence", icon: "fa-database" }
    ]
  },
  {
    id: "tiny-llm",
    emoji: "🧠",
    title: "tinyLLM",
    description: "A miniature Large Language Model built from scratch using PyTorch with character-level Transformer architecture.",
    problem: "Understanding LLM internals requires hands-on implementation, not just using APIs.",
    solution: "Implemented a character-level Transformer from scratch — multi-head attention, positional encoding, feed-forward layers — trained on custom text corpora with a FastAPI serving layer.",
    techStack: ["Python", "PyTorch", "FastAPI", "Transformers"],
    liveUrl: "https://mannllm.onrender.com",
    githubUrl: "https://github.com/amnnrajbhar/tinyLLM",
    metrics: [
      { label: "Architecture", value: "Transformer" },
      { label: "Attention Heads", value: "Multi-Head" },
      { label: "Serving", value: "FastAPI" },
    ],
    features: ["Custom Transformer architecture from scratch", "Multi-head self-attention mechanism", "Positional encoding & feed-forward layers", "FastAPI inference endpoint", "Character-level text generation"],
    architecture: [
      { name: "Input Tokenizer", type: "Text Processing", icon: "fa-font" },
      { name: "Multi-Head Attention", type: "Self-Attention Blocks", icon: "fa-microchip" },
      { name: "PyTorch Model", type: "Neural Network Engine", icon: "fa-brain" },
      { name: "FastAPI Endpoint", type: "Inference API", icon: "fa-bolt" }
    ]
  },
  {
    id: "hrms-portal",
    emoji: "👥",
    title: "HRMS Portal",
    description: "A Human Resource Management System for enterprises — employee management, attendance, leave tracking, and organizational hierarchy.",
    problem: "Enterprise HR processes across departments need a unified, role-based digital platform.",
    solution: "Developed a comprehensive HRMS with role-based access control, real-time attendance tracking, leave management workflows, and organizational charts.",
    techStack: ["Angular", "Tailwind CSS", "Node.js", "REST API"],
    liveUrl: "https://hrms-pro-omega.vercel.app/",
    githubUrl: null,
    metrics: [
      { label: "Modules", value: "6+" },
      { label: "Access Control", value: "Role-based" },
      { label: "Domain", value: "Enterprise" },
    ],
    features: ["Employee management & directory", "Attendance & leave tracking", "Role-based access control", "Organizational hierarchy view", "Responsive Tailwind UI"],
    architecture: [
      { name: "Angular Dashboard", type: "Enterprise UI", icon: "fa-chart-pie" },
      { name: "RBAC Middleware", type: "Security Layer", icon: "fa-shield-alt" },
      { name: "Node.js Controller", type: "Business Logic", icon: "fa-cogs" },
      { name: "SQL Server", type: "Relational Schema", icon: "fa-database" }
    ]
  },
];

const PROJECTS_OTHER = [
  { emoji: "🤖", title: "GenAI Web App", description: "AI-powered chatbot using Google's Generative AI.", techStack: ["Ionic", "Angular", "Google AI"], liveUrl: "https://genai-chatbot-psi.vercel.app/" },
  { emoji: "☁️", title: "Media Upload", description: "Cloud media upload with AWS S3 integration.", techStack: ["AWS S3", "Angular", "Vercel"], liveUrl: "https://mediaupload-iota.vercel.app/" },
  { emoji: "📚", title: "LMS Portal", description: "Learning Management System with Firebase backend.", techStack: ["Angular", "Firebase", "Vercel"], liveUrl: "https://lms-portal-jet.vercel.app/" },
  { emoji: "🏦", title: "Digital Loan Process", description: "Digital loan processing with full workflow.", techStack: ["Angular", "Node.js", "MongoDB"], liveUrl: "https://digital-loan-process-app.vercel.app/" },
  { emoji: "🌦️", title: "Weather App", description: "Real-time weather updates via OpenWeather API.", techStack: ["HTML", "CSS", "JS", "OpenWeather"], liveUrl: "https://weather-app-amnnrajbhars-projects.vercel.app/" },
];

const SKILLS = [
  { category: "Frontend", icon: "fa-laptop-code", items: ["Angular", "Next.js", "React", "TypeScript", "RxJS", "HTML/CSS", "Tailwind CSS"] },
  { category: "Backend", icon: "fa-server", items: ["ASP.NET Core", "C#", "Node.js", "Express.js", "REST APIs"] },
  { category: "Database", icon: "fa-database", items: ["SQL Server", "MongoDB", "Firebase", "MySQL"] },
  { category: "Tools & DevOps", icon: "fa-wrench", items: ["Git", "GitHub", "VS Code", "Postman", "JIRA"] },
  { category: "AI / ML", icon: "fa-brain", items: ["Python", "PyTorch", "FastAPI", "Transformers", "Google Generative AI"] },
  { category: "Client & Delivery", icon: "fa-handshake", items: ["Stakeholder communication", "Requirement discovery", "Team leadership", "Code reviews", "Legacy migrations", "Production support"] },
];

const GITHUB_STATS = {
  username: "amnnrajbhar",
  profileUrl: "https://github.com/amnnrajbhar",
  topLanguages: [
    { name: "TypeScript / Angular", percent: 45, color: "#3178c6" },
    { name: "C# / ASP.NET", percent: 25, color: "#178600" },
    { name: "JavaScript / HTML / CSS", percent: 18, color: "#f1e05a" },
    { name: "Python / PyTorch", percent: 12, color: "#3572A5" }
  ],
  stats: [
    { label: "Public Repositories", value: "15+" },
    { label: "Primary Focus", value: "Full Stack & AI" },
    { label: "Contributions", value: "Active Builder" }
  ]
};

// Forward-deployed "how I work" playbook — every proof line is backed by EXPERIENCE / PROJECTS above
const PLAYBOOK = [
  {
    step: "discover",
    icon: "fa-magnifying-glass-chart",
    title: "Embed & discover",
    text: "Work directly with client stakeholders and cross-functional teams to understand the real workflow, then turn it into a scoped, buildable plan.",
    proof: "Delivered for enterprise clients in insurance & pharma; 12+ enterprise projects",
  },
  {
    step: "prototype",
    icon: "fa-bolt",
    title: "Prototype fast",
    text: "Ship a working slice in days, not months, and iterate with real users instead of debating specs.",
    proof: "8+ live apps shipped: Money Manager, HRMS, GenAI chatbot, LMS…",
  },
  {
    step: "deploy",
    icon: "fa-rocket",
    title: "Deploy & modernize",
    text: "Move legacy systems onto modern stacks without breaking the business, leading the team that does it.",
    proof: "Angular 6 → 19 (led team of 6) · Angular → Next.js 16",
  },
  {
    step: "own",
    icon: "fa-chart-line",
    title: "Own the outcome",
    text: "Measure what matters, optimize it, and stay on the hook for production until it runs smoothly.",
    proof: "70% faster load times · critical production bugs resolved",
  },
];

const DOMAINS = ["Insurance", "Pharma", "Banking & FinTech", "Enterprise HR", "Personal Finance", "AI / LLMs"];
