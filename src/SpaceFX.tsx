import React from 'react'
// Dekorasi background bertema arcade: starfield.
// Selama DIWALI (November 2026), ditambah lampion langit (sky lantern) mengambang dan glow hangat,
// mengikuti halaman Arcade resmi Google global.
import { HALLOWEEN, DIWALI } from './config'
import { Ghost, Pumpkin } from './halloween'
import { DiwaliSkyLanterns } from './diwali'

export default function SpaceFX(): React.JSX.Element {
  return (
    <div className="spacefx" aria-hidden="true">
      {HALLOWEEN && <div className="hw-glow" />}
      {DIWALI && <div className="diwali-glow" />}
      <div className="stars stars-a" />
      <div className="stars stars-b" />
      {DIWALI && <DiwaliSkyLanterns />}
      {HALLOWEEN && (
        <>
          <Ghost className="hw-ghost hwg1" />
          <Ghost className="hw-ghost hwg2" />
          <Ghost className="hw-ghost hwg3" />
          <Pumpkin className="hw-pumpkin hwp1" />
          <Pumpkin className="hw-pumpkin hwp2" />
        </>
      )}
    </div>
  )
}
