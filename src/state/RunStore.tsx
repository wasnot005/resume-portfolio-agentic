import React from 'react'
import type { ResumeData } from '../types/Schema'
import type { DesignPlanT } from '../types/DesignPlan'
import type { RenderConfigT } from '../types/RenderConfig'

type Store = {
  resumeData: ResumeData | null
  prdMd: string | null
  designPlan: DesignPlanT | null
  renderConfig: RenderConfigT | null
  setResumeData: (d: ResumeData) => void
  setPrdMd: (m: string) => void
  setDesignPlan: (p: DesignPlanT) => void
  setRenderConfig: (r: RenderConfigT) => void
}

const Ctx = React.createContext<Store>({
  resumeData: null,
  prdMd: null,
  designPlan: null,
  renderConfig: null,
  setResumeData: () => {},
  setPrdMd: () => {},
  setDesignPlan: () => {},
  setRenderConfig: () => {},
})

export function RunStoreProvider({ children }: { children: React.ReactNode }) {
  const [resumeData, setResumeData] = React.useState<ResumeData | null>(null)
  const [prdMd, setPrdMd] = React.useState<string | null>(null)
  const [designPlan, setDesignPlan] = React.useState<DesignPlanT | null>(null)
  const [renderConfig, setRenderConfig] = React.useState<RenderConfigT | null>(null)

  return (
    <Ctx.Provider value={{ resumeData, prdMd, designPlan, renderConfig, setResumeData, setPrdMd, setDesignPlan, setRenderConfig }}>
      {children}
    </Ctx.Provider>
  )
}

export function useRunStore() {
  return React.useContext(Ctx)
}
