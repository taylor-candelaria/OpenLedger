import { describe, expect, it } from 'vitest'
import { EVENTS, FIRST_YEAR, LAST_YEAR, TRACKS } from '../features/history/events.js'
import { GLOSSARY, GLOSSARY_BY_ID, GLOSSARY_GROUPS } from './glossary.js'

describe('glossary', () => {
  it('has unique ids', () => {
    expect(new Set(GLOSSARY.map((g) => g.id)).size).toBe(GLOSSARY.length)
  })

  it('only links to terms that exist', () => {
    for (const g of GLOSSARY) {
      for (const id of g.related ?? []) expect(GLOSSARY_BY_ID[id], `${g.id} → ${id}`).toBeDefined()
    }
  })

  it('puts every term in a listed group', () => {
    for (const g of GLOSSARY) expect(GLOSSARY_GROUPS, g.id).toContain(g.group)
  })
})

describe('history timeline events', () => {
  it('belong to a known track and fall inside the axis', () => {
    for (const e of EVENTS) {
      expect(TRACKS[e.track], e.title).toBeDefined()
      expect(e.year).toBeGreaterThanOrEqual(FIRST_YEAR)
      expect(e.year).toBeLessThanOrEqual(LAST_YEAR)
    }
  })

  it('are in chronological order', () => {
    const years = EVENTS.map((e) => e.year)
    expect(years).toEqual([...years].sort((a, b) => a - b))
  })
})
