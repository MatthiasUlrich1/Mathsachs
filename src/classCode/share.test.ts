import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  CLASS_CODE_SHARE_DEFAULT_NAME,
  canUseWebShare,
  classCodeMailtoUrl,
  classCodeShareLabel,
  classCodeShareSubject,
  classCodeShareText,
  classCodeWhatsAppUrl,
  openClassCodeShareUrl,
} from './share'

describe('classCodeShareText', () => {
  it('uses the formatted code and German quotation marks', () => {
    expect(classCodeShareText('Klasse 6a', 'abcd2345')).toBe(
      'Mathsachs-Klassencode für „Klasse 6a“: ABCD-2345',
    )
  })

  it('falls back to Klasse when the name is blank', () => {
    expect(classCodeShareLabel('  ')).toBe(CLASS_CODE_SHARE_DEFAULT_NAME)
    expect(classCodeShareText('', 'ABCD2345')).toBe(
      'Mathsachs-Klassencode für „Klasse“: ABCD-2345',
    )
  })
})

describe('classCodeWhatsAppUrl', () => {
  it('puts encodeURIComponent of the German text on wa.me', () => {
    const text = classCodeShareText('Klasse 6a', 'ABCD2345')
    const url = classCodeWhatsAppUrl('Klasse 6a', 'ABCD2345')
    expect(url).toBe(`https://wa.me/?text=${encodeURIComponent(text)}`)
    expect(url.startsWith('https://wa.me/?text=')).toBe(true)
    expect(url).toContain('%E2%80%9E')
    expect(url).toContain('%E2%80%9C')
    expect(url).not.toContain(' ')
  })
})

describe('classCodeMailtoUrl', () => {
  it('has no recipient and encodes subject plus body', () => {
    const subject = classCodeShareSubject('Klasse 6a')
    const body = classCodeShareText('Klasse 6a', 'ABCD2345')
    const href = classCodeMailtoUrl('Klasse 6a', 'ABCD2345')
    expect(href.startsWith('mailto:?')).toBe(true)
    expect(href).toBe(
      `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    )
    expect(href).toContain('subject=')
    expect(href).toContain('body=')
    expect(href).not.toContain('mailto:info')
  })
})

describe('canUseWebShare', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('is false when navigator.share is missing', () => {
    vi.stubGlobal('navigator', {})
    expect(canUseWebShare()).toBe(false)
  })

  it('is true when navigator.share exists', () => {
    vi.stubGlobal('navigator', { share: vi.fn() })
    expect(canUseWebShare()).toBe(true)
  })
})

describe('openClassCodeShareUrl', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('uses mathsachs.openExternal for https on desktop', () => {
    const openExternal = vi.fn().mockResolvedValue(undefined)
    const open = vi.fn()
    vi.stubGlobal('window', { mathsachs: { openExternal }, open })
    openClassCodeShareUrl('https://wa.me/?text=hi')
    expect(openExternal).toHaveBeenCalledWith('https://wa.me/?text=hi')
    expect(open).not.toHaveBeenCalled()
  })

  it('uses window.open in the browser', () => {
    const open = vi.fn()
    vi.stubGlobal('window', { open })
    openClassCodeShareUrl('https://wa.me/?text=hi')
    expect(open).toHaveBeenCalledWith('https://wa.me/?text=hi', '_blank', 'noopener')
  })

  it('uses mathsachs.openExternal for mailto on desktop', () => {
    const openExternal = vi.fn().mockResolvedValue(undefined)
    const open = vi.fn()
    vi.stubGlobal('window', { mathsachs: { openExternal }, open })
    openClassCodeShareUrl('mailto:?subject=x')
    expect(openExternal).toHaveBeenCalledWith('mailto:?subject=x')
    expect(open).not.toHaveBeenCalled()
  })
})
