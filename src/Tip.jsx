import * as Tooltip from '@radix-ui/react-tooltip'

// Tooltip hover/fokus untuk tombol ikon kecil. Butuh <Tooltip.Provider> di root (main.jsx).
export default function Tip({ label, children }) {
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
