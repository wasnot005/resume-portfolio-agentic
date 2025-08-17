
import React from 'react'
import { UploadDropzone } from './components/UploadDropzone'
import { readFileToText } from './lib/Parser'
import { geminiExtractAndPolish } from './lib/GeminiClient'
import { ResumeSchema, type ResumeData } from './types/Schema'
import PortfolioPreview from './components/PortfolioPreview'
import { exportStaticSite } from './lib/ExportZip'

export default function App() {
  const [apiKey, setApiKey] = React.useState<string>('')
  const [model, setModel] = React.useState<'gemini-1.5-flash' | 'gemini-1.5-pro'>('gemini-1.5-flash')
  const [status, setStatus] = React.useState<string>('')
  const [error, setError] = React.useState<string>('')
  const [resumeData, setResumeData] = React.useState<ResumeData | null>(null)

  async function handleFile(file: File) {
    setError('')
    if (file.size > 10 * 1024 * 1024) {
      setError('File is too large (max 10 MB).')
      return
    }
    try {
      setStatus('Reading file...')
      const { kind, text } = await readFileToText(file)

      let data: ResumeData | null = null
      if (kind === 'json') {
        setStatus('Validating JSON...')
        const parsed = JSON.parse(text)
        const validated = ResumeSchema.safeParse(parsed)
        if (!validated.success) throw new Error('JSON does not match schema.')
        data = validated.data
      } else {
        if (!apiKey) { throw new Error('Enter your Gemini API key to proceed.') }
        setStatus('Sending to Gemini for extraction...')
        data = await geminiExtractAndPolish({ apiKey, resumeText: text, model })
      }

      setResumeData(data)
      setStatus('Done.')
    } catch (e: any) {
      console.error(e)
      setError(e.message || 'Something went wrong.')
      setStatus('')
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Resume → Portfolio (Gemini)</h1>
        <p className="text-slate-600">Upload a resume; get a polished portfolio website preview, then export a static site.</p>
      </header>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          <UploadDropzone onFile={handleFile} />
          <div className="flex items-center gap-2">
            <label className="text-sm w-36">Gemini API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="Paste key (not stored)"
              className="flex-1 border rounded-xl px-3 py-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm w-36">Model</label>
            <select value={model} onChange={e => setModel(e.target.value as any)} className="border rounded-xl px-3 py-2">
              <option value="gemini-1.5-flash">gemini-1.5-flash</option>
              <option value="gemini-1.5-pro">gemini-1.5-pro</option>
            </select>
          </div>

          {status && <p className="text-sm text-slate-600">Status: {status}</p>}
          {error && <p className="text-sm text-red-600">Error: {error}</p>}
        </div>

        <aside className="space-y-2">
          <div className="border rounded-xl p-3 bg-slate-50">
            <h2 className="font-semibold mb-1">How it works</h2>
            <ol className="list-decimal ml-5 text-sm text-slate-700 space-y-1">
              <li>Upload a resume (PDF/DOCX/TXT/JSON).</li>
              <li>Client extracts text; Gemini converts to a structured schema.</li>
              <li>Preview renders live; export a static site as ZIP.</li>
            </ol>
            <p className="text-xs text-slate-500 mt-2">Prototype note: Enter your API key each session. Do not share secrets.</p>
          </div>
          {resumeData && (
            <button
              onClick={() => exportStaticSite(resumeData)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 text-white"
            >
              Export Static Site (.zip)
            </button>
          )}
        </aside>
      </section>

      {resumeData && (
        <section>
          <h2 className="text-xl font-semibold mb-3">Live Preview</h2>
          <PortfolioPreview data={resumeData} />
        </section>
      )}

      <footer className="pt-6 text-sm text-slate-500">
        <p>Accessibility: semantic headings, alt text on avatars, keyboard-friendly controls.</p>
      </footer>
    </div>
  )
}
