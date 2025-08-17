import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useRunStore } from '../state/RunStore'
import { useApiKey } from '../state/ApiKeyStore'
import RenderedPage from '../components/RenderedPage'
import ThemeShell from '../components/ThemeShell'
import { runDesignPlanner, runUIBuilder } from '../ai/orchestrator'
import { exportStaticSiteFromRenderConfig } from '../lib/exporter'

export default function Preview() {
  const nav = useNavigate()
  const { apiKey } = useApiKey()
  const { resumeData, prdMd, renderConfig, setDesignPlan, setRenderConfig } = useRunStore()
  const [status, setStatus] = React.useState('')
  const [showPRD, setShowPRD] = React.useState(false)
  const [toast, setToast] = React.useState<string | null>(null)
  const [seed, setSeed] = React.useState('random')

  if (!resumeData || !renderConfig) {
    nav('/')
    return null
  }

  if (!apiKey) {
    return <div className="p-6">Go back and paste your Gemini key on the Home page.</div>
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  async function shuffleDesign() {
    try {
      setStatus('Shuffling design…')
      const newPlan = await runDesignPlanner(apiKey, resumeData, prdMd || '', Math.floor(Math.random() * 10000))
      setDesignPlan(newPlan)
      const newConfig = await runUIBuilder(apiKey, resumeData, newPlan)
      setRenderConfig(newConfig)
      setStatus('Done.')
    } catch (err: any) {
      console.error(err)
      setStatus('')
      showToast('Shuffle failed. Fixing and retrying…')
      try {
        const newPlan = await runDesignPlanner(apiKey, resumeData, prdMd || '', Math.floor(Math.random() * 10000))
        setDesignPlan(newPlan)
        const newConfig = await runUIBuilder(apiKey, resumeData, newPlan)
        setRenderConfig(newConfig)
        setStatus('Done.')
      } catch (e: any) {
        console.error(e)
        showToast(e.message || 'Shuffle failed.')
      }
    }
  }

  async function handleSeedChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value
    setSeed(value)
    const chosen = value === 'random' ? Math.floor(Math.random() * 10000) : parseInt(value, 10)
    try {
      setStatus('Rebuilding…')
      const plan = await runDesignPlanner(apiKey, resumeData, prdMd || '', chosen)
      setDesignPlan(plan)
      const cfg = await runUIBuilder(apiKey, resumeData, plan)
      setRenderConfig(cfg)
      setStatus('Done.')
    } catch (err: any) {
      console.error(err)
      setStatus('')
      showToast(err.message || 'Failed to rebuild design.')
    }
  }

  async function handleExport() {
    try {
      await exportStaticSiteFromRenderConfig(renderConfig, resumeData, prdMd || undefined)
    } catch (err: any) {
      console.error(err)
      showToast(err.message || 'Export failed.')
    }
  }

  async function copyPRD() {
    if (!prdMd) return
    try {
      await navigator.clipboard.writeText(prdMd)
      showToast('PRD copied!')
    } catch (err) {
      console.error(err)
      showToast('Copy failed.')
    }
  }

  return (
    <ThemeShell theme={renderConfig.theme}>
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex flex-wrap gap-2 justify-between items-center mb-4">
          <button className="px-3 py-2 rounded-xl border" onClick={() => nav('/')}>← Back</button>
          <div className="flex gap-2 items-center flex-wrap">
            <select value={seed} onChange={handleSeedChange} className="border rounded-xl px-2 py-1 text-sm">
              <option value="random">Random</option>
              <option value="101">Seed 101</option>
              <option value="202">Seed 202</option>
              <option value="303">Seed 303</option>
              <option value="404">Seed 404</option>
              <option value="505">Seed 505</option>
            </select>
            <button className="px-3 py-2 rounded-xl border" onClick={() => setShowPRD(v => !v)}>{showPRD ? 'Hide PRD' : 'Show PRD'}</button>
            <button className="px-3 py-2 rounded-xl border" onClick={copyPRD}>Copy PRD</button>
            <button className="px-3 py-2 rounded-xl bg-slate-900 text-white" onClick={shuffleDesign}>Shuffle Design</button>
            <button className="px-3 py-2 rounded-xl border" onClick={handleExport}>Export Static Site (.zip)</button>
          </div>
        </div>

        {status && <p className="text-sm text-slate-600 mb-3">Status: {status}</p>}

        {showPRD && prdMd && (
          <div className="border rounded-xl p-4 bg-slate-50 mb-6 max-h-96 overflow-auto whitespace-pre-wrap">
            {prdMd}
          </div>
        )}

        <RenderedPage data={resumeData} config={renderConfig} />
      </div>
      {toast && <div className="fixed bottom-4 right-4 bg-slate-900 text-white px-4 py-2 rounded">{toast}</div>}
    </ThemeShell>
  )
}
