
import { z } from 'zod'

export const ExperienceItem = z.object({
  role: z.string().nullable(),
  company: z.string().nullable(),
  start: z.string().nullable(),
  end: z.string().nullable(),
  highlights: z.array(z.string()).default([]),
})

export const ProjectItem = z.object({
  name: z.string().nullable(),
  description: z.string().nullable(),
  tech: z.array(z.string()).default([]),
  links: z.object({
    live: z.string().nullable(),
    repo: z.string().nullable(),
    case: z.string().nullable(),
  }).default({ live: null, repo: null, case: null }),
})

export const EducationItem = z.object({
  degree: z.string().nullable(),
  school: z.string().nullable(),
  year: z.string().nullable(),
  highlights: z.array(z.string()).default([]),
})

export const ResumeSchema = z.object({
  name: z.string().nullable().default(null),
  headline: z.string().nullable().default(null),
  location: z.string().nullable().default(null),
  summary: z.string().nullable().default(null),
  skills_core: z.array(z.string()).default([]),
  skills_tools: z.array(z.string()).default([]),
  experience: z.array(ExperienceItem).default([]),
  projects: z.array(ProjectItem).default([]),
  education: z.array(EducationItem).default([]),
  awards: z.array(z.string()).default([]),
  certifications: z.array(z.string()).default([]),
  contact: z.object({
    email: z.string().nullable(),
    phone: z.string().nullable(),
    website: z.string().nullable(),
    github: z.string().nullable(),
    linkedin: z.string().nullable(),
    twitter: z.string().nullable(),
  }).default({ email: null, phone: null, website: null, github: null, linkedin: null, twitter: null }),
  assets: z.object({
    headshot_url: z.string().nullable(),
    logo_url: z.string().nullable(),
  }).default({ headshot_url: null, logo_url: null }),
})

export type ResumeData = z.infer<typeof ResumeSchema>
