
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import type { ResumeData } from '../types/Schema'

export async function exportStaticSite(data: ResumeData) {
  const zip = new JSZip()

  const html = generateHTML(data)
  const css = generateCSS()

  zip.file('index.html', html)
  zip.file('styles.css', css)

  const blob = await zip.generateAsync({ type: 'blob' })
  saveAs(blob, 'portfolio-site.zip')
}

function safe(s?: string | null) { return s ?? '' }

function generateHTML(d: ResumeData) {
  const skills = [...(d.skills_core || []), ...(d.skills_tools || [])]
  const projects = d.projects?.filter(p => p?.name) ?? []
  const experience = d.experience ?? []
  const awards = d.awards ?? []
  const certs = d.certifications ?? []

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${safe(d.name)} — Portfolio</title>
<link rel="stylesheet" href="./styles.css">
</head>
<body>
<header class="container">
  <div class="hero">
    <div class="avatar">${d.assets?.headshot_url ? `<img src="${d.assets.headshot_url}" alt="${safe(d.name)} headshot"/>` : `<div class="initials">${safe(d.name).split(' ').map(n=>n[0]).join('').slice(0,2)}</div>`}</div>
    <div class="intro">
      <h1>${safe(d.name)}</h1>
      <p class="headline">${safe(d.headline)}</p>
      ${d.location ? `<p class="location">${safe(d.location)}</p>` : ''}
      <div class="ctas">
        ${d.contact?.email ? `<a class="btn" href="mailto:${safe(d.contact.email)}">Contact Me</a>` : ''}
        ${d.contact?.website ? `<a class="btn ghost" target="_blank" rel="noopener" href="${safe(d.contact.website)}">Website</a>` : ''}
      </div>
    </div>
  </div>
</header>

<main class="container">
  ${skills.length ? `<section><h2>Skills</h2><ul class="tags">${skills.map(s => `<li>${s}</li>`).join('')}</ul></section>` : ''}

  ${projects.length ? `<section><h2>Projects</h2>
    <div class="grid">
      ${projects.map(p => `
        <article class="card">
          <h3>${safe(p.name)}</h3>
          <p>${safe(p.description)}</p>
          ${p.tech?.length ? `<ul class="tags">${p.tech.map(t=>`<li>${t}</li>`).join('')}</ul>` : ''}
          <p class="links">
            ${p.links?.live ? `<a target="_blank" rel="noopener" href="${safe(p.links.live)}">Live</a>` : ''}
            ${p.links?.repo ? `<a target="_blank" rel="noopener" href="${safe(p.links.repo)}">Repo</a>` : ''}
            ${p.links?.case ? `<a target="_blank" rel="noopener" href="${safe(p.links.case)}">Case</a>` : ''}
          </p>
        </article>
      `).join('')}
    </div>
  </section>` : ''}

  ${experience.length ? `<section><h2>Experience</h2>
    ${experience.map(e => `
      <article class="xp">
        <h3>${safe(e.role)} · ${safe(e.company)}</h3>
        <p class="meta">${safe(e.start)} — ${safe(e.end) || 'Present'}</p>
        ${e.highlights?.length ? `<ul>${e.highlights.map(h=>`<li>${h}</li>`).join('')}</ul>` : ''}
      </article>
    `).join('')}
  </section>` : ''}

  ${d.summary ? `<section><h2>About</h2><p>${safe(d.summary)}</p></section>` : ''}

  ${d.education?.length ? `<section><h2>Education</h2>
    <ul class="edu">
      ${d.education.map(ed => `<li><strong>${safe(ed.degree)}</strong>, ${safe(ed.school)} (${safe(ed.year)}) ${ed.highlights?.length ? `— ${ed.highlights.join('; ')}` : ''}</li>`).join('')}
    </ul>
  </section>` : ''}

  ${(awards.length || certs.length) ? `<section><h2>Certifications & Awards</h2>
    <ul class="tags">${[...awards.map(a=>`Award: ${a}`), ...certs.map(c=>`Cert: ${c}`)].map(x=>`<li>${x}</li>`).join('')}</ul>
  </section>` : ''}

  ${(d.contact?.github || d.contact?.linkedin || d.contact?.twitter || d.contact?.website) ? `<section><h2>Links</h2>
    <ul class="links">
      ${d.contact?.github ? `<li><a target="_blank" rel="noopener" href="${safe(d.contact.github)}">GitHub</a></li>` : ''}
      ${d.contact?.linkedin ? `<li><a target="_blank" rel="noopener" href="${safe(d.contact.linkedin)}">LinkedIn</a></li>` : ''}
      ${d.contact?.twitter ? `<li><a target="_blank" rel="noopener" href="${safe(d.contact.twitter)}">Twitter</a></li>` : ''}
      ${d.contact?.website ? `<li><a target="_blank" rel="noopener" href="${safe(d.contact.website)}">Website</a></li>` : ''}
    </ul>
  </section>` : ''}
</main>

<footer class="container"><p>© ${new Date().getFullYear()} ${safe(d.name)}. Built from resume.</p></footer>
</body></html>`
}

function generateCSS() {
  return `:root{--bg:#fff;--fg:#0b1220;--muted:#5b6474;--primary:#0b1220;--card:#f6f8fb;--radius:12px}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.6 system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial}
.container{max-width:1100px;margin:0 auto;padding:24px}
h1{font-size:clamp(28px,5vw,40px);margin:4px 0 8px}
h2{font-size:22px;margin:32px 0 12px}
h3{font-size:18px;margin:8px 0}
p{margin:8px 0} .headline{color:var(--muted)} .location{color:var(--muted)}
.hero{display:grid;grid-template-columns:120px 1fr;gap:20px;align-items:center;padding:16px;border-radius:var(--radius);background:var(--card)}
.hero .avatar img{width:120px;height:120px;border-radius:50%;object-fit:cover}
.hero .avatar .initials{width:120px;height:120px;border-radius:50%;background:#c7d2fe;display:grid;place-items:center;font-weight:700;font-size:32px;color:#1e1b4b}
.btn{display:inline-block;padding:10px 14px;border-radius:10px;background:var(--primary);color:#fff;text-decoration:none;margin-right:8px}
.btn.ghost{background:transparent;border:1px solid #cbd5e1;color:var(--fg)}
.tags{display:flex;flex-wrap:wrap;gap:8px;padding:0;margin:0;list-style:none}
.tags li{background:var(--card);border:1px solid #e2e8f0;border-radius:999px;padding:6px 10px;font-size:13px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}
.card{background:var(--card);border:1px solid #e2e8f0;border-radius:var(--radius);padding:16px}
.links a{margin-right:12px}
.xp{border-left:3px solid #cbd5e1;padding-left:12px;margin:12px 0}
.edu{padding-left:18px}
footer{color:var(--muted);margin-top:32px;border-top:1px solid #e2e8f0;padding-top:16px}
@media (max-width:640px){.hero{grid-template-columns:80px 1fr}.hero .avatar img,.hero .avatar .initials{width:80px;height:80px}}
`
}
