export const COLORS = {
  night: '#0a1020',
  night2: '#101827',
  chart: '#0e1626',
  surface: '#18243a',
  fg: '#f1f4fa',
  muted: '#a6b2c5',
  subtle: '#8a98ad',
  ice: '#b9d8f2',
  teal: '#55d6c2',
  control: '#6b7a92',
  grid: 'rgba(190, 215, 245, 0.10)',
  axis: 'rgba(190, 215, 245, 0.22)',
}

export const SERIES = {
  treasury: { color: '#5f97d6', dash: undefined, label: 'Treasury bills' },
  ibond: { color: '#b8863a', dash: '7 4', label: 'I bond' },
  muni: { color: '#27a48e', dash: '2 4', label: 'Municipal bond' },
  hysa: { color: '#9187d9', dash: '10 4 2 4', label: 'High-yield savings' },
}

export const ORDINAL_ICE = ['#b9d8f2', '#7fa6c9', '#557696']

export const AXIS_TICK = { fill: COLORS.muted, fontSize: 12, fontFamily: 'IBM Plex Mono, ui-monospace, monospace' }
