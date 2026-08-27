
<template>
  <section id="skills">
    <div class="container">

      <div class="skills-header">
        <span class="section-label reveal">What I Know</span>
        <h2 class="section-title reveal reveal-delay-1">My <em>Skills</em></h2>
        <p class="section-sub reveal reveal-delay-2">
          Technologies and tools I work with to create amazing digital experiences
        </p>
      </div>


      <div
        v-for="group in skillGroups"
        :key="group.label"
        class="skill-group reveal"
      >
        <span class="group-label">{{ group.label }}</span>
        <div class="skills-row">
          <div
            v-for="(skill, i) in group.skills"
            :key="skill.name"
            class="skill-card reveal"
            :style="{
              transitionDelay: i * 0.06 + 's',
              '--accent': skill.color,
            }"
            ref="cardRefs"
            :data-idx="skill._idx"
          >

            <div class="skill-logo-wrap">
              <img
                :src="skill.logo"
                :alt="skill.name + ' logo'"
                class="skill-logo"
                loading="lazy"
                draggable="false"
              />
            </div>


            <div class="skill-info">
              <div class="skill-meta">
                <span class="skill-name">{{ skill.name }}</span>
                <span class="skill-pct">{{ skill.pct }}%</span>
              </div>
              <div class="skill-bar-bg">
                <div
                  class="skill-bar"
                  :style="{ width: animatedCards.has(skill._idx) ? skill.pct + '%' : '0%' }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'


const DI = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons'



const allSkills = [

  { name: 'PHP',        logo: `${DI}/php/php-original.svg`,                   pct: 85, color: '#8892bf', cat: 'Backend & Language' },
  { name: 'Laravel',    logo: `${DI}/laravel/laravel-original.svg`,           pct: 82, color: '#FF2D20', cat: 'Backend & Language' },
  { name: 'Python',     logo: `${DI}/python/python-original.svg`,             pct: 75, color: '#3776AB', cat: 'Backend & Language' },
  { name: 'Java',       logo: `${DI}/java/java-original.svg`,                 pct: 78, color: '#007396', cat: 'Backend & Language' },
  { name: 'C#',         logo: `${DI}/csharp/csharp-original.svg`,            pct: 70, color: '#239120', cat: 'Backend & Language' },
  { name: 'MySQL',      logo: `${DI}/mysql/mysql-original.svg`,               pct: 80, color: '#4479A1', cat: 'Backend & Language' },

  { name: 'JavaScript', logo: `${DI}/javascript/javascript-original.svg`,     pct: 88, color: '#F7DF1E', cat: 'Frontend' },
  { name: 'Vue.js',     logo: `${DI}/vuejs/vuejs-original.svg`,               pct: 90, color: '#42B883', cat: 'Frontend' },
  { name: 'Tailwind',   logo: `${DI}/tailwindcss/tailwindcss-original.svg`,  pct: 92, color: '#38BDF8', cat: 'Frontend' },

  { name: 'Kotlin',     logo: `${DI}/kotlin/kotlin-original.svg`,             pct: 72, color: '#7F52FF', cat: 'Mobile' },
  { name: 'Flutter',    logo: `${DI}/flutter/flutter-original.svg`,           pct: 68, color: '#54C5F8', cat: 'Mobile' },

  { name: 'Firebase',   logo: `${DI}/firebase/firebase-original.svg`,         pct: 80, color: '#FFCA28', cat: 'Services' },
].map((s, i) => ({ ...s, _idx: i }))


const categoryOrder = ['Backend & Language', 'Frontend', 'Mobile', 'Services']
const skillGroups = categoryOrder.map(label => ({
  label,
  skills: allSkills.filter(s => s.cat === label),
}))


const cardRefs      = ref([])
const animatedCards = reactive(new Set())

let revealObs, barObs

onMounted(() => {

  revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
  }, { threshold: 0.1 })

  document.querySelectorAll('#skills .reveal').forEach(el => revealObs.observe(el))


  barObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const idx = Number(e.target.dataset.idx)
        if (!isNaN(idx)) animatedCards.add(idx)
      }
    })
  }, { threshold: 0.25 })

  cardRefs.value.forEach(el => el && barObs.observe(el))
})

onUnmounted(() => {
  revealObs?.disconnect()
  barObs?.disconnect()
})
</script>

<style scoped>
#skills {
  background: #f8f9fd;
  padding: 6rem 0 5rem;
}

.container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 2rem;
}

.skills-header {
  text-align: center;
  margin-bottom: 3.5rem;
}
.section-label {
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--mid);
  margin-bottom: 0.5rem;
}
.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.4rem;
  color: var(--text-dark);
  margin-bottom: 0.6rem;
}
.section-title em { color: var(--mid); font-style: normal; }
.section-sub {
  font-size: 0.88rem;
  color: var(--text-muted);
  max-width: 480px;
  margin: 0 auto;
  line-height: 1.6;
}

.skill-group {
  margin-bottom: 2.4rem;
}
.group-label {
  display: inline-block;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: var(--text-muted);
  border-left: 2px solid var(--mid);
  padding-left: 0.6rem;
  margin-bottom: 1rem;
}

.skills-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.skill-card {
  flex: 1 1 180px;
  max-width: 220px;

  display: flex;
  align-items: center;
  gap: 0.9rem;

  background: #fff;
  border: 1px solid rgba(134, 166, 223, 0.2);
  border-radius: 14px;
  padding: 0.95rem 1.1rem;

  cursor: default;
  position: relative;
  overflow: hidden;

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}

/* Glow shimmer dengan warna aksen teknologi */
.skill-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(circle at 30% 50%, var(--accent, #5068a9) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.35s ease;
  pointer-events: none;
}

.skill-card:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 28px color-mix(in srgb, var(--accent, #5068a9) 22%, transparent);
  border-color: color-mix(in srgb, var(--accent, #5068a9) 55%, transparent);
}
.skill-card:hover::before {
  opacity: 0.07;
}

.skill-logo-wrap {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: rgba(134, 166, 223, 0.08);
  transition: background 0.25s;
}
.skill-card:hover .skill-logo-wrap {
  background: color-mix(in srgb, var(--accent, #5068a9) 12%, transparent);
}
.skill-logo {
  width: 26px;
  height: 26px;
  object-fit: contain;
  display: block;
  /* Prevent drag-ghost */
  user-select: none;
}

.skill-info {
  flex: 1;
  min-width: 0;
}
.skill-meta {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.4rem;
}
.skill-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-dark);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.skill-pct {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-muted);
  margin-left: 0.4rem;
  flex-shrink: 0;
}

.skill-bar-bg {
  height: 4px;
  background: rgba(134, 166, 223, 0.18);
  border-radius: 2px;
  overflow: hidden;
}
.skill-bar {
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(90deg, var(--mid), var(--light));
  /* Override gradient dengan warna aksen saat card di-hover */
  background: linear-gradient(90deg, var(--accent, var(--mid)), color-mix(in srgb, var(--accent, var(--light)) 60%, #fff));
  width: 0;
  transition: width 1.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal.visible {
  opacity: 1;
  transform: none;
}
.reveal-delay-1 { transition-delay: 0.1s; }
.reveal-delay-2 { transition-delay: 0.2s; }

@media (max-width: 900px) {
  .skill-card {
    flex: 1 1 160px;
    max-width: none;
  }
}

@media (max-width: 520px) {
  .skills-row {
    flex-direction: column;
  }
  .skill-card {
    max-width: 100%;
  }
}
</style>
