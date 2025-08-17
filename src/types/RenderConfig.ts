export type ThemeT = {
  background: string
  foreground: string
  primary: string
  primaryForeground: string
  accent: string
  muted: string
  radius: number
}

export type HeroSection = {
  type: 'hero'
  variant?: 'left' | 'center'
  showLocation?: boolean
  ctaLabel?: string
}

export type ProjectsSection = {
  type: 'projects'
  cardStyle?: 'solid' | 'outline'
  colsDesktop?: number
}

export type ExperienceSection = {
  type: 'experience'
  style?: 'timeline' | 'cards'
  bulletsMax?: number
}

export type SkillsSection = {
  type: 'skills'
  visibleMax?: number
}

export type AboutSection = { type: 'about' }
export type EducationSection = { type: 'education' }
export type ContactSection = { type: 'contact' }

export type SectionT =
  | HeroSection
  | ProjectsSection
  | ExperienceSection
  | SkillsSection
  | AboutSection
  | EducationSection
  | ContactSection

export type RenderConfigT = {
  theme: ThemeT
  sections: SectionT[]
}
