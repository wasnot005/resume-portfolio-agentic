import JSZip from 'jszip'
import type { RenderConfigT } from '../types/RenderConfig'
import type { ResumeData } from '../types/Schema'

export async function exportStaticSiteFromRenderConfig(cfg: RenderConfigT, data: ResumeData, prdMd?: string) {
  const zip = new JSZip()
  zip.file('index.html', generateHTML(data))
  zip.file('styles.css', generateCSS(cfg))
  if (prdMd) zip.file('prd.md', prdMd)
  const blob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'portfolio-site.zip'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function safe(s?: string | null) { return s ?? '' }

function generateHTML(d: ResumeData) {
  const skills = [...(d.skills_core || []), ...(d.skills_tools || [])]
  const projects = d.projects?.filter(p => p?.name) ?? []
  const experience = d.experience ?? []
  const awards = d.awards ?? []
  const certs = d.certifications ?? []
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${safe(d.name)} — Portfolio</title><link rel="stylesheet" href="./styles.css"/></head><body><header class="container"><h1>${safe(d.name)}</h1><p class="headline">${safe(d.headline)}</p></header><main class="container">${skills.length?`<section><h2>Skills</h2><ul class="tags">${skills.map(s=>`<li>${s}</li>`).join('')}</ul></section>`:''}${projects.length?`<section><h2>Projects</h2><div class="grid">${projects.map(p=>`<article class="card"><h3>${safe(p.name)}</h3><p>${safe(p.description)}</p>${p.tech?.length?`<ul class="tags">${p.tech.map(t=>`<li>${t}</li>`).join('')}</ul>`:''}${p.links?(p.links.live||p.links.repo||p.links.case?`<p class="links">${p.links.live?`<a target="_blank" rel="noopener" href="${safe(p.links.live)}">Live</a>`:''}${p.links.repo?`<a target="_blank" rel="noopener" href="${safe(p.links.repo)}">Repo</a>`:''}${p.links.case?`<a target="_blank" rel="noopener" href="${safe(p.links.case)}">Case</a>`:''}</p>`:''):''}</article>`).join('')}</div></section>`:''}${experience.length?`<section><h2>Experience</h2>${experience.map(e=>`<article class="xp"><h3>${safe(e.role)} · ${safe(e.company)}</h3><p class="meta">${safe(e.start)} — ${safe(e.end)||'Present'}</p>${e.highlights?.length?`<ul>${e.highlights.map(h=>`<li>${h}</li>`).join('')}</ul>`:''}</article>`).join('')}</section>`:''}${d.summary?`<section><h2>About</h2><p>${safe(d.summary)}</p></section>`:''}${d.education?.length?`<section><h2>Education</h2><ul class="edu">${d.education.map(ed=>`<li><strong>${safe(ed.degree)}</strong>, ${safe(ed.school)} (${safe(ed.year)}) ${ed.highlights?.length?`— ${ed.highlights.join('; ')}`:''}</li>`).join('')}</ul></section>`:''}${(awards.length||certs.length)?`<section><h2>Certifications & Awards</h2><ul class="tags">${[...awards.map(a=>`Award: ${a}`),...certs.map(c=>`Cert: ${c}`)].map(x=>`<li>${x}</li>`).join('')}</ul></section>`:''}${(d.contact?.github||d.contact?.linkedin||d.contact?.twitter||d.contact?.website)?`<section><h2>Links</h2><ul class="links">${d.contact.github?`<li><a target="_blank" rel="noopener" href="${safe(d.contact.github)}">GitHub</a></li>`:''}${d.contact.linkedin?`<li><a target="_blank" rel="noopener" href="${safe(d.contact.linkedin)}">LinkedIn</a></li>`:''}${d.contact.twitter?`<li><a target="_blank" rel="noopener" href="${safe(d.contact.twitter)}">Twitter</a></li>`:''}${d.contact.website?`<li><a target="_blank" rel="noopener" href="${safe(d.contact.website)}">Website</a></li>`:''}</ul></section>`:''}</main><footer class="container"><p>© ${new Date().getFullYear()} ${safe(d.name)}. Built from resume.</p></footer></body></html>`
}

function generateCSS(cfg: RenderConfigT) {
  const t: any = cfg?.theme || {}
  return `:root{--background:${t.background||'#fff'};--foreground:${t.foreground||'#000'};--primary:${t.primary||'#000'};--primary-foreground:${t.primaryForeground||'#fff'};--accent:${t.accent||'#000'};--muted:${t.muted||'#666'};--radius:${t.radius||0}rem}body{margin:0;background:var(--background);color:var(--foreground);font:16px/1.6 system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial}a{color:var(--primary)}.container{max-width:1100px;margin:0 auto;padding:24px}h1{font-size:clamp(28px,5vw,40px);margin:4px 0 8px}h2{font-size:22px;margin:32px 0 12px}h3{font-size:18px;margin:8px 0}p{margin:8px 0}.headline{color:var(--muted)}.tags{display:flex;flex-wrap:wrap;gap:8px;padding:0;margin:0;list-style:none}.tags li{background:var(--accent);border-radius:999px;padding:6px 10px;font-size:13px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}.card{background:var(--accent);border-radius:var(--radius);padding:16px}.links a{margin-right:12px}.xp{border-left:3px solid var(--muted);padding-left:12px;margin:12px 0}.edu{padding-left:18px}footer{color:var(--muted);margin-top:32px;border-top:1px solid var(--muted);padding-top:16px}`
}
