<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="selectedProject" class="modal-overlay" @click.self="closeModal">
        <div class="modal-panel" role="dialog" aria-modal="true" :aria-label="selectedProject.title">
          <button class="modal-close" aria-label="Close project detail" @click="closeModal">×</button>
          <div class="modal-img-wrap">
            <img :src="selectedProject.img" :alt="selectedProject.title" class="modal-img" />
            <div class="modal-img-tint" :style="{ background: `#${selectedProject.color.toString(16).padStart(6, '0')}33` }" />
          </div>
          <div class="modal-body">
            <span class="modal-eyebrow">Project Detail</span>
            <h3 class="modal-title">{{ selectedProject.title }}</h3>
            <p class="modal-desc">{{ selectedProject.desc }}</p>
            <div class="modal-tags"><span v-for="tag in selectedProject.tags" :key="tag" class="modal-tag">{{ tag }}</span></div>
            <div class="modal-actions">
              <a :href="selectedProject.link" target="_blank" rel="noopener" class="btn-primary">View Project →</a>
              <button class="btn-ghost" @click="closeModal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <section id="projects" ref="sectionRef" class="projects-section">
    <div class="projects-sticky">
      <canvas ref="canvasRef" class="projects-canvas" aria-label="Interactive 3D project gallery" />
      <header class="projects-header">
        <span class="section-label">What I've Built</span>
        <h2 class="section-title">My <em>Projects</em></h2>
        <p class="section-sub">Scroll to orbit · hover a card · click to explore</p>
      </header>
      <div class="progress-track" aria-hidden="true"><div class="progress-fill" :style="{ transform: `scaleX(${progress})` }" /></div>
      <Transition name="label-fade">
        <div v-if="hoveredProject && !selectedProject" class="hover-label">
          <strong>{{ hoveredProject.title }}</strong>
          <span v-for="tag in hoveredProject.tags" :key="tag" class="tag">{{ tag }}</span>
          <small>Click to open</small>
        </div>
      </Transition>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import bkkImg from '@/assets/images/bkk.png'
import nawasenaImg from '@/assets/images/nawasena.png'
import localcartImg from '@/assets/images/localcart.png'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref(null)
const canvasRef = ref(null)
const selectedProject = ref(null)
const hoveredProject = ref(null)
const progress = ref(0)

const project = (title, tags, color, img, desc) => ({ title, tags, color, img, desc, link: '#' })
const PROJECTS = [
  project('Web Bursa Khusus Kerja', ['Laravel', 'Blade', 'MySQL'], 0x5068a9, bkkImg, 'A job-exchange platform with vacancy searches, online applications, and applicant data management.'),
  project('Culture Education App', ['Flutter', 'Firebase'], 0x86a6df, nawasenaImg, 'A gamified mobile learning experience for Javanese culture with quizzes and live leaderboards.'),
  project('E-commerce Local-Cart', ['Laravel', 'Vue', 'MySQL'], 0x324e7b, localcartImg, 'An MSME-focused commerce platform with inventory, payments, a shopping cart, and an admin dashboard.'),
  project('Web Bursa Khusus Kerja', ['Laravel', 'Blade', 'MySQL'], 0x4a6fa5, bkkImg, 'A job-exchange platform with vacancy searches, online applications, and applicant data management.'),
  project('Culture Education App', ['Flutter', 'Firebase'], 0x6b8cba, nawasenaImg, 'A gamified mobile learning experience for Javanese culture with quizzes and live leaderboards.'),
  project('E-commerce Local-Cart', ['Laravel', 'Vue', 'MySQL'], 0x3d5a8a, localcartImg, 'An MSME-focused commerce platform with inventory, payments, a shopping cart, and an admin dashboard.'),
  project('Web Bursa Khusus Kerja', ['Laravel', 'Blade', 'MySQL'], 0x7a9cc5, bkkImg, 'A job-exchange platform with vacancy searches, online applications, and applicant data management.'),
  project('E-commerce Local-Cart', ['Laravel', 'Vue', 'MySQL'], 0x5575a0, localcartImg, 'An MSME-focused commerce platform with inventory, payments, a shopping cart, and an admin dashboard.'),
]

// A 32 x 32 plane is essential: the shader can only curve existing vertices.
const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uBend;
  uniform float uScrollVelocity;
  uniform float uHover;
  varying vec2 vUv;
  varying float vCurve;

  void main() {
    vUv = uv;
    vec3 transformed = position;
    float x = position.x / 1.85;
    float y = position.y / 1.15;

    // Curved cylinder on X plus a softer fish-eye bend on Y.
    float cylindrical = -(x * x) * uBend;
    float fishEye = -(y * y) * uBend * 0.24;
    float hoverLift = pow(1.0 - abs(x), 2.0) * uHover * 0.18;
    float scrollWave = sin(position.y * 3.2 + uTime * 2.0) * uScrollVelocity * 0.10;
    transformed.z += cylindrical + fishEye + hoverLift + scrollWave;
    vCurve = cylindrical + fishEye;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform vec3 uTint;
  uniform float uOpacity;
  varying vec2 vUv;
  varying float vCurve;

  float roundedBox(vec2 point, vec2 bounds, float radius) {
    vec2 q = abs(point) - bounds + radius;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius;
  }

  void main() {
    float corner = roundedBox(vUv - 0.5, vec2(0.5), 0.035);
    float alpha = 1.0 - smoothstep(-0.003, 0.003, corner);
    if (alpha < 0.01) discard;
    vec4 image = texture2D(uTexture, vUv);
    float vignette = smoothstep(0.95, 0.20, distance(vUv, vec2(0.5)));
    vec3 colour = mix(image.rgb, image.rgb * uTint, 0.20);
    colour *= 0.75 + vignette * 0.30;
    colour += max(0.0, -vCurve) * 0.08;
    gl_FragColor = vec4(colour, image.a * alpha * uOpacity);
  }
`

let renderer
let scene
let camera
let animationFrame
let resizeObserver
let scrollTween
let raycaster
let pointer
let velocityTarget = 0
let cardGeometry
const cards = []
const cleanups = []

function openModal(item) {
  selectedProject.value = item
  document.body.style.overflow = 'hidden'
}
function closeModal() {
  selectedProject.value = null
  document.body.style.overflow = ''
}

function initScene() {
  const canvas = canvasRef.value
  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x060810, 0.035)
  camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100)
  camera.position.set(0, 0.15, 14.5)
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x060810, 1)
  renderer.outputColorSpace = THREE.SRGBColorSpace

  const spiralGroup = new THREE.Group()
  scene.add(spiralGroup)
  const loader = new THREE.TextureLoader()
  cardGeometry = new THREE.PlaneGeometry(3.7, 2.3, 32, 32)
  const radius = 4.85
  const turns = 1.45

  PROJECTS.forEach((item, index) => {
    const texture = loader.load(item.img)
    texture.colorSpace = THREE.SRGBColorSpace
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture }, uTint: { value: new THREE.Color(item.color) },
        uTime: { value: 0 }, uBend: { value: 0.78 }, uScrollVelocity: { value: 0 },
        uHover: { value: 0 }, uOpacity: { value: 0.96 },
      },
      vertexShader, fragmentShader, transparent: true, depthWrite: false, side: THREE.DoubleSide,
    })
    const card = new THREE.Mesh(cardGeometry, material)
    const angle = (index / PROJECTS.length) * Math.PI * 2 * turns + 0.35
    card.position.set(Math.cos(angle) * radius, (index - (PROJECTS.length - 1) / 2) * 0.82, Math.sin(angle) * radius)
    // Plane normals face away from the central axis, producing a real carousel.
    card.rotation.y = Math.PI / 2 - angle
    card.userData = { index, baseY: card.position.y, phase: index * 0.7 }
    spiralGroup.add(card)
    cards.push(card)
  })

  const stars = new THREE.BufferGeometry()
  const starPositions = new Float32Array(420 * 3)
  for (let i = 0; i < starPositions.length; i += 3) {
    starPositions[i] = (Math.random() - 0.5) * 32
    starPositions[i + 1] = (Math.random() - 0.5) * 22
    starPositions[i + 2] = -Math.random() * 20
  }
  stars.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
  scene.add(new THREE.Points(stars, new THREE.PointsMaterial({ color: 0x86a6df, size: 0.035, transparent: true, opacity: 0.55 })))

  raycaster = new THREE.Raycaster()
  pointer = new THREE.Vector2(2, 2)
  const pointerDown = new THREE.Vector2()
  const onPointerMove = (event) => {
    const bounds = canvas.getBoundingClientRect()
    pointer.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1, -((event.clientY - bounds.top) / bounds.height) * 2 + 1)
  }
  const onPointerLeave = () => pointer.set(2, 2)
  const onPointerDown = (event) => pointerDown.set(event.clientX, event.clientY)
  const onClick = (event) => {
    if (pointerDown.distanceTo(new THREE.Vector2(event.clientX, event.clientY)) > 6) return
    raycaster.setFromCamera(pointer, camera)
    const hit = raycaster.intersectObjects(cards, false)[0]
    if (hit) openModal(PROJECTS[hit.object.userData.index])
  }
  const onKeyDown = (event) => { if (event.key === 'Escape') closeModal() }
  canvas.addEventListener('pointermove', onPointerMove)
  canvas.addEventListener('pointerleave', onPointerLeave)
  canvas.addEventListener('pointerdown', onPointerDown)
  canvas.addEventListener('click', onClick)
  document.addEventListener('keydown', onKeyDown)
  cleanups.push(() => canvas.removeEventListener('pointermove', onPointerMove))
  cleanups.push(() => canvas.removeEventListener('pointerleave', onPointerLeave))
  cleanups.push(() => canvas.removeEventListener('pointerdown', onPointerDown))
  cleanups.push(() => canvas.removeEventListener('click', onClick))
  cleanups.push(() => document.removeEventListener('keydown', onKeyDown))

  const resize = () => {
    const { clientWidth: width, clientHeight: height } = canvas
    if (!width || !height) return
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height, false)
  }
  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas)
  resize()

  // The browser's vertical scroll is the only input; ScrollTrigger maps it to group rotation.
  scrollTween = gsap.to(spiralGroup.rotation, {
    y: -Math.PI * 2 * 3.25,
    ease: 'none',
    scrollTrigger: {
      trigger: sectionRef.value, start: 'top top', end: 'bottom bottom', scrub: 0.8, invalidateOnRefresh: true,
      onUpdate: (trigger) => {
        progress.value = trigger.progress
        velocityTarget = THREE.MathUtils.clamp(trigger.getVelocity() / 1800, -1, 1)
      },
    },
  })

  const clock = new THREE.Clock()
  let hoveredIndex = -1
  const render = () => {
    animationFrame = requestAnimationFrame(render)
    const elapsed = clock.getElapsedTime()
    raycaster.setFromCamera(pointer, camera)
    const hit = raycaster.intersectObjects(cards, false)[0]
    const nextHoveredIndex = hit ? hit.object.userData.index : -1
    if (nextHoveredIndex !== hoveredIndex) {
      hoveredIndex = nextHoveredIndex
      hoveredProject.value = hoveredIndex < 0 ? null : PROJECTS[hoveredIndex]
      cards.forEach((card, index) => gsap.to(card.material.uniforms.uHover, { value: index === hoveredIndex ? 1 : 0, duration: 0.28, overwrite: true }))
    }
    canvas.style.cursor = hoveredIndex < 0 ? 'default' : 'pointer'
    cards.forEach((card) => {
      const uniforms = card.material.uniforms
      uniforms.uTime.value = elapsed
      uniforms.uScrollVelocity.value = THREE.MathUtils.lerp(uniforms.uScrollVelocity.value, velocityTarget, 0.08)
      card.position.y = card.userData.baseY + Math.sin(elapsed * 0.75 + card.userData.phase) * 0.045
      const targetScale = 1 + uniforms.uHover.value * 0.055
      card.scale.setScalar(THREE.MathUtils.lerp(card.scale.x, targetScale, 0.1))
    })
    velocityTarget = THREE.MathUtils.lerp(velocityTarget, 0, 0.045)
    renderer.render(scene, camera)
  }
  render()
}

function disposeScene() {
  cancelAnimationFrame(animationFrame)
  cleanups.splice(0).forEach((cleanup) => cleanup())
  resizeObserver?.disconnect()
  scrollTween?.scrollTrigger?.kill()
  scrollTween?.kill()
  cards.forEach((card) => { card.material.uniforms.uTexture.value.dispose(); card.material.dispose() })
  cards.length = 0
  cardGeometry?.dispose()
  renderer?.dispose()
}

onMounted(initScene)
onUnmounted(() => { disposeScene(); document.body.style.overflow = '' })
</script>

<style scoped>
.projects-section { position: relative; height: 420vh; background: #060810; }
.projects-sticky { position: sticky; top: 0; height: 100vh; overflow: hidden; isolation: isolate; }
.projects-canvas { position: absolute; inset: 0; display: block; width: 100%; height: 100%; touch-action: pan-y; }
.projects-header { position: absolute; inset: 0 0 auto; z-index: 1; padding: clamp(1.5rem, 4vw, 3rem); pointer-events: none; background: linear-gradient(180deg, rgba(6,8,16,.96), transparent); }
.section-label { color: #86a6df; }.section-title { color: #fff; font-size: clamp(2rem, 4vw, 3.4rem); }.section-title em { color: #86a6df; font-style: normal; }.section-sub { color: rgba(255,255,255,.5); margin: 0; }
.progress-track { position: absolute; inset: auto 0 0; z-index: 2; height: 2px; background: rgba(134,166,223,.18); }.progress-fill { width: 100%; height: 100%; transform-origin: left; background: linear-gradient(90deg,#5068a9,#a7c6ff); }
.hover-label { position: absolute; z-index: 3; right: clamp(1rem,5vw,4rem); bottom: clamp(1.75rem,7vh,4rem); display: flex; align-items: center; flex-wrap: wrap; gap: .45rem; max-width: min(25rem,calc(100% - 2rem)); padding: .7rem .85rem; color: #fff; border: 1px solid rgba(167,198,255,.28); border-radius: .75rem; background: rgba(6,8,16,.76); backdrop-filter: blur(12px); pointer-events: none; }.hover-label strong { width: 100%; font-size: .9rem; }.hover-label small { color: rgba(255,255,255,.5); }.tag { padding: .15rem .38rem; border-radius: .25rem; color: #b7d1ff; background: rgba(134,166,223,.16); font-size: .7rem; }
.label-fade-enter-active,.label-fade-leave-active { transition: opacity .2s,transform .2s; }.label-fade-enter-from,.label-fade-leave-to { opacity: 0; transform: translateY(8px); }
@media (max-width: 600px) { .projects-section { height: 360vh; }.projects-header { padding-top: 1.5rem; }.section-sub { max-width: 15rem; font-size: .8rem; }.hover-label { left: 1rem; right: 1rem; bottom: 1.5rem; } }
</style>

<style>
.modal-overlay { position: fixed; inset: 0; z-index: 9999; display: grid; place-items: center; padding: 1.5rem; background: rgba(4,6,14,.82); backdrop-filter: blur(10px); }.modal-panel { position: relative; width: min(700px,100%); overflow: hidden; border: 1px solid rgba(134,166,223,.2); border-radius: 20px; background: #0d1425; box-shadow: 0 32px 80px rgba(0,0,0,.7); }.modal-close { position: absolute; z-index: 1; top: 1rem; right: 1rem; width: 2rem; height: 2rem; border: 1px solid rgba(255,255,255,.15); border-radius: 50%; background: rgba(0,0,0,.3); color: #fff; font-size: 1.3rem; cursor: pointer; }.modal-img-wrap { position: relative; height: 220px; }.modal-img { display: block; width: 100%; height: 100%; object-fit: cover; }.modal-img-tint { position: absolute; inset: 0; mix-blend-mode: multiply; }.modal-body { padding: 1.6rem 2rem 2rem; }.modal-eyebrow { color: #86a6df; font-size: .68rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }.modal-title { margin: .45rem 0 .75rem; color: #fff; font-family: 'Playfair Display',serif; font-size: 1.55rem; }.modal-desc { color: rgba(255,255,255,.58); line-height: 1.65; }.modal-tags { display: flex; flex-wrap: wrap; gap: .45rem; margin: 1.2rem 0 1.6rem; }.modal-tag { padding: .25rem .7rem; border: 1px solid rgba(134,166,223,.2); border-radius: 20px; color: #b7d1ff; background: rgba(134,166,223,.1); font-size: .72rem; }.modal-actions { display: flex; gap: .8rem; }.btn-primary,.btn-ghost { padding: .6rem 1.2rem; border-radius: 8px; font: inherit; font-size: .82rem; cursor: pointer; }.btn-primary { color: #fff; background: linear-gradient(135deg,#5068a9,#86a6df); text-decoration: none; }.btn-ghost { border: 1px solid rgba(255,255,255,.2); color: #fff; background: transparent; }.modal-enter-active,.modal-leave-active { transition: opacity .25s; }.modal-enter-from,.modal-leave-to { opacity: 0; }
</style>
