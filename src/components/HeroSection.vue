<template>
  <section id="hero">
    <canvas ref="auroraRef" id="aurora-canvas" />

    <div class="hero-inner">

      <div class="hero-left">
        <div class="hero-socials reveal">
          <a v-for="s in socials" :key="s.label" :href="s.href" :title="s.label" target="_blank">
            {{ s.abbr }}
          </a>
        </div>
        <p class="hero-greeting reveal reveal-delay-1">Hello, I'm</p>
        <h1 class="hero-name reveal reveal-delay-2">
          Muhammad Wisnu Khoirul Amin<br/>
          <span>Programmer</span>
        </h1>
        <p class="hero-bio reveal reveal-delay-3">
          Crafting digital experiences with precision and passion.
          I build scalable web applications and design intuitive interfaces
          that users love to interact with.
        </p>
        <div class="hero-actions reveal reveal-delay-4">
          <a href="#projects" class="btn-primary" @click.prevent="scrollTo('projects')">⬇ Projects</a>
          <a href="#contact" class="btn-outline" @click.prevent="scrollTo('contact')">✉ Contact Me</a>
        </div>
      </div>


      <div class="hero-right reveal reveal-delay-2">
        <div class="avatar-wrap" ref="avatarWrapRef" @mousemove="onAvatarMove" @mouseleave="onAvatarLeave">
          <div class="avatar-bg-blob" />
          <img
            class="avatar-img"
            src="@/assets/images/w_png.png"
            alt="QualiCode Avatar"
          />
          <div class="badge"><span class="dot" />Open to Work</div>
          <div class="badge">⚡ 2+ Experience</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const auroraRef    = ref(null)
const avatarWrapRef = ref(null)

const socials = [
  { label: 'Instagram', abbr: 'IG', href: '#' },
  { label: 'TikTok',    abbr: 'TK', href: '#' },
  { label: 'YouTube',   abbr: 'YT', href: 'https://www.youtube.com/channel/UC78luzf89TM4PozIlXDjjqw' },
  { label: 'GitHub',    abbr: 'GH', href: 'https://github.com/LuKy-X' },
]

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function onAvatarMove(e) {
  const el   = avatarWrapRef.value
  const rect = el.getBoundingClientRect()
  const dx   = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2)
  const dy   = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2)
  el.style.transform = `rotateY(${dx * 8}deg) rotateX(${-dy * 5}deg) translateZ(10px)`
}
function onAvatarLeave() {
  avatarWrapRef.value.style.transform = 'rotateY(0) rotateX(0) translateZ(0)'
}

let rafId
function initAurora() {
  const canvas = auroraRef.value
  const ctx    = canvas.getContext('2d')

  function resize() {
    canvas.width  = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
  }
  resize()
  window.addEventListener('resize', resize)

  const blobs = Array.from({ length: 5 }, (_, i) => ({
    x: Math.random(), y: Math.random(),
    r: 300 + Math.random() * 200,
    vx: (Math.random() - .5) * .0003,
    vy: (Math.random() - .5) * .0003,
    hue: 210 + i * 15,
  }))

  function draw() {
    const { width: w, height: h } = canvas
    ctx.clearRect(0, 0, w, h)
    blobs.forEach(b => {
      b.x += b.vx; b.y += b.vy
      if (b.x < 0 || b.x > 1) b.vx *= -1
      if (b.y < 0 || b.y > 1) b.vy *= -1
      const g = ctx.createRadialGradient(b.x*w, b.y*h, 0, b.x*w, b.y*h, b.r)
      g.addColorStop(0, `hsla(${b.hue},55%,45%,.18)`)
      g.addColorStop(1, 'transparent')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.ellipse(b.x*w, b.y*h, b.r, b.r*.6, b.x*Math.PI, 0, Math.PI*2)
      ctx.fill()
    })
    rafId = requestAnimationFrame(draw)
  }
  draw()
}

let revealObs
onMounted(() => {
  initAurora()
  revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
  }, { threshold: .15 })
  document.querySelectorAll('#hero .reveal').forEach(el => revealObs.observe(el))
})
onUnmounted(() => {
  cancelAnimationFrame(rafId)
  revealObs?.disconnect()
})
</script>

<style scoped>
#hero {
  min-height: 100vh;
  background: var(--deep);
  position: relative; overflow: hidden;
  display: flex; align-items: center;
}
#aurora-canvas {
  position: absolute; inset: 0;
  width: 100%; height: 100%; opacity: .55;
}
.hero-inner {
  position: relative; z-index: 2;
  display: grid; grid-template-columns: 1fr 1fr;
  align-items: center; gap: 3rem;
  max-width: 1100px; margin: 0 auto;
  padding: 5rem 2.5rem 3rem;
  width: 100%;
}

.hero-socials { display: flex; gap: .8rem; margin-bottom: 2rem; }
.hero-socials a {
  width: 36px; height: 36px; border-radius: 50%;
  background: rgba(134,166,223,.15);
  border: 1px solid rgba(134,166,223,.3);
  display: flex; align-items: center; justify-content: center;
  color: var(--light); font-size: 12px; font-weight: 700;
  text-decoration: none;
  transition: background .25s, transform .25s, box-shadow .25s;
}
.hero-socials a:hover {
  background: rgba(134,166,223,.3);
  transform: scale(1.2) rotate(-5deg);
  box-shadow: 0 0 12px rgba(134,166,223,.4);
}

.hero-greeting { font-size: .9rem; color: var(--light); margin-bottom: .3rem; letter-spacing: .5px; }
.hero-name {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.4rem, 4vw, 3.4rem);
  color: #fff; line-height: 1.15; margin-bottom: 1rem;
}
.hero-name span { color: var(--light); }
.hero-bio {
  font-size: .95rem; color: rgba(255,255,255,.72);
  line-height: 1.75; max-width: 420px; margin-bottom: 2rem;
}
.hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }

.btn-primary {
  display: inline-flex; align-items: center; gap: .5rem;
  background: var(--light); color: var(--deep);
  padding: .7rem 1.6rem; border-radius: 30px;
  font-weight: 700; font-size: .88rem; border: none; cursor: pointer;
  transition: transform .2s, box-shadow .2s, background .2s; text-decoration: none;
}
.btn-primary:hover { transform: scale(1.05); box-shadow: 0 6px 22px rgba(134,166,223,.5); background: #fff; }
.btn-outline {
  display: inline-flex; align-items: center; gap: .5rem;
  background: transparent; color: #fff;
  padding: .68rem 1.6rem; border-radius: 30px;
  font-weight: 600; font-size: .88rem;
  border: 1.5px solid rgba(255,255,255,.35); cursor: pointer;
  transition: border-color .2s, background .2s, transform .2s; text-decoration: none;
}
.btn-outline:hover { border-color: #fff; background: rgba(255,255,255,.08); transform: scale(1.03); }

.hero-right { display: flex; justify-content: center; align-items: flex-end; }
.avatar-wrap {
  position: relative; width: 360px; height: 420px;
  cursor: default; will-change: transform;
  transition: transform .1s ease-out;
  perspective: 800px;
}
.avatar-bg-blob {
  position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
  width: 280px; height: 280px; border-radius: 50%;
  background: radial-gradient(circle, rgba(134,166,223,.25) 0%, transparent 70%);
  animation: blobPulse 4s ease-in-out infinite;
}
@keyframes blobPulse { 0%,100%{transform:translateX(-50%) scale(1)} 50%{transform:translateX(-50%) scale(1.08)} }

.avatar-img {
  width: 100%; height: 100%; object-fit: contain;
  animation: breathe 4s ease-in-out infinite;
  position: relative; z-index: 1;
  filter: drop-shadow(0 20px 40px rgba(50,78,123,.5));
}
@keyframes breathe { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }

.badge {
  position: absolute;
  background: rgba(255,255,255,.12); backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,.2);
  border-radius: 12px; padding: .4rem .8rem;
  color: #fff; font-size: .75rem; font-weight: 600;
  animation: floatBadge 3s ease-in-out infinite;
}
.badge:nth-child(3) { top: 15%; right: -10px; animation-delay: 0s; }
.badge:nth-child(4) { top: 45%; left: -20px; animation-delay: .8s; }
.badge:nth-child(5) { bottom: 18%; right: 0;  animation-delay: 1.6s; }
@keyframes floatBadge { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

.dot {
  display: inline-block; width: 7px; height: 7px;
  border-radius: 50%; background: #5df59a;
  margin-right: 5px; animation: dotPulse 1.5s infinite;
}
@keyframes dotPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.3)} }

.reveal { opacity: 0; transform: translateY(36px); transition: opacity .7s ease, transform .7s ease; }
.reveal.visible { opacity: 1; transform: none; }
.reveal-delay-1 { transition-delay: .12s; }
.reveal-delay-2 { transition-delay: .24s; }
.reveal-delay-3 { transition-delay: .36s; }
.reveal-delay-4 { transition-delay: .48s; }

@media (max-width: 768px) {
  .hero-inner { grid-template-columns: 1fr; text-align: center; }
  .hero-right { display: none; }
  .hero-actions { justify-content: center; }
  .hero-socials { justify-content: center; }
}
</style>
