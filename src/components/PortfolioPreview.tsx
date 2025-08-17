
import React from 'react'
import type { ResumeData } from '../types/Schema'

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-block rounded-full border px-2 py-1 text-xs">{children}</span>
}

export default function PortfolioPreview({ data }: { data: ResumeData }) {
  const skills = [...(data.skills_core || []), ...(data.skills_tools || [])]

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="grid md:grid-cols-[120px_1fr] gap-4 items-center bg-slate-50 border rounded-xl p-4">
        <div className="w-28 h-28 rounded-full bg-indigo-200 grid place-items-center overflow-hidden">
          {data.assets?.headshot_url
            ? <img src={data.assets.headshot_url!} alt={`${data.name || 'User'} headshot`} className="w-full h-full object-cover"/>
            : <span className="text-2xl font-bold text-indigo-900">{(data.name || 'U S').split(' ').map(n=>n[0]).join('').slice(0,2)}</span>}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{data.name || 'Your Name'}</h1>
          <p className="text-slate-600">{data.headline || 'Your headline / role'}</p>
          {data.location && <p className="text-slate-500 text-sm">{data.location}</p>}
          <div className="mt-3 flex gap-2">
            {data.contact?.email && <a className="px-3 py-2 rounded-xl bg-slate-900 text-white" href={`mailto:${data.contact.email}`}>Contact Me</a>}
            {data.contact?.website && <a className="px-3 py-2 rounded-xl border" target="_blank" rel="noopener" href={data.contact.website}>Website</a>}
          </div>
        </div>
      </section>

      {/* Skills */}
      {!!skills.length && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">{skills.map((s, i) => <Badge key={i}>{s}</Badge>)}</div>
        </section>
      )}

      {/* Projects */}
      {!!data.projects?.length && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Projects</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.projects.map((p, i) => (
              <article key={i} className="border rounded-xl p-3 bg-white">
                <h3 className="font-medium">{p.name || 'Untitled Project'}</h3>
                <p className="text-sm text-slate-600">{p.description}</p>
                {!!p.tech?.length && <div className="mt-2 flex flex-wrap gap-2">
                  {p.tech.map((t, j) => <Badge key={j}>{t}</Badge>)}
                </div>}
                <div className="mt-2 text-sm flex gap-3">
                  {p.links?.live && <a className="underline" target="_blank" rel="noopener" href={p.links.live}>Live</a>}
                  {p.links?.repo && <a className="underline" target="_blank" rel="noopener" href={p.links.repo}>Repo</a>}
                  {p.links?.case && <a className="underline" target="_blank" rel="noopener" href={p.links.case}>Case</a>}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {!!data.experience?.length && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Experience</h2>
          <div className="space-y-3">
            {data.experience.map((e, i) => (
              <article key={i} className="border-l-4 border-slate-200 pl-3">
                <h3 className="font-medium">{e.role || 'Role'} · {e.company || 'Company'}</h3>
                <p className="text-xs text-slate-500">{e.start || ''} — {e.end || 'Present'}</p>
                {!!e.highlights?.length && <ul className="list-disc ml-5 text-sm">
                  {e.highlights.map((h, j) => <li key={j}>{h}</li>)}
                </ul>}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* About */}
      {data.summary && (
        <section>
          <h2 className="text-xl font-semibold mb-2">About</h2>
          <p className="text-slate-700">{data.summary}</p>
        </section>
      )}

      {/* Education */}
      {!!data.education?.length && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Education</h2>
          <ul className="list-disc ml-5">
            {data.education.map((ed, i) => (
              <li key={i}><strong>{ed.degree}</strong>, {ed.school} ({ed.year}) {ed.highlights?.length ? `— ${ed.highlights.join('; ')}` : ''}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
