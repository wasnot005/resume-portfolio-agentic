import React from 'react'

type Theme = {
  background: string
  foreground: string
  primary: string
  primaryForeground: string
  accent: string
  muted: string
  radius: number
}

export default function ThemeShell({ theme, children }: { theme?: Theme; children: React.ReactNode }) {
  const style = theme
    ? ({
        '--background': theme.background,
        '--foreground': theme.foreground,
        '--primary': theme.primary,
        '--primary-foreground': theme.primaryForeground,
        '--accent': theme.accent,
        '--muted': theme.muted,
        '--radius': `${theme.radius}rem`,
      } as React.CSSProperties)
    : undefined

  return (
    <div className="theme-shell" style={style}>
      <style>{`
        .theme-shell{background:var(--background);color:var(--foreground);min-height:100vh;}
        .theme-shell a{color:var(--primary);}
      `}</style>
      {children}
    </div>
  )
}
