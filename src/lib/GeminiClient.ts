
import { ResumeSchema, type ResumeData } from '../types/Schema'

export type GeminiModel = 'gemini-1.5-flash' | 'gemini-1.5-pro'

const SYSTEM_PROMPT = `You are a resume-to-portfolio transformer.
Given a user's resume CONTENT, produce a SINGLE JSON object exactly matching this TypeScript-like schema:
{
  "name": string|null,
  "headline": string|null,
  "location": string|null,
  "summary": string|null,
  "skills_core": string[],
  "skills_tools": string[],
  "experience": [{"role": string|null, "company": string|null, "start": string|null, "end": string|null, "highlights": string[]}],
  "projects": [{"name": string|null, "description": string|null, "tech": string[], "links": {"live": string|null, "repo": string|null, "case": string|null}}],
  "education": [{"degree": string|null, "school": string|null, "year": string|null, "highlights": string[]}],
  "awards": string[],
  "certifications": string[],
  "contact": {"email": string|null, "phone": string|null, "website": string|null, "github": string|null, "linkedin": string|null, "twitter": string|null},
  "assets": {"headshot_url": string|null, "logo_url": string|null}
}

Rules:
- DO NOT invent facts; only transform what's present.
- Rewrite bullets to achievement-focused, concise lines (<=160 chars), active voice. Keep exact numbers.
- If unknown, use null or empty arrays.
- Return ONLY valid JSON (no markdown, no comments).
`

export async function geminiExtractAndPolish(opts: {
  apiKey: string
  resumeText: string
  model?: GeminiModel
  temperature?: number
}): Promise<ResumeData> {
  const { apiKey, resumeText, model = 'gemini-1.5-flash', temperature = 0.2 } = opts

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`

  const body = {
    contents: [{
      role: 'user',
      parts: [{ text: SYSTEM_PROMPT + "\n\nCONTENT:\n" + resumeText }]
    }],
    generationConfig: {
      temperature,
      topK: 40,
      topP: 0.95,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
    ]
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const t = await res.text()
    throw new Error(`Gemini API error ${res.status}: ${t}`)
  }

  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  // Try to find JSON in the text
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  const jsonStr = (start >= 0 && end >= 0) ? text.slice(start, end + 1) : text

  let parsed: unknown
  try {
    parsed = JSON.parse(jsonStr)
  } catch (e) {
    throw new Error('Failed to parse JSON from Gemini response.')
  }
  const validated = ResumeSchema.safeParse(parsed)
  if (!validated.success) {
    console.error(validated.error)
    throw new Error('Response did not match schema.')
  }
  return validated.data
}
