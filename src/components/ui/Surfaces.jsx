export function GlassPanel({ as: Tag = 'div', variant = 'panel', className = '', children, ...rest }) {
  const material = variant === 'pop' ? 'glass-pop' : 'glass-panel'
  return (
    <Tag className={`${material} rounded-lg ${className}`} {...rest}>
      {children}
    </Tag>
  )
}

export function Surface({ as: Tag = 'div', className = '', children, ...rest }) {
  return (
    <Tag className={`surface rounded-lg ${className}`} {...rest}>
      {children}
    </Tag>
  )
}

export function Container({ as: Tag = 'div', className = '', children, ...rest }) {
  return (
    <Tag className={`mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 ${className}`} {...rest}>
      {children}
    </Tag>
  )
}
