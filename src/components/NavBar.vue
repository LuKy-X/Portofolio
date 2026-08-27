<template>
  <div class="cursor-dot" ref="cursorRef" />

  <nav :class="{ scrolled: isScrolled }" id="navbar">
    <a href="#hero" @click.prevent="scrollTo('hero')" class="logo-container">
        <svg class="brand-logo" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" zoomAndPan="magnify" viewBox="430 590 640 330" height="30" preserveAspectRatio="xMidYMid meet" version="1.0">
          <defs><g/></defs>
          <g fill="#38b6ff" fill-opacity="1"><g transform="translate(580.510714, 810.23019)"><g><path d="M 333.53125 -204.625 L 266.59375 0 L 215.71875 0 L 170.703125 -138.5625 L 124.234375 0 L 73.65625 0 L 6.4375 -204.625 L 55.546875 -204.625 L 101.71875 -60.796875 L 149.953125 -204.625 L 193.796875 -204.625 L 240.578125 -59.625 L 288.21875 -204.625 Z M 333.53125 -204.625 "/></g></g></g>
          <g fill="#0d2a62" fill-opacity="1"><g transform="translate(440.612806, 899.019743)"><g><path d="M 333.53125 -204.625 L 266.59375 0 L 215.71875 0 L 170.703125 -138.5625 L 124.234375 0 L 73.65625 0 L 6.4375 -204.625 L 55.546875 -204.625 L 101.71875 -60.796875 L 149.953125 -204.625 L 193.796875 -204.625 L 240.578125 -59.625 L 288.21875 -204.625 Z M 333.53125 -204.625 "/></g></g></g>
          <g fill="#0d2a62" fill-opacity="1"><g transform="translate(721.325179, 899.019743)"><g><path d="M 333.53125 -204.625 L 266.59375 0 L 215.71875 0 L 170.703125 -138.5625 L 124.234375 0 L 73.65625 0 L 6.4375 -204.625 L 55.546875 -204.625 L 101.71875 -60.796875 L 149.953125 -204.625 L 193.796875 -204.625 L 240.578125 -59.625 L 288.21875 -204.625 Z M 333.53125 -204.625 "/></g></g></g>
        </svg>

        <span class="brand-text">Wis Web Works</span>
      </a>
    <ul class="nav-links">
      <li v-for="link in links" :key="link.id">
        <a :href="'#' + link.id" @click.prevent="scrollTo(link.id)">{{ link.label }}</a>
      </li>
    </ul>
    <button class="nav-cta" @click="scrollTo('contact')">Hire Me</button>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const cursorRef  = ref(null)

const links = [
  { id: 'hero',     label: 'Home'     },
  { id: 'about',    label: 'About'    },
  { id: 'skills',   label: 'Skills'   },
  { id: 'projects', label: 'Projects' },
  { id: 'contact',  label: 'Contact'  },
]

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function onScroll() {
  isScrolled.value = window.scrollY > 60
}

function onMouseMove(e) {
  if (!cursorRef.value) return
  cursorRef.value.style.left = e.clientX + 'px'
  cursorRef.value.style.top  = e.clientY + 'px'
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('mousemove', onMouseMove)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('mousemove', onMouseMove)
})
</script>

<style scoped>

.cursor-dot {
  width: 8px; height: 8px;
  background: var(--light);
  border-radius: 50%;
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  transition: transform .1s, opacity .2s;
  mix-blend-mode: difference;
}

nav {
  position: fixed; top: 1.2rem; left: 50%;
  transform: translateX(-50%);
  width: min(860px, 90%);
  background: rgba(248,249,253,.72);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(134,166,223,.25);
  border-radius: 50px;
  padding: .55rem 1.6rem;
  display: flex; align-items: center; justify-content: space-between;
  z-index: 1000;
  box-shadow: 0 4px 24px rgba(50,78,123,.10);
  transition: background .3s, box-shadow .3s;
}
nav.scrolled {
  background: rgba(248,249,253,.95);
  box-shadow: 0 4px 20px rgba(50,78,123,.14);
}
.nav-brand {
  display: flex;
  align-items: center;
}


.logo-container {
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 0.5rem;
  cursor: pointer;
}

.brand-logo {
  height: 32px;
  width: auto;
  transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

.brand-text {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--deep);
  letter-spacing: 0.5px;

  opacity: 0;
  max-width: 0;
  overflow: hidden;
  white-space: nowrap;
  transform: translateX(-8px);
  transition: opacity 0.3s ease, max-width 0.4s cubic-bezier(0.25, 1, 0.5, 1), transform 0.3s ease;
}

.logo-container:hover .brand-logo {
  transform: scale(1.05) rotate(-3deg);
}

.logo-container:hover .brand-text {
  opacity: 1;
  max-width: 150px;
  transform: translateX(0);
}
.nav-links {
  display: flex; gap: 1.8rem; list-style: none;
}
.nav-links a {
  font-size: .82rem; font-weight: 500; color: var(--mid);
  text-decoration: none; letter-spacing: .3px; transition: color .2s;
}
.nav-links a:hover { color: var(--deep); }
.nav-cta {
  background: var(--deep); color: #fff;
  padding: .42rem 1.2rem; border-radius: 20px;
  font-size: .82rem; font-weight: 600;
  border: none; cursor: pointer;
  transition: transform .2s, box-shadow .2s, background .2s;
  font-family: 'DM Sans', sans-serif;
}
.nav-cta:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 18px rgba(50,78,123,.35);
  background: var(--mid);
}
</style>
