import { useEffect } from 'react'
import { BRAND } from '../lib/constants'

export function PageMeta({
  title,
  description,
}: {
  title: string
  description: string
}) {
  useEffect(() => {
    document.title = `${title} · ${BRAND}`
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', description)
  }, [title, description])

  return null
}
