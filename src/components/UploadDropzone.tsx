import React from 'react'

export function UploadDropzone(props: { onPick: (f: File) => void; file?: File | null }) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  function openPicker() {
    inputRef.current?.click()
  }

  return (
    <div
      tabIndex={0}
      role="button"
      aria-label="Upload resume"
      className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50"
      onClick={openPicker}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          openPicker()
        }
      }}
      onDragOver={e => e.preventDefault()}
      onDrop={e => {
        e.preventDefault()
        const f = e.dataTransfer.files?.[0]
        if (f) props.onPick(f)
      }}
    >
      <p className="text-lg font-medium">
        {props.file ? `Selected: ${props.file.name}` : 'Drop your resume (PDF/DOCX/TXT/JSON) or click to browse'}
      </p>
      <p className="text-sm text-slate-500 mt-1">Max 10 MB. Your data stays in your browser.</p>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,.docx,.txt,.json"
        onChange={e => {
          const f = e.target.files?.[0]
          if (f) props.onPick(f)
        }}
      />
    </div>
  )
}
