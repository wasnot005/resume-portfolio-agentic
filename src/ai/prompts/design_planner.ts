/**
 * STEP 3 — Design Planner
 * Input: { resume_json, prd_md, seed?: number }
 * Output: ThemeSpec + LayoutPlan JSON (Zod schema validates it).
 */
export const DESIGN_PLANNER_PROMPT = `You are a senior product designer.
Plan a distinctive but accessible visual system and layout for a resume→portfolio site.

Return ONLY JSON with this exact shape:
{
  "seed": number,
  "theme": {
    "brand": { "name": string, "keywords": string[] },
    "palette": {
      "background": string, "foreground": string,
      "primary": string, "primaryForeground": string,
      "accent": string, "muted": string
    },
    "typography": { "heading": string, "body": string, "feature": string|null },
    "radiusRem": number, "motion": { "reducedByDefault": boolean, "maxTranslatePx": number }
  },
  "layout": {
    "sectionOrder": string[],
    "heroVariant": "left-avatar"|"centered"|"split",
    "projects": { "cardStyle": "flat"|"elevated"|"bordered", "colsDesktop": 2|3 },
    "experience": { "style": "timeline"|"cards", "bulletsMax": 5 },
    "skills": { "grouping": "core-first"|"mixed", "visibleMax": number }
  }
}

Rules:
- Ensure WCAG AA contrast; avoid overly light grays.
- Choose palette & type that fit the resume domain (developer vs designer vs student).
- Use the seed to vary choices so different resumes look different.
- NO markdown, ONLY JSON.

Inputs you have:
- resume_json
- prd_md
- seed
`

