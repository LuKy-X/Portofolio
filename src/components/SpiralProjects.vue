
<template>
  
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="selectedProject"
        class="modal-overlay"
        @click.self="closeModal"
      >
        <div class="modal-panel" role="dialog" aria-modal="true">
          
          <button class="modal-close" @click="closeModal" aria-label="Close">✕</button>

          
          <div class="modal-img-wrap">
            <img :src="selectedProject.img" :alt="selectedProject.title" class="modal-img" />
            
            <div
              class="modal-img-tint"
              :style="{ background: `#${selectedProject.color.toString(16).padStart(6,'0')}33` }"
            />
          </div>

          
          <div class="modal-body">
            <span class="modal-eyebrow">Project Detail</span>
            <h3 class="modal-title">{{ selectedProject.title }}</h3>
            <p class="modal-desc">{{ selectedProject.desc }}</p>

            <div class="modal-tags">
              <span
                v-for="t in selectedProject.tags"
                :key="t"
                class="modal-tag"
              >{{ t }}</span>
            </div>

            <div class="modal-actions">
              <a
                :href="selectedProject.link"
                target="_blank"
                rel="noopener"
                class="btn-primary"
              >View Project ↗</a>
              <button class="btn-ghost" @click="closeModal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  
  <section id="projects" ref="sectionRef">
    <div class="sticky-wrap">
      
      <div class="proj-header">
        <span class="section-label">What I've Built</span>
        <h2 class="section-title">My <em>Projects</em></h2>
        <p class="section-sub">Scroll to spin · Click to explore</p>
      </div>

      
      <canvas ref="canvasRef" />

      
      <div class="prog-track">
        <div class="prog-fill" :style="{ width: progress + '%' }" />
      </div>

      
      <p class="scroll-hint">
        {{
          progress < 5  ? '↑ scroll up · My Skills'  :
          progress > 95 ? '↓ scroll down · Contact'   :
                          '↕ scroll to explore'
        }}
      </p>

      
      <Transition name="label-fade">
        <div
          v-if="hoveredProject && !selectedProject"
          class="hover-label"
        >
          <span class="hover-title">{{ hoveredProject.title }}</span>
          <span v-for="t in hoveredProject.tags" :key="t" class="tag">{{ t }}</span>
          <span class="hover-hint">click to open</span>
        </div>
      </Transition>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { useProjectsScroll } from '@/composables/useProjectsScroll'
import { useCardDistortion  } from '@/composables/useCardDistortion'

import bkkImg from '@/assets/images/bkk.png'
import nawasenaImg from '@/assets/images/nawasena.png'
import localcartImg from '@/assets/images/localcart.png'

const emit = defineEmits(['exit-down', 'exit-up'])

const sectionRef      = ref(null)
const canvasRef       = ref(null)
const hoveredProject  = ref(null)
const selectedProject = ref(null)

const PROJECTS = [
  {
    title: 'Web Bursa Khusus Kerja',
    tags:  ['Laravel', 'Blade', 'MySQL'],
    color: 0x5068a9,
    img:   bkkImg,
    desc:  'A specialized Job Exchange web platform designed to facilitate the job-seeking process. It streamlines recruitment with robust features including vacancy searches, online applications, and comprehensive applicant data management to enhance overall accessibility and efficiency.',
    link:  '#',
  },
  {
    title: 'Culture Education App',
    tags:  ['Flutter', 'Firebase'],
    color: 0x86a6df,
    img:   nawasenaImg,
    desc:  'A mobile educational app dedicated to Javanese culture, featuring interactive quizzes powered by a gamified learning engine. It includes dynamic leaderboards and seamless Firebase integration for secure user data and score management.',
    link:  '#',
  },
  {
    title: 'E-commerce Local-Cart',
    tags:  ['Laravel', 'Vue', 'MySQL'],
    color: 0x324e7b,
    img:   localcartImg,
    desc:  'A full-stack e-commerce platform equipped with a dynamic shopping cart, secure payment integration, and a comprehensive admin dashboard. Tailored specifically for MSMEs (Micro, Small, and Medium Enterprises) with real-time inventory management.',
    link:  '#',
  },
  {
    title: 'Web Bursa Khusus Kerja',
    tags:  ['Laravel', 'Blade', 'MySQL'],
    color: 0x4a6fa5,
    img:   bkkImg,
    desc:  'A specialized Job Exchange web platform designed to facilitate the job-seeking process. It streamlines recruitment with robust features including vacancy searches, online applications, and comprehensive applicant data management to enhance overall accessibility and efficiency.',
    link:  '#',
  },
  {
    title: 'Culture Education App',
    tags:  ['Flutter', 'Firebase'],
    color: 0x6b8cba,
    img:   nawasenaImg,
    desc:  'A mobile educational app dedicated to Javanese culture, featuring interactive quizzes powered by a gamified learning engine. It includes dynamic leaderboards and seamless Firebase integration for secure user data and score management.',
    link:  '#',
  },
  {
    title: 'E-commerce Local-Cart',
    tags:  ['Laravel', 'Vue', 'MySQL'],
    color: 0x3d5a8a,
    img:   localcartImg,
    desc:  'A full-stack e-commerce platform equipped with a dynamic shopping cart, secure payment integration, and a comprehensive admin dashboard. Tailored specifically for MSMEs (Micro, Small, and Medium Enterprises) with real-time inventory management.',
    link:  '#',
  },
  {
    title: 'Web Bursa Khusus Kerja',
    tags:  ['Laravel', 'Blade', 'MySQL'],
    color: 0x7a9cc5,
    img:   bkkImg,
    desc:  'A specialized Job Exchange web platform designed to facilitate the job-seeking process. It streamlines recruitment with robust features including vacancy searches, online applications, and comprehensive applicant data management to enhance overall accessibility and efficiency.',
    link:  '#',
  },
  {
    title: 'E-commerce Local-Cart',
    tags:  ['Laravel', 'Vue', 'MySQL'],
    color: 0x5575a0,
    img:   localcartImg,
    desc:  'A full-stack e-commerce platform equipped with a dynamic shopping cart, secure payment integration, and a comprehensive admin dashboard. Tailored specifically for MSMEs (Micro, Small, and Medium Enterprises) with real-time inventory management.',
    link:  '#',
  },
]

const { progress, spiralRot, scrollVelocity, attach, detach } =
  useProjectsScroll({
    onExitDown: () => emit('exit-down'),
    onExitUp:   () => emit('exit-up'),
  })

let renderer, scene, camera, raycaster, mouse, animId, cardDistortion
const meshes = []

let mouseDownX = 0, mouseDownY = 0

function openModal(project) {
  selectedProject.value = project
  document.body.style.overflow = 'hidden'
}
function closeModal() {
  selectedProject.value = null
  document.body.style.overflow = ''
}

function initThree() {
  const canvas = canvasRef.value
  const W = () => canvas.offsetWidth
  const H = () => canvas.offsetHeight

  scene  = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(60, W() / H(), 0.1, 1000)
  camera.position.set(0, 0, 13)

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.setClearColor(0x060810, 1)
  renderer.setSize(W(), H())


  scene.add(new THREE.AmbientLight(0xffffff, 0.45))
  const dl = new THREE.DirectionalLight(0x86a6df, 1.1)
  dl.position.set(5, 5, 5)
  scene.add(dl)
  const pl = new THREE.PointLight(0x5068a9, 3, 40)
  pl.position.set(-4, 0, 6)
  scene.add(pl)


  const pGeo = new THREE.BufferGeometry()
  const pPos = new Float32Array(600 * 3)
  for (let i = 0; i < 600 * 3; i++) pPos[i] = (Math.random() - 0.5) * 60
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
  scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: 0x4060a0, size: 0.06, transparent: true, opacity: 0.5,
  })))


  const loader = new THREE.TextureLoader()
  const n      = PROJECTS.length
  const TWO_PI = Math.PI * 2
  const R      = 5.8

  PROJECTS.forEach((proj, i) => {
    const geo = new THREE.PlaneGeometry(4.8, 3.0, 4, 3)
    const mat = new THREE.MeshPhongMaterial({
      color: proj.color,
      transparent: true,
      opacity: 0.92,
      shininess: 100,
      side: THREE.DoubleSide,
    })
    loader.load(proj.img, tex => {
      mat.map   = tex
      mat.color.setHex(0xffffff)
      mat.needsUpdate = true
    })

    const mesh   = new THREE.Mesh(geo, mat)
    const angle  = (i / n) * TWO_PI
    const y      = (i / n) * 6 - 3
    const px     = Math.cos(angle) * R
    const pz     = Math.sin(angle) * R - 2

    mesh.position.set(px, y, pz)





    mesh.lookAt(Math.cos(angle) * (R + 100), y, Math.sin(angle) * (R + 100) - 2)

    mesh.userData = { baseAngle: angle, idx: i, R, baseY: y }


    mesh.add(new THREE.LineSegments(
      new THREE.EdgesGeometry(geo),
      new THREE.LineBasicMaterial({ color: 0x86a6df, transparent: true, opacity: 0.35 }),
    ))

    scene.add(mesh)
    meshes.push(mesh)
  })

  raycaster = new THREE.Raycaster()
  mouse     = new THREE.Vector2(-99, -99)

  cardDistortion = useCardDistortion(meshes, scrollVelocity)


  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect()
    mouse.x =  ((e.clientX - r.left) / r.width)  * 2 - 1
    mouse.y = -((e.clientY - r.top)  / r.height) * 2 + 1
  })
  canvas.addEventListener('mouseleave', () => {
    mouse.set(-99, -99)
    canvas.style.cursor = 'default'
  })


  canvas.addEventListener('mousedown', e => {
    mouseDownX = e.clientX
    mouseDownY = e.clientY
  })

  canvas.addEventListener('click', e => {

    const dx = Math.abs(e.clientX - mouseDownX)
    const dy = Math.abs(e.clientY - mouseDownY)
    if (dx > 5 || dy > 5) return

    raycaster.setFromCamera(mouse, camera)
    const hits = raycaster.intersectObjects(meshes)
    if (hits.length) {
      openModal(PROJECTS[hits[0].object.userData.idx])
    }
  })


  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal()
  })


  const ro = new ResizeObserver(() => {
    camera.aspect = W() / H()
    camera.updateProjectionMatrix()
    renderer.setSize(W(), H())
  })
  ro.observe(canvas)


  let t = 0

  const hoverScales = new Array(meshes.length).fill(1)

  function animate() {
    animId = requestAnimationFrame(animate)
    t += 0.005

    const rot = spiralRot.value


    raycaster.setFromCamera(mouse, camera)
    const hits       = raycaster.intersectObjects(meshes)
    const hoveredIdx = hits.length ? hits[0].object.userData.idx : -1
    hoveredProject.value = hoveredIdx >= 0 ? PROJECTS[hoveredIdx] : null


    canvasRef.value.style.cursor = hoveredIdx >= 0 ? 'pointer' : 'default'

    meshes.forEach((card, i) => {
      const { baseAngle, R, baseY } = card.userData
      const a   = baseAngle + rot
      const px  = Math.cos(a) * R
      const pz  = Math.sin(a) * R - 2
      const py  = baseY + Math.sin(t + i * 0.9) * 0.002

      card.position.set(px, py, pz)


      card.lookAt(Math.cos(a) * (R + 100), py, Math.sin(a) * (R + 100) - 2)

      card.material.opacity = 1


      const dist    = card.position.distanceTo(camera.position)
      const baseSc  = Math.max(0.6, 1 - (dist - 7) * 0.04)

      const targetHS    = i === hoveredIdx ? 1.08 : 1.0
      hoverScales[i]   += (targetHS - hoverScales[i]) * 0.12
      card.scale.setScalar(baseSc * hoverScales[i])

      const edgeLine = card.children[0]
      if (edgeLine) {
        const targetOpacity   = i === hoveredIdx ? 0.9 : 0.35
        edgeLine.material.opacity += (targetOpacity - edgeLine.material.opacity) * 0.12
      }
    })

    cardDistortion.updateDistortion()
    renderer.render(scene, camera)
  }
  animate()
}

onMounted(() => {
  initThree()
  attach(sectionRef.value)
})

onUnmounted(() => {
  detach()
  cancelAnimationFrame(animId)
  renderer?.dispose()
  document.body.style.overflow = ''
})
</script>

<style scoped>
#projects {
  position: relative;
  width: 100%;
  height: 400vh;
  background: #060810;
}

.sticky-wrap {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}

.proj-header {
  position: absolute;
  top: 0; left: 0; right: 0;
  padding: 2.5rem 3rem 4rem;
  background: linear-gradient(to bottom, rgba(6,8,16,.98) 0%, transparent 100%);
  z-index: 10;
  pointer-events: none;
}
.section-label {
  display: block;
  font-size: .72rem; font-weight: 600; letter-spacing: 3px;
  text-transform: uppercase; color: #86a6df; margin-bottom: .5rem;
}
.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.4rem; color: #fff; margin-bottom: .3rem;
}
.section-title em { color: #86a6df; font-style: normal; }
.section-sub { font-size: .82rem; color: rgba(255,255,255,.3); }

.prog-track {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 2px;
  background: rgba(134,166,223,.1);
  z-index: 10;
}
.prog-fill {
  height: 100%;
  background: linear-gradient(90deg, #5068a9, #86a6df);
  transition: width .15s ease;
}

.scroll-hint {
  position: absolute;
  bottom: 1.4rem; left: 50%;
  transform: translateX(-50%);
  font-size: .72rem; letter-spacing: 1.5px;
  color: rgba(255,255,255,.28);
  z-index: 10; pointer-events: none;
  animation: hintPulse 2.5s ease-in-out infinite;
}
@keyframes hintPulse { 0%,100%{opacity:.28} 50%{opacity:.65} }

.hover-label {
  position: absolute;
  bottom: 3rem; left: 50%;
  transform: translateX(-50%);
  background: rgba(6,8,16,.88);
  border: 1px solid rgba(134,166,223,.3);
  border-radius: 8px;
  padding: .45rem 1.2rem;
  color: #fff; font-size: .8rem;
  white-space: nowrap;
  z-index: 20; pointer-events: none;
  display: flex; align-items: center; gap: .5rem;
}
.hover-title { font-weight: 600; }
.tag {
  display: inline-block;
  font-size: .68rem; color: #86a6df;
  background: rgba(134,166,223,.12);
  padding: .1rem .4rem; border-radius: 4px;
}
.hover-hint {
  font-size: .65rem;
  color: rgba(255,255,255,.35);
  border-left: 1px solid rgba(255,255,255,.15);
  padding-left: .5rem;
  font-style: italic;
}

.label-fade-enter-active,
.label-fade-leave-active { transition: opacity .25s ease, transform .25s ease; }
.label-fade-enter-from,
.label-fade-leave-to     { opacity: 0; transform: translateX(-50%) translateY(6px); }
</style>

<style>
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(4, 6, 14, 0.82);
  backdrop-filter: blur(10px) saturate(1.2);
  -webkit-backdrop-filter: blur(10px) saturate(1.2);
  z-index: 9999;
  display: flex; align-items: center; justify-content: center;
  padding: 1.5rem;
}

.modal-panel {
  position: relative;
  background: #0d1425;
  border: 1px solid rgba(134,166,223,.18);
  border-radius: 20px;
  width: 100%;
  max-width: 700px;
  overflow: hidden;
  box-shadow:
    0 32px 80px rgba(0,0,0,.7),
    0 0 0 1px rgba(134,166,223,.08) inset;
}

.modal-close {
  position: absolute; top: 1rem; right: 1rem;
  z-index: 10;
  width: 32px; height: 32px;
  border: 1px solid rgba(255,255,255,.15);
  border-radius: 50%;
  background: rgba(255,255,255,.06);
  color: rgba(255,255,255,.7);
  font-size: .8rem;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background .2s, color .2s;
}
.modal-close:hover {
  background: rgba(255,255,255,.14);
  color: #fff;
}

.modal-img-wrap {
  position: relative;
  width: 100%; height: 220px;
  overflow: hidden;
}
.modal-img {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
  filter: brightness(.85) saturate(1.1);
}
.modal-img-tint {
  position: absolute; inset: 0;
  mix-blend-mode: multiply;
  pointer-events: none;
}
.modal-img-wrap::after {
  content: '';
  position: absolute; bottom: 0; left: 0; right: 0;
  height: 60px;
  background: linear-gradient(to bottom, transparent, #0d1425);
}

.modal-body {
  padding: 1.6rem 2rem 2rem;
}
.modal-eyebrow {
  display: block;
  font-size: .65rem; font-weight: 700; letter-spacing: 2.5px;
  text-transform: uppercase; color: #86a6df;
  margin-bottom: .5rem;
}
.modal-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.55rem; font-weight: 700;
  color: #fff;
  margin-bottom: .75rem;
  line-height: 1.25;
}
.modal-desc {
  font-size: .88rem;
  color: rgba(255,255,255,.55);
  line-height: 1.65;
  margin-bottom: 1.1rem;
}

.modal-tags {
  display: flex; flex-wrap: wrap; gap: .45rem;
  margin-bottom: 1.6rem;
}
.modal-tag {
  font-size: .72rem; font-weight: 600;
  color: #86a6df;
  background: rgba(134,166,223,.1);
  border: 1px solid rgba(134,166,223,.2);
  padding: .25rem .7rem;
  border-radius: 20px;
}

.modal-actions {
  display: flex; gap: .8rem; align-items: center;
}
.btn-primary {
  display: inline-block;
  padding: .6rem 1.4rem;
  background: linear-gradient(135deg, #5068a9, #86a6df);
  color: #fff;
  font-size: .82rem; font-weight: 600;
  border-radius: 8px; border: none;
  text-decoration: none;
  cursor: pointer;
  transition: opacity .2s, transform .2s;
}
.btn-primary:hover { opacity: .88; transform: translateY(-1px); }
.btn-ghost {
  padding: .6rem 1.2rem;
  background: transparent;
  border: 1px solid rgba(255,255,255,.15);
  color: rgba(255,255,255,.55);
  font-size: .82rem;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color .2s, color .2s;
}
.btn-ghost:hover {
  border-color: rgba(255,255,255,.35);
  color: rgba(255,255,255,.9);
}

.modal-enter-active,
.modal-leave-active  { transition: opacity .28s ease; }
.modal-enter-from,
.modal-leave-to      { opacity: 0; }

.modal-enter-active .modal-panel,
.modal-leave-active .modal-panel { transition: transform .28s cubic-bezier(.34,1.3,.64,1), opacity .28s ease; }
.modal-enter-from   .modal-panel { transform: scale(.9) translateY(12px); opacity: 0; }
.modal-leave-to     .modal-panel { transform: scale(.95) translateY(4px); opacity: 0; }

@media (max-width: 500px) {
  .modal-panel { border-radius: 14px; }
  .modal-body  { padding: 1.2rem 1.4rem 1.5rem; }
  .modal-title { font-size: 1.2rem; }
  .modal-img-wrap { height: 160px; }
  .modal-actions { flex-direction: column; align-items: stretch; }
  .btn-primary, .btn-ghost { text-align: center; }
}
</style>
