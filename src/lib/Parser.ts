import * as pdfjsLib from 'pdfjs-dist'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?worker&url'
// Tell PDF.js where to find the worker that Vite bundled locally
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc

import mammoth from 'mammoth/mammoth.browser'

export async function readFileToText(file: File): Promise<{ kind: 'json'|'text', text: string }> {
  const ext = file.name.split('.').pop()?.toLowerCase()

  if (ext === 'json') {
    const text = await file.text()
    return { kind: 'json', text }
  }

  if (ext === 'txt') {
    const text = await file.text()
    return { kind: 'text', text }
  }

  if (ext === 'pdf') {
    const loadingTask = pdfjsLib.getDocument({ data: await file.arrayBuffer() })
    const pdf = await loadingTask.promise
    let fullText = ''
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      const strings = content.items.map((it: any) => ('str' in it ? it.str : '')).join(' ')
      fullText += '\n' + strings
    }
    return { kind: 'text', text: fullText }
  }

  if (ext === 'docx') {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })
    return { kind: 'text', text: result.value }
  }

  // Fallback: try plain text
  const text = await file.text()
  return { kind: 'text', text }
}
