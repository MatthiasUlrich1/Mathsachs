/// <reference types="vite/client" />

import type { MathsachsDesktop } from './updates/types'

declare global {
  interface Window {
    mathsachs?: MathsachsDesktop
  }
}

export {}
