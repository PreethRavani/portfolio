export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  category: string;
  tags: string[];
  image?: string;
  featured: boolean;
  year?: string;
  role: string;
  links: {
    live?: string;
    github?: string;
    caseStudy?: string;
  };
  metrics?: {
    label: string;
    value: string;
  }[];
  overview?: string;
  features?: string[];
  techStack?: {
    category: string;
    items: string[];
  }[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  year: string;
  badge: string;
  status: "current" | "done";
  align: "left" | "right";
  description?: string;
}

export interface SkillItem {
  name: string;
  percent: number;
  category: "frontend" | "backend" | "tools";
}

export interface CertificationItem {
  title: string;
  issuer: string;
  year: string;
  verified: boolean;
  description: string;
  verifyUrl?: string;
}

export interface AchievementItem {
  glyph: string;
  number: number;
  suffix: string;
  label: string;
  description?: string;
}

export interface SocialLink {
  name: string;
  handle: string;
  url: string;
  iconName: string;
}

export interface SiteMeta {
  name: string;
  role: string;
  location: string;
  email: string;
  phone: string;
  availableForWork: boolean;
  bio: string;
  fullBio: string;
}
