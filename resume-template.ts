// Structured schema for the "Jake" resume template.
// This is the single source of truth: the AI fills these fields, and the
// renderer + PDF export consume them. Layout/typography never change.
import { z } from "zod";

export const contactSchema = z.object({
  fullName: z.string().default(""),
  phone: z.string().default(""),
  email: z.string().default(""),
  linkedin: z.string().default(""), // display text e.g. linkedin.com/in/jake
  linkedinUrl: z.string().default(""),
  github: z.string().default(""), // display text e.g. github.com/jake
  githubUrl: z.string().default(""),
  portfolio: z.string().default(""),
  portfolioUrl: z.string().default(""),
});

export const educationItemSchema = z.object({
  institution: z.string().default(""),
  location: z.string().default(""),
  degree: z.string().default(""),
  dates: z.string().default(""),
});

export const experienceItemSchema = z.object({
  title: z.string().default(""),
  dates: z.string().default(""),
  organization: z.string().default(""),
  location: z.string().default(""),
  bullets: z.array(z.string()).default([]),
});

export const projectItemSchema = z.object({
  name: z.string().default(""),
  technologies: z.string().default(""),
  dates: z.string().default(""),
  bullets: z.array(z.string()).default([]),
});

export const skillsSchema = z.object({
  languages: z.string().default(""),
  frameworks: z.string().default(""),
  developerTools: z.string().default(""),
  libraries: z.string().default(""),
});

// Optional, factual extra sections used to fill remaining page space.
// title e.g. "Certifications", "Awards", "Volunteer Experience".
export const additionalSectionSchema = z.object({
  title: z.string().default(""),
  items: z.array(z.string()).default([]),
});

export const resumeTemplateSchema = z.object({
  contact: contactSchema,
  education: z.array(educationItemSchema).default([]),
  experience: z.array(experienceItemSchema).default([]),
  projects: z.array(projectItemSchema).default([]),
  skills: skillsSchema,
  // Additional FACTUAL sections extracted from the user's resume only.
  additionalSections: z.array(additionalSectionSchema).default([]),
  // Categories the user could provide info for (suggestions only — never
  // fabricated content). Shown in a recommendation panel, never rendered
  // inside the resume document.
  recommendedSections: z.array(z.string()).default([]),
});

export type Contact = z.infer<typeof contactSchema>;
export type EducationItem = z.infer<typeof educationItemSchema>;
export type ExperienceItem = z.infer<typeof experienceItemSchema>;
export type ProjectItem = z.infer<typeof projectItemSchema>;
export type Skills = z.infer<typeof skillsSchema>;
export type AdditionalSection = z.infer<typeof additionalSectionSchema>;
export type ResumeTemplate = z.infer<typeof resumeTemplateSchema>;

export const atsReportSchema = z.object({
  score: z.number().min(0).max(100).default(0),
  missingKeywords: z.array(z.string()).default([]),
  matchedKeywords: z.array(z.string()).default([]),
  strengths: z.array(z.string()).default([]),
  improvementAreas: z.array(z.string()).default([]),
  suggestions: z.array(z.string()).default([]),
});

export type AtsReport = z.infer<typeof atsReportSchema>;

export const emptyTemplate = (): ResumeTemplate => ({
  contact: {
    fullName: "",
    phone: "",
    email: "",
    linkedin: "",
    linkedinUrl: "",
    github: "",
    githubUrl: "",
    portfolio: "",
    portfolioUrl: "",
  },
  education: [],
  experience: [],
  projects: [],
  skills: { languages: "", frameworks: "", developerTools: "", libraries: "" },
  additionalSections: [],
  recommendedSections: [],
});
