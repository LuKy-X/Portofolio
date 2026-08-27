import { ref, onUnmounted } from 'vue'

const LOOPS    = 3
const TWO_PI   = Math.PI * 2
const FULL_ROT = TWO_PI * LOOPS

export function useProjectsScroll({ onExitDown, onExitUp } = {}) {
  const progress       = ref(0)
  const spiralRot      = ref(0)
  const scrollVelocity = ref(0)
  const isTransitioning = ref(false)


  let sectionEl       = null
  let lastScrollY     = window.scrollY
  let lastScrollTime  = performance.now()
  let velDecayRAF     = null
  let exitDownFired   = false
  let exitUpFired     = false

  function onScroll() {
    if (!sectionEl) return

    const now      = performance.now()
    const dt       = Math.max(1, now - lastScrollTime)
    const dy       = window.scrollY - lastScrollY

    scrollVelocity.value = dy / dt

    cancelAnimationFrame(velDecayRAF)
    ;(function decay() {
      scrollVelocity.value *= 0.88
      if (Math.abs(scrollVelocity.value) > 0.005)
        velDecayRAF = requestAnimationFrame(decay)
      else
        scrollVelocity.value = 0
    })()

    lastScrollY    = window.scrollY
    lastScrollTime = now

    const rect        = sectionEl.getBoundingClientRect()
    const sectionH    = sectionEl.offsetHeight
    const viewH       = window.innerHeight

    const scrollable = sectionH - viewH
    const scrolled   = Math.max(0, -rect.top)
    const rawProgress = scrollable > 0 ? scrolled / scrollable : 0

    progress.value  = Math.max(0, Math.min(100, rawProgress * 100))
    spiralRot.value = rawProgress * FULL_ROT

    if (rawProgress >= 0.98 && !exitDownFired) {
      exitDownFired = true
      exitUpFired   = false
    }
    if (rawProgress <= 0.02 && !exitUpFired) {
      exitUpFired   = true
      exitDownFired = false
    }
  }

  function attach(el) {
    sectionEl   = el
    lastScrollY = window.scrollY
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
  }

  function detach() {
    window.removeEventListener('scroll', onScroll)
    cancelAnimationFrame(velDecayRAF)
  }

  function reset() {
    spiralRot.value      = 0
    progress.value       = 0
    scrollVelocity.value = 0
    exitDownFired        = false
    exitUpFired          = false
  }

  onUnmounted(detach)

  const blackScreen = { active: false, opacity: 0 }

  function fadeToBlack(cb) { cb?.() }

  return {
    progress,
    spiralRot,
    scrollVelocity,
    blackScreen,
    isTransitioning,
    attach,
    detach,
    reset,
    fadeToBlack,
  }
}
