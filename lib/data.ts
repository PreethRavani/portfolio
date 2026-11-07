import { Project, EducationItem, SkillItem, CertificationItem, AchievementItem, SocialLink, SiteMeta } from "./types";

export const siteMeta: SiteMeta = {
  name: "Preeth Ravani",
  role: "Full-Stack Developer & Engineering Student",
  location: "Mumbai, India",
  email: "preethravani@gmail.com",
  phone: "+91 9324757227",
  availableForWork: true,
  bio: "Full-stack developer & engineering student building clean, purposeful digital solutions — from scratch to deployed interfaces.",
  fullBio: "I'm an engineering student who turns ideas into real, working products. With a strong foundation in data structures, database systems, and modern web architectures (Next.js, TypeScript, MERN stack), I enjoy the full arc of building software — sketching the logic, shaping the interface, and shipping high-performance experiences people love to use.",
};

export const statsData = [
  { target: 4, suffix: "", label: "Highlighted Projects" },
  { target: 12, suffix: "", label: "Skills & Tools" },
  { target: 9, suffix: "", label: "Public Repositories" },
  { target: 2, suffix: "", label: "Live Deployments" },
];

export const educationList: EducationItem[] = [
  {
    id: "eng",
    institution: "DJ Sanghvi College of Engineering",
    degree: "B.Tech in Information Technology",
    year: "2025 — 2029 · PRESENT",
    badge: "CGPA = 9.33",
    status: "current",
    align: "left",
    description: "Focusing on Advanced Data Structures, System Design, Algorithms, Database Engineering, and Modern Web Systems.",
  },
  {
    id: "hsc",
    institution: "Rahul International School",
    degree: "CBSE Class 12th (Science & CS)",
    year: "2023 — 2025",
    badge: "87% Score",
    status: "done",
    align: "right",
    description: "Specialized in Computer Science, Mathematics, Physics, and analytical problem solving.",
  },
  {
    id: "icse",
    institution: "Vidya Vikasini School",
    degree: "ICSE Class 10th",
    year: "2011 — 2023",
    badge: "95% Distinction",
    status: "done",
    align: "left",
    description: "Graduated with highest honors and computer science fundamentals distinction.",
  },
];

export const skillsList: SkillItem[] = [
  // Frontend
  { name: "TypeScript & JavaScript", percent: 85, category: "frontend" },
  { name: "React & Next.js", percent: 80, category: "frontend" },
  { name: "HTML5 & Modern CSS / Tailwind", percent: 92, category: "frontend" },
  { name: "UI/UX & Responsive Engineering", percent: 80, category: "frontend" },

  // Backend
  { name: "Node.js & Express", percent: 65, category: "backend" },
  { name: "Python", percent: 60, category: "backend" },
  { name: "SQL & Relational DBs", percent: 70, category: "backend" },
  { name: "MongoDB & NoSQL", percent: 60, category: "backend" },

  // Tools
  { name: "Git & GitHub Workflows", percent: 95, category: "tools" },
  { name: "Vercel & Cloud Deployment", percent: 85, category: "tools" },
  { name: "Figma to Code", percent: 75, category: "tools" },
  { name: "Postman & API Design", percent: 80, category: "tools" },
];

export const projectsList: Project[] = [
  {
    slug: "netflix-clone",
    title: "Netflix Interface Study",
    subtitle: "A front-end recreation inspired by a familiar streaming experience.",
    description: "A focused HTML and CSS project exploring a cinematic, content-first interface.",
    longDescription: "This project recreates a streaming-service landing experience as a browser-based front-end. The repository is available to explore; this page avoids claiming features or performance figures that are not documented there.",
    category: "Web Interface",
    tags: ["HTML", "CSS"],
    image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    role: "Independent project",
    year: "2024",
    links: { github: "https://github.com/PreethRavani/netflix-clone" },
    overview: "A visual exercise in layout, hierarchy, and styling for a media-focused homepage.",
    techStack: [{ category: "Interface", items: ["HTML", "CSS"] }],
  },
  {
    slug: "hand-cricket",
    title: "Hand Cricket",
    subtitle: "A lightweight browser game with a live deployment.",
    description: "A small interactive game built for the browser, with its current deployment available to try.",
    longDescription: "The public repository is named reddit-app, while its linked deployment is titled Hand Cricket. The project is presented here under the experience visitors can play, with the source link preserved for inspection.",
    category: "Interactive Game",
    tags: ["HTML", "CSS", "JavaScript"],
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    role: "Independent project",
    year: "2024",
    links: {
      live: "https://hand-cricket-teal.vercel.app",
      github: "https://github.com/PreethRavani/reddit-app",
    },
    overview: "Open the live version to try it, or inspect the source in the linked repository.",
    techStack: [{ category: "Interface", items: ["HTML", "CSS", "JavaScript"] }],
  },
  {
    slug: "hangman",
    title: "Hangman",
    subtitle: "A classic word game, built for the browser.",
    description: "A compact browser game project with its source available on GitHub.",
    longDescription: "Hangman is one of the small interactive projects in the public portfolio of repositories. Its source is linked below; details are kept concise until there is a project write-up to support a fuller case study.",
    category: "Browser Game",
    tags: ["HTML", "CSS", "JavaScript"],
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    role: "Independent project",
    year: "2024",
    links: { github: "https://github.com/PreethRavani/hang-man" },
    overview: "A small project focused on turning a familiar game into an interactive web page.",
    techStack: [{ category: "Interface", items: ["HTML", "CSS", "JavaScript"] }],
  },
  {
    slug: "coworking-space",
    title: "Coworking Space",
    subtitle: "A web design practice project for a shared workspace.",
    description: "A visual web project exploring a coworking-space concept.",
    longDescription: "This project is available as Coworking-Space-Practice on GitHub. The portfolio keeps the summary factual and links directly to the source rather than inventing product capabilities.",
    category: "Web Design",
    tags: ["HTML", "CSS"],
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    role: "Independent project",
    year: "2024",
    links: { github: "https://github.com/PreethRavani/Coworking-Space-Practice" },
    overview: "A front-end practice project centered on a shared-workspace website concept.",
    techStack: [{ category: "Interface", items: ["HTML", "CSS"] }],
  },
];

export const certificationsList: CertificationItem[] = [
  {
    title: "Learning the JavaScript Language",
    issuer: "LinkedIn Learning",
    year: "2025",
    verified: true,
    description: "Mastered modern ECMAScript specifications, asynchronous control flows, event loops, closures, and object-oriented design patterns.",
  },
  {
    title: "HTML and CSS Mastery",
    issuer: "Coddy Learning",
    year: "2025",
    verified: true,
    description: "Comprehensive deep-dive into semantic document structures, modern CSS Grid/Flexbox layouts, responsive design, and CSS variables.",
  },
  {
    title: "Full Stack Web Development",
    issuer: "Scrimba",
    year: "2025",
    verified: true,
    description: "Hands-on project engineering across the client-server boundary: state management, RESTful APIs, database design, and production builds.",
  },
  {
    title: "Introduction to JavaScript",
    issuer: "Coddy Learning",
    year: "2025",
    verified: true,
    description: "Foundational programming paradigms, algorithm problem-solving, DOM manipulation, and dynamic client-side scripting.",
  },
];

export const achievementsList: AchievementItem[] = [
  {
    glyph: "▲",
    number: 9.57,
    suffix: "",
    label: "College GPA",
    description: "Current score listed for B.Tech Information Technology at DJ Sanghvi College of Engineering.",
  },
  {
    glyph: "●",
    number: 50,
    suffix: "+",
    label: "DSA Problems Solved",
    description: "A self-reported practice milestone across data structures and algorithms.",
  },
  {
    glyph: "◆",
    number: 4,
    suffix: "",
    label: "Highlighted Projects",
    description: "A curated set of public projects with direct links to their source repositories.",
  },
  {
    glyph: "■",
    number: 2,
    suffix: "",
    label: "Live Deployments",
    description: "Two live experiences are linked directly from the featured project cards.",
  },
];

export const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    handle: "@PreethRavani",
    url: "https://github.com/PreethRavani",
    iconName: "github",
  },
  {
    name: "LinkedIn",
    handle: "preeth-ravani",
    url: "https://www.linkedin.com/in/preeth-ravani-60833b375",
    iconName: "linkedin",
  },
  {
    name: "WhatsApp",
    handle: "+91 9324757227",
    url: "https://wa.me/919324757227?text=Hey%2C%20Let's%20Connect",
    iconName: "message-circle",
  },
  {
    name: "Instagram",
    handle: "@preeth_ravani",
    url: "https://www.instagram.com/preeth_ravani/",
    iconName: "instagram",
  },
];
