
<template>
  <section id="about">
    <div class="container">
      <div class="about-grid">


        <div class="about-avatar-wrap reveal" ref="avatarRef">
          <div class="about-video-card">
            <video
              ref="videoRef"
              class="about-video"
              autoplay
              loop
              playsinline
              preload="metadata"
              controls
              :poster="videoPoster"
            >
              <source :src="videoSrc" type="video/mp4" />

              Your browser does not support the video tag.
            </video>


            <div class="video-overlay">
              <div class="video-name-badge">
                <span class="video-play-dot" />
                <div>
                  <p class="video-name">Your Name</p>
                  <p class="video-role">Full Stack Developer</p>
                </div>
              </div>
            </div>

          </div>


          <div class="star-deco" />


          <div class="float-chip chip-1">Vue 3 🟢</div>
          <div class="float-chip chip-2">Laravel 🔴</div>
          <div class="float-chip chip-3">Flutter 💙</div>
        </div>


        <div class="about-text">
          <span class="section-label reveal">Who I Am</span>
          <h2 class="section-title reveal reveal-delay-1">About <em>Me</em></h2>
          <p class="about-desc reveal reveal-delay-2">
            I'm a Programmer with a passion for building products
            that live at the intersection of design and engineering. I care
            deeply about clean code, thoughtful UX, and shipping things that
            make a real difference for users.
          </p>

          <div class="stats-row reveal reveal-delay-2">
            <div v-for="s in stats" :key="s.label" class="stat-item">
              <span class="stat-num">{{ s.display }}</span>
              <span class="stat-lbl">{{ s.label }}</span>
            </div>
          </div>

          <a href="#" class="btn-primary reveal reveal-delay-3">Learn More →</a>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

import videoFile from '@/assets/video/w.mp4'
const videoSrc   = videoFile

const videoPoster = ''

const avatarRef = ref(null)
const videoRef  = ref(null)

const stats = [
  { display: '5+',  label: 'Education'          },
  { display: '2+',  label: 'Years Experience'   },
  { display: '10+', label: 'Projects Completed' },
]

let obs
onMounted(() => {
  obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
  }, { threshold: .15 })
  document.querySelectorAll('#about .reveal').forEach(el => obs.observe(el))


  videoRef.value?.play().catch(() => {


  })
})
onUnmounted(() => obs?.disconnect())
</script>

<style scoped>
#about { background: var(--cream); padding: 5rem 0; }

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.about-avatar-wrap {
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
}

.about-video-card {
  position: relative;
  width: 320px;
  height: 380px;
  border-radius: 24px;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(80,104,169,.15), rgba(134,166,223,.2));
  border: 1px solid rgba(134,166,223,.3);
  box-shadow:
    0 20px 48px rgba(50,78,123,.16),
    0 0 0 1px rgba(134,166,223,.08) inset;
  transition: transform .4s ease, box-shadow .4s ease;
  cursor: default;
}

.about-video-card:hover {
  transform: translateY(-6px) rotate(1deg);
  box-shadow:
    0 28px 56px rgba(50,78,123,.22),
    0 0 0 1px rgba(134,166,223,.15) inset;
}

.about-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: brightness(.95) saturate(1.05);
}

.video-overlay {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 2rem 1.2rem 1.2rem;
  background: linear-gradient(
    to top,
    rgba(26, 37, 64, 0.88) 0%,
    rgba(26, 37, 64, 0.5)  50%,
    transparent 100%
  );
}

.video-name-badge {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.video-play-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #42B883;
  flex-shrink: 0;
  box-shadow: 0 0 0 0 rgba(66,184,131,.5);
  animation: pulse-dot 2.2s ease-in-out infinite;
}
@keyframes pulse-dot {
  0%   { box-shadow: 0 0 0 0 rgba(66,184,131,.5); }
  60%  { box-shadow: 0 0 0 6px rgba(66,184,131,0); }
  100% { box-shadow: 0 0 0 0 rgba(66,184,131,0); }
}

.video-name {
  font-size: .82rem;
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
  margin: 0;
}
.video-role {
  font-size: .68rem;
  color: rgba(255,255,255,.6);
  margin: 0;
  letter-spacing: .5px;
}

.star-deco {
  position: absolute;
  bottom: -20px; left: -20px;
  width: 90px; height: 90px;
  background: linear-gradient(135deg, var(--mid), var(--light));
  clip-path: polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);
  opacity: .22;
  animation: spin 12s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.float-chip {
  position: absolute;
  background: rgba(255,255,255,.92);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(134,166,223,.4);
  border-radius: 20px;
  padding: .35rem .85rem;
  font-size: .75rem; font-weight: 600;
  color: var(--deep);
  animation: floatChip 3.5s ease-in-out infinite;
  box-shadow: 0 4px 16px rgba(50,78,123,.12);
  white-space: nowrap;
}
.chip-1 { top: 10%;    right: -30px; animation-delay: 0s;   }
.chip-2 { top: 48%;   left:  -35px; animation-delay: .9s;  }
.chip-3 { bottom: 18%; right: -15px; animation-delay: 1.8s; }
@keyframes floatChip {
  0%,100% { transform: translateY(0);   }
  50%     { transform: translateY(-9px); }
}

.about-text .section-label {
  display: block;
  font-size: .72rem; font-weight: 600; letter-spacing: 3px;
  text-transform: uppercase; color: var(--mid); margin-bottom: .5rem;
}
.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.4rem; color: var(--text-dark); margin-bottom: 1rem;
}
.section-title em { color: var(--mid); font-style: normal; }

.about-desc {
  font-size: .95rem; color: var(--text-muted);
  line-height: 1.8; margin-bottom: 1.5rem;
}

.stats-row { display: flex; gap: 2.5rem; margin-bottom: 1.8rem; }
.stat-item  { text-align: center; }
.stat-num {
  font-family: 'Playfair Display', serif;
  font-size: 2rem; color: var(--deep); font-weight: 700; display: block;
}
.stat-lbl {
  font-size: .76rem; color: var(--text-muted);
  font-weight: 500; letter-spacing: .5px;
}

.btn-primary {
  display: inline-flex; align-items: center; gap: .5rem;
  background: var(--mid); color: #fff;
  padding: .7rem 1.8rem; border-radius: 30px;
  font-weight: 700; font-size: .88rem;
  text-decoration: none;
  transition: transform .2s, box-shadow .2s, background .2s;
}
.btn-primary:hover {
  background: var(--deep);
  transform: scale(1.05);
  box-shadow: 0 6px 22px rgba(50,78,123,.3);
}

.reveal {
  opacity: 0; transform: translateY(32px);
  transition: opacity .7s ease, transform .7s ease;
}
.reveal.visible { opacity: 1; transform: none; }
.reveal-delay-1 { transition-delay: .12s; }
.reveal-delay-2 { transition-delay: .24s; }
.reveal-delay-3 { transition-delay: .36s; }

@media (max-width: 768px) {
  .about-grid { grid-template-columns: 1fr; gap: 2.5rem; }
  .about-avatar-wrap {

    justify-content: center;
  }
  .about-video-card {
    width: 280px;
    height: 340px;
  }
  .chip-1 { right: -10px; }
  .chip-2 { left: -10px;  }
  .chip-3 { right: -10px; }
  .stats-row { gap: 1.5rem; }
}

@media (max-width: 400px) {
  .about-video-card { width: 240px; height: 300px; }
}
</style>
