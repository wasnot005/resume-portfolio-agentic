import React from 'react'

export type GeminiModel = 'gemini-1.5-flash' | 'gemini-1.5-pro'

type CtxT = {
  apiKey: string
  setApiKey: (k: string) => void
  model: GeminiModel
  setModel: (m: GeminiModel) => void
}

const Ctx = React.createContext<CtxT>({
  apiKey: '',
  setApiKey: () => {},
  model: 'gemini-1.5-flash',
  setModel: () => {},
})

export function ApiKeyProvider({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKey] = React.useState('')
  const [model, setModel] = React.useState<GeminiModel>('gemini-1.5-flash')

  return (
    <Ctx.Provider value={{ apiKey, setApiKey, model, setModel }}>
      {children}
    </Ctx.Provider>
  )
}

export function useApiKey() {
  return React.useContext(Ctx)
}

