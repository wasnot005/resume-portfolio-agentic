import React from 'react'
import { useNavigate } from 'react-router-dom'
import { UploadDropzone } from '../components/UploadDropzone'
import { readFileToText } from '../lib/Parser'
import { ResumeSchema, type ResumeData } from '../types/Schema'
import { useRunStore } from '../state/RunStore'
import { useApiKey } from '../state/ApiKeyStore'
import { runExtractor, runPRD, runDesignPlanner, runUIBuilder } from '../ai/orchestrator'

export default function Home() {
  const nav = useNavigate()
  const { setResumeData, setPrdMd, setDesignPlan, setRenderConfig } = useRunStore()
  const { apiKey, setApiKey, model, setModel } = useApiKey()
  const [file, setFile] = React.useState<File | null>(null)
  const [status, setStatus] = React.useState('')
  const [toast, setToast] = React.useState<string | null>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  async function generate() {
    if (!file) throw new Error('Please upload a resume.')
    if (!apiKey) throw new Error('Paste your Gemini API key.')
    if (file.size > 10 * 1024 * 1024) throw new Error('File too large.')

    setStatus('1/4 Parsing resume…')
    const { kind, text } = await readFileToText(file)

    let data: ResumeData
    if (kind === 'json') {
      const parsed = JSON.parse(text)
      const validated = ResumeSchema.safeParse(parsed)
      if (!validated.success) throw new Error('JSON does not match schema.')
      data = validated.data
    } else {
      data = await runExtractor(apiKey, text, model)
    }
    setResumeData(data)

    setStatus('2/4 Generating PRD…')
    const prd = await runPRD(apiKey, data, { purpose: 'job hunting', primary_cta: 'Contact Me' })
    setPrdMd(prd)

    setStatus('3/4 Planning design…')
    const plan = await runDesignPlanner(apiKey, data, prd, Math.floor(Math.random() * 10000))
    setDesignPlan(plan)

    setStatus('4/4 Building UI…')
    const cfg = await runUIBuilder(apiKey, data, plan)
    setRenderConfig(cfg)

    setStatus('')
    nav('/preview')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await generate()
    } catch (err: any) {
      console.error(err)
      showToast('Fixing and retrying…')
      try {
        await generate()
      } catch (e: any) {
        console.error(e)
        setStatus('')
        showToast(e.message || 'Generation failed.')
      }
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Resume → Portfolio (Gemini)</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <UploadDropzone onPick={setFile} file={file} />
        {file && (
          <button
            type="button"
            className="underline text-sm"
            onClick={() => setFile(null)}
          >
            Replace resume
          </button>
        )}
        <div className="flex items-center gap-2">
          <label className="w-32 text-sm">Gemini API Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="Paste key (not stored)"
            className="flex-1 border rounded-xl px-3 py-2"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="w-32 text-sm">Model</label>
          <select
            value={model}
            onChange={e => setModel(e.target.value as any)}
            className="border rounded-xl px-3 py-2"
          >
            <option value="gemini-1.5-flash">gemini-1.5-flash</option>
            <option value="gemini-1.5-pro">gemini-1.5-pro</option>
          </select>
        </div>
        <button type="submit" className="px-3 py-2 rounded-xl bg-slate-900 text-white">
          Generate (Press Enter)
        </button>
        {status && <p className="text-sm text-slate-600">Status: {status}</p>}
      </form>
      {toast && <div className="fixed bottom-4 right-4 bg-slate-900 text-white px-4 py-2 rounded">{toast}</div>}
    </div>
  )
}
