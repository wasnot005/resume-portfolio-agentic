
/// <reference types="vite/client" />

declare module 'mammoth/mammoth.browser' {
  interface Mammoth {
    extractRawText: (input: { arrayBuffer: ArrayBuffer }) => Promise<{ value: string }>
  }
  const mammoth: Mammoth
  export default mammoth
}
