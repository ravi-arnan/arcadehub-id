import React, { memo } from 'react'
// Dekorasi background bertema arcade: starfield.
// Selama DIWALI (November 2026), ditambah lampion langit (sky lantern) mengambang,
// partikel cahaya melayang (floating magic lights), dan glow hangat,
// mengikuti halaman Arcade resmi Google global.
import { HALLOWEEN, DIWALI } from './config'
import { Ghost, Pumpkin } from './halloween'
import { DiwaliSkyLanterns, DiwaliFloatingLights } from './diwali'

export default memo(function SpaceFX(): React.JSX.Element {
  return (
    <>
      <div className="spacefx spacefx-bg" aria-hidden="true">
        {HALLOWEEN && <div className="hw-glow" />}
        {DIWALI && <div className="diwali-glow" />}
        <div className="stars stars-a" />
        <div className="stars stars-b" />
      </div>
      {DIWALI && (
        <div className="diwali-fx" aria-hidden="true">
          <DiwaliSkyLanterns />
          <DiwaliFloatingLights />
        </div>
      )}
      {HALLOWEEN && (
        <div className="halloween-fx" aria-hidden="true">
          <Ghost className="hw-ghost hwg1" />
          <Ghost className="hw-ghost hwg2" />
          <Ghost className="hw-ghost hwg3" />
          <Pumpkin className="hw-pumpkin hwp1" />
          <Pumpkin className="hw-pumpkin hwp2" />
        </div>
      )}
    </>
  )
})
