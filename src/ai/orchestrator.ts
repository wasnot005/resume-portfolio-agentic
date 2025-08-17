import type { ResumeData } from '../types/Schema'
import type { DesignPlanT } from '../types/DesignPlan'
import type { RenderConfigT } from '../types/RenderConfig'

export async function runPRDOrchestrator(apiKey: string, data: ResumeData): Promise<string> {
  return ''
}

export async function runDesignPlanner(apiKey: string, data: ResumeData, prdMd: string, seed?: number): Promise<DesignPlanT> {
  return {} as any
}

export async function runUIBuilder(apiKey: string, data: ResumeData, plan: DesignPlanT): Promise<RenderConfigT> {
  return { theme: { background: '#fff', foreground: '#000', primary: '#000', primaryForeground: '#fff', accent: '#000', muted: '#666', radius: 0 } } as any
}
