/**
 * STEP 1 — Extractor/Polisher
 * Input: raw resume TEXT
 * Output: SINGLE JSON matching ResumeSchema
 * Notes: No invention, concise impact bullets, keep exact numbers, return ONLY JSON.
 */
export const EXTRACTOR_PROMPT = `You are a resume→portfolio transformer.
Given the user's RESUME TEXT, output a SINGLE JSON object exactly matching this schema:

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
- Rewrite responsibilities into 3–5 achievement bullets per role (≤160 chars each, active verbs). Keep exact metrics.
- If unknown, use null/empty arrays.
- Return ONLY valid JSON (no markdown, no commentary).
RESUME_TEXT:`

