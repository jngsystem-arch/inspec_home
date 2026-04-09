'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const BG: Record<string, string> = {
  '2': [
    'linear-gradient(rgba(59,130,246,0.09) 1px, transparent 1px) 0 0 / 48px 48px',
    'linear-gradient(90deg, rgba(59,130,246,0.09) 1px, transparent 1px) 0 0 / 48px 48px',
    'linear-gradient(160deg, #040D1C 0%, #0A1F3D 42%, #0C2450 100%)',
  ].join(', '),
  '3': [
    'radial-gradient(ellipse 52% 68% at 74% 44%, rgba(59,130,246,0.12) 0%, transparent 68%)',
    'linear-gradient(168deg, #040D1C 0%, #0A1F3D 35%, #0D2B5E 100%)',
  ].join(', '),
}

export default function BgPreview() {
  const params = useSearchParams()
  const bg = params.get('bg')

  useEffect(() => {
    if (!bg || !BG[bg]) return
    const hero = document.querySelector('section')
    if (hero) hero.style.setProperty('background', BG[bg], 'important')
  }, [bg])

  return null
}
