import React from 'react'
import type { ResumeData } from '../types/Schema'
import type { RenderConfigT } from '../types/RenderConfig'

export default function RenderedPage({ data, config }: { data: ResumeData; config: RenderConfigT }) {
  return (
    <div>
      <pre className="text-xs whitespace-pre-wrap">{JSON.stringify({ data, config }, null, 2)}</pre>
    </div>
  )
}
