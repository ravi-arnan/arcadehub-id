import React from 'react'
import * as Tooltip from '@radix-ui/react-tooltip'

export interface TipProps {
  label: React.ReactNode
  children: React.ReactElement
}

// Tooltip hover/fokus untuk tombol ikon kecil. Butuh <Tooltip.Provider> di root (main.tsx).
export default function Tip({ label, children }: TipProps): React.JSX.Element {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content className="tip" sideOffset={6} collisionPadding={8}>
          {label}
          <Tooltip.Arrow className="tip-arrow" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}
