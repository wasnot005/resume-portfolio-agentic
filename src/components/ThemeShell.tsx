import React from 'react'
import type { RenderConfigT } from '../types/RenderConfig'

export default function ThemeShell({ theme, children }: { theme: RenderConfigT['theme']; children: React.ReactNode }) {
  const style = {
    '--background': theme.background,
    '--foreground': theme.foreground,
    '--primary': theme.primary,
    '--primary-foreground': theme.primaryForeground,
    '--accent': theme.accent,
    '--muted': theme.muted,
    '--radius': `${theme.radius}rem`,
  } as React.CSSProperties

  return (
    <div style={style}>
      <style>{`
        body, .app-surface { background: hsl(var(--background)); color: hsl(var(--foreground)); }
        a { color: hsl(var(--primary)); }
        .card { border-radius: var(--radius); }
      `}</style>
      {children}
    </div>
  )
}
