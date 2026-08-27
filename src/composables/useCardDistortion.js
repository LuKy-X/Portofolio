

import * as THREE from 'three'

const MAX_WAVE = 0.25
const MAX_TILT = 0.15
const SMOOTH   = 0.15

/**
 * @param {THREE.Mesh[]} cards
 * @param {import('vue').Ref<number>} velocityRef
 */
export function useCardDistortion(cards, velocityRef) {
  const targetTilts      = new Array(cards.length).fill(0)
  const currentTilts     = new Array(cards.length).fill(0)
  const originalVertices = cards.map(card =>
    new Float32Array(card.geometry.attributes.position.array),
  )

  function updateDistortion() {
    const vel  = velocityRef.value
    const norm = Math.max(-1, Math.min(1, vel / 0.5))

    cards.forEach((card, i) => {
      const phase      = (i / cards.length) * 0.25
      targetTilts[i]   = norm * MAX_TILT * (1 - phase * 0.3)
      currentTilts[i] += (targetTilts[i] - currentTilts[i]) * SMOOTH

      applyWaveDistortion(card, currentTilts[i], originalVertices[i])
      card.rotation.z = currentTilts[i] * 0.5
    })
  }

  return { updateDistortion }
}

function applyWaveDistortion(mesh, tilt, originalVertices) {
  const geo   = mesh.geometry
  const pos   = geo.attributes.position
  const count = pos.count

  for (let i = 0; i < count; i++) {
    pos.setXYZ(i, originalVertices[i * 3], originalVertices[i * 3 + 1], originalVertices[i * 3 + 2])
  }

  for (let i = 0; i < count; i++) {
    const origX  = originalVertices[i * 3]
    const origY  = originalVertices[i * 3 + 1]
    const normX  = origX / 2.4
    const normY  = origY / 1.5
    const edgeDist    = Math.max(Math.abs(normX), Math.abs(normY))
    const waveStrength = Math.pow(Math.max(0, edgeDist - 0.5), 1.5) * 2
    const waveZ  = Math.sin(edgeDist * Math.PI - tilt * 3) * waveStrength * Math.abs(tilt) * MAX_WAVE

    pos.setX(i, origX)
    pos.setY(i, origY)
    pos.setZ(i, waveZ)
  }

  pos.needsUpdate = true
  geo.computeVertexNormals()
}

export function getCSSDistortion(velocity) {
  const norm  = Math.max(-1, Math.min(1, velocity / 0.5))
  const skewY = norm * -12
  const scaleX = 1 + Math.abs(norm) * 0.04
  const scaleY = 1 - Math.abs(norm) * 0.03
  return {
    transform:  `skewY(${skewY}deg) scaleX(${scaleX}) scaleY(${scaleY})`,
    transition: 'transform 0.1s linear',
  }
}
