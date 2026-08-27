<!-- components/FooterBar.vue -->
<template>
  <footer>
    <div class="footer-inner">
      <!-- Brand -->
      <div class="footer-brand">Portfolio.</div>

      <!-- Nav links -->
      <ul class="footer-links">
        <li v-for="link in links" :key="link.id">
          <a :href="'#' + link.id" @click.prevent="scrollTo(link.id)">{{ link.label }}</a>
        </li>
      </ul>

      <!-- Socials -->
      <div class="footer-socials">
        <a v-for="s in socials" :key="s.label" :href="s.href" :title="s.label" target="_blank">
          {{ s.abbr }}
        </a>
      </div>
    </div>

    <!-- Divider -->
    <div class="footer-divider" />

    <div class="footer-bottom">
      <span class="footer-copy">© {{ year }} QualiCode. All rights reserved.</span>
      <span class="footer-made">Built with Vue 3 + Three.js ♥</span>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()

const links = [
  { id: 'hero',     label: 'Home'     },
  { id: 'about',    label: 'About'    },
  { id: 'skills',   label: 'Skills'   },
  { id: 'projects', label: 'Projects' },
  { id: 'contact',  label: 'Contact'  },
]

const socials = [
  { label: 'GitHub',    abbr: 'GH', href: 'https://github.com/LuKy-X' },
  { label: 'LinkedIn',  abbr: 'LI', href: '#' },
  { label: 'Twitter/X', abbr: 'X',  href: '#' },
  { label: 'Instagram', abbr: 'IG', href: '#' },
]

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<style scoped>
footer {
  background: var(--deep);
  padding: 2.5rem 2.5rem 1.5rem;
}

.footer-inner {
  max-width: 1100px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 1.2rem;
  padding-bottom: 1.8rem;
}

.footer-brand {
  font-family: 'Playfair Display', serif;
  color: #fff; font-size: 1.15rem; font-weight: 700; letter-spacing: .5px;
}

.footer-links {
  display: flex; gap: 2rem; list-style: none;
  flex-wrap: wrap;
}
.footer-links a {
  font-size: .82rem; color: rgba(255,255,255,.5);
  text-decoration: none; transition: color .2s;
  font-weight: 500;
}
.footer-links a:hover { color: #fff; }

.footer-socials { display: flex; gap: .6rem; }
.footer-socials a {
  width: 34px; height: 34px; border-radius: 50%;
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.15);
  display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,.6); font-size: .7rem; font-weight: 700;
  text-decoration: none;
  transition: background .2s, color .2s, transform .2s;
}
.footer-socials a:hover {
  background: rgba(134,166,223,.25);
  color: #fff;
  transform: translateY(-3px);
}

.footer-divider {
  max-width: 1100px; margin: 0 auto;
  height: 1px; background: rgba(255,255,255,.08);
}

.footer-bottom {
  max-width: 1100px; margin: 0 auto;
  display: flex; justify-content: space-between; align-items: center;
  padding-top: 1.2rem; flex-wrap: wrap; gap: .5rem;
}
.footer-copy { font-size: .78rem; color: rgba(255,255,255,.3); }
.footer-made { font-size: .76rem; color: rgba(134,166,223,.5); }

@media (max-width: 600px) {
  .footer-inner { flex-direction: column; align-items: center; text-align: center; }
  .footer-links  { justify-content: center; }
  .footer-bottom { justify-content: center; }
}
</style>
