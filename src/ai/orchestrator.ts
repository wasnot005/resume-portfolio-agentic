import type { ResumeData } from '../types/Schema'
import type { DesignPlanT } from '../types/DesignPlan'
import type { RenderConfigT, SectionT } from '../types/RenderConfig'
import { geminiExtractAndPolish, type GeminiModel } from '../lib/GeminiClient'

export async function runExtractor(apiKey: string, text: string, model: GeminiModel) {
  return geminiExtractAndPolish({ apiKey, resumeText: text, model })
}

export async function runPRD(
  apiKey: string,
  data: ResumeData,
  opts: { purpose: string; primary_cta: string }
): Promise<string> {
  return `# Product Requirements Document\n\nPurpose: ${opts.purpose}\nPrimary CTA: ${opts.primary_cta}`
}

export async function runDesignPlanner(
  apiKey: string,
  data: ResumeData,
  prdMd: string,
  seed?: number
): Promise<DesignPlanT> {
  return { seed: seed ?? Math.floor(Math.random() * 10000) }
}

export async function runUIBuilder(apiKey: string, data: ResumeData, plan: DesignPlanT): Promise<RenderConfigT> {
  const sections: SectionT[] = [
    { type: 'hero', showLocation: true, ctaLabel: 'Contact Me' },
    { type: 'projects', cardStyle: 'solid', colsDesktop: 2 },
    { type: 'experience', style: 'timeline', bulletsMax: 3 },
    { type: 'skills', visibleMax: 8 },
    { type: 'about' },
    { type: 'education' },
    { type: 'contact' },
  ]
  return {
    theme: {
      background: '0 0% 100%',
      foreground: '0 0% 0%',
      primary: '217 91% 60%',
      primaryForeground: '0 0% 100%',
      accent: '210 40% 96%',
      muted: '215 20% 65%',
      radius: 0.5,
    },
    sections,
  }
}
