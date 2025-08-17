import React from 'react'
import type { ResumeData } from '../types/Schema'
import type {
  RenderConfigT,
  HeroSection,
  ProjectsSection,
  ExperienceSection,
  SkillsSection,
} from '../types/RenderConfig'

export default function RenderedPage({ data, config }: { data: ResumeData; config: RenderConfigT }) {
  return (
    <div className="app-surface space-y-12">
      {config.sections.map((section, idx) => {
        switch (section.type) {
          case 'hero':
            return <Hero key={idx} data={data} cfg={section} />
          case 'projects':
            return <Projects key={idx} data={data} cfg={section} />
          case 'experience':
            return <Experience key={idx} data={data} cfg={section} />
          case 'skills':
            return <Skills key={idx} data={data} cfg={section} />
          case 'about':
            return <About key={idx} data={data} />
          case 'education':
            return <Education key={idx} data={data} />
          case 'contact':
            return <Contact key={idx} data={data} />
          default:
            return null
        }
      })}
    </div>
  )
}

function Hero({ data, cfg }: { data: ResumeData; cfg: HeroSection }) {
  return (
    <section className="text-center space-y-2">
      <h1 className="text-4xl font-bold">{data.name}</h1>
      {data.headline && <p className="text-lg">{data.headline}</p>}
      {cfg.showLocation && data.location && <p className="text-sm text-[hsl(var(--muted))]">{data.location}</p>}
      {cfg.ctaLabel && (
        <p className="mt-4">
          <a
            href={data.contact?.website || (data.contact?.email ? `mailto:${data.contact.email}` : '#')}
            className="card px-4 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
          >
            {cfg.ctaLabel}
          </a>
        </p>
      )}
    </section>
  )
}

function Projects({ data, cfg }: { data: ResumeData; cfg: ProjectsSection }) {
  const projects = data.projects?.filter(p => p?.name) ?? []
  if (!projects.length) return null
  const cols = cfg.colsDesktop || 2
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Projects</h2>
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
        {projects.map((p, i) => (
          <article
            key={i}
            className={`card p-4 ${cfg.cardStyle === 'outline' ? 'border' : 'bg-[hsl(var(--accent))]'}`}
          >
            <h3 className="font-medium">{p.name}</h3>
            {p.description && <p className="text-sm mt-1">{p.description}</p>}
            {p.tech?.length ? (
              <ul className="flex flex-wrap gap-1 mt-2 text-xs">
                {p.tech.map((t, j) => (
                  <li key={j} className="px-2 py-1 bg-[hsl(var(--muted))] rounded card">
                    {t}
                  </li>
                ))}
              </ul>
            ) : null}
            {p.links && (p.links.live || p.links.repo || p.links.case) && (
              <p className="mt-2 text-sm">
                {p.links.live && (
                  <a href={p.links.live} target="_blank" rel="noopener" className="mr-2">
                    Live
                  </a>
                )}
                {p.links.repo && (
                  <a href={p.links.repo} target="_blank" rel="noopener" className="mr-2">
                    Repo
                  </a>
                )}
                {p.links.case && (
                  <a href={p.links.case} target="_blank" rel="noopener">
                    Case
                  </a>
                )}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

function Experience({ data, cfg }: { data: ResumeData; cfg: ExperienceSection }) {
  const exp = data.experience ?? []
  if (!exp.length) return null
  const max = cfg.bulletsMax ?? Infinity
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Experience</h2>
      {exp.map((e, i) => (
        <article
          key={i}
          className={cfg.style === 'cards' ? 'card p-4 mb-4' : 'pl-4 border-l mb-4'}
        >
          <h3 className="font-medium">
            {e.role} · {e.company}
          </h3>
          <p className="text-sm text-[hsl(var(--muted))]">
            {e.start} — {e.end || 'Present'}
          </p>
          {e.highlights && e.highlights.length > 0 && (
            <ul className="list-disc pl-5 mt-2">
              {e.highlights.slice(0, max).map((h, j) => (
                <li key={j}>{h}</li>
              ))}
            </ul>
          )}
        </article>
      ))}
    </section>
  )
}

function Skills({ data, cfg }: { data: ResumeData; cfg: SkillsSection }) {
  const skills = [...(data.skills_core || []), ...(data.skills_tools || [])]
  if (!skills.length) return null
  const vis = cfg.visibleMax ? skills.slice(0, cfg.visibleMax) : skills
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Skills</h2>
      <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
        {vis.map((s, i) => (
          <li key={i} className="card px-3 py-1 bg-[hsl(var(--accent))] text-sm">
            {s}
          </li>
        ))}
      </ul>
    </section>
  )
}

function About({ data }: { data: ResumeData }) {
  if (!data.summary) return null
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">About</h2>
      <p>{data.summary}</p>
    </section>
  )
}

function Education({ data }: { data: ResumeData }) {
  const edu = data.education ?? []
  if (!edu.length) return null
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Education</h2>
      <ul className="space-y-2">
        {edu.map((e, i) => (
          <li key={i}>
            <strong>{e.degree}</strong>, {e.school} ({e.year})
          </li>
        ))}
      </ul>
    </section>
  )
}

function Contact({ data }: { data: ResumeData }) {
  const c = data.contact || {}
  const items: { label: string; href: string; value: string }[] = []
  if (c.email) items.push({ label: 'Email', href: `mailto:${c.email}`, value: c.email })
  if (c.phone) items.push({ label: 'Phone', href: `tel:${c.phone}`, value: c.phone })
  if (c.website) items.push({ label: 'Website', href: c.website, value: c.website })
  if (c.github) items.push({ label: 'GitHub', href: c.github, value: c.github })
  if (c.linkedin) items.push({ label: 'LinkedIn', href: c.linkedin, value: c.linkedin })
  if (c.twitter) items.push({ label: 'Twitter', href: c.twitter, value: c.twitter })
  if (!items.length) return null
  return (
    <section id="contact">
      <h2 className="text-2xl font-semibold mb-4">Contact</h2>
      <ul className="space-y-1">
        {items.map((it, i) => (
          <li key={i}>
            <a href={it.href} target="_blank" rel="noopener" className="underline">
              {it.label}: {it.value}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
