import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useRunStore } from '../state/RunStore'
import RenderedPage from '../components/RenderedPage'
import { runDesignPlanner, runUIBuilder } from '../ai/orchestrator'

export default function Preview() {
  const nav = useNavigate()
  const { resumeData, prdMd, designPlan, renderConfig, setDesignPlan, setRenderConfig } = useRunStore()
  const [status, setStatus] = React.useState('')
  const [showPRD, setShowPRD] = React.useState(false)

  if (!resumeData || !renderConfig) {
    nav('/')
    return null
  }

  async function shuffleDesign() {
    try {
      setStatus('Shuffling design…')
      // Re-plan with a fresh seed, then rebuild UI
      const apiKeyInput = document.querySelector<HTMLInputElement>('input[type="password"]')
      const apiKey = apiKeyInput?.value || '' // or add your own key field here
      if (!apiKey) throw new Error('Go back and paste your Gemini API key on the Home page.')
      const newPlan = await runDesignPlanner(apiKey, resumeData, prdMd || '', Math.floor(Math.random()*10000))
      setDesignPlan(newPlan)
      const newConfig = await runUIBuilder(apiKey, resumeData, newPlan)
      setRenderConfig(newConfig)
      setStatus('Done.')
    } catch (e: any) {
      setStatus(e.message || 'Shuffle failed.')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex flex-wrap gap-2 justify-between items-center mb-4">
          <button className="px-3 py-2 rounded-xl border" onClick={() => nav('/')}>← Back</button>
          <div className="flex gap-2">
            <button className="px-3 py-2 rounded-xl border" onClick={() => setShowPRD(v => !v)}>{showPRD ? 'Hide PRD' : 'Show PRD'}</button>
            <button className="px-3 py-2 rounded-xl bg-slate-900 text-white" onClick={shuffleDesign}>Shuffle Design</button>
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
    </div>
  )
}
