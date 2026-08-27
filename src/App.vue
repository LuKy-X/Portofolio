<template>
  <NavBar />

  <HeroSection    id="hero"    />
  <AboutSection   id="about"   />
  <SkillsSection  id="skills"  />

  <SpiralProjects
    id="projects"
    @exit-down="goTo('contact')"
    @exit-up="goTo('skills')"
  />

  <ContactSection id="contact" />
  <FooterBar />
</template>

<script setup>
import NavBar         from '@/components/NavBar.vue'
import HeroSection    from '@/components/HeroSection.vue'
import AboutSection   from '@/components/AboutSection.vue'
import SkillsSection  from '@/components/SkillsSection.vue'
import SpiralProjects from '@/components/SpiralProjects.vue'
import ContactSection from '@/components/ContactSection.vue'
import FooterBar      from '@/components/FooterBar.vue'

function goTo(sectionId) {
  const el = document.getElementById(sectionId)
  if (!el) return
  el.scrollIntoView({ behavior: 'instant', block: 'start' })
}
</script>

<style>
:root {
  --deep:       #324e7b;
  --mid:        #5068a9;
  --light:      #86a6df;
  --cream:      #f8f9fd;
  --text-dark:  #1a2540;
  --text-muted: #7a8cb0;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: 'DM Sans', sans-serif;
  background: var(--cream);
  color: var(--text-dark);
  overflow-x: hidden;
}

::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-thumb { background: var(--light); border-radius: 3px; }

.reveal { opacity: 0; transform: translateY(32px); transition: opacity .7s, transform .7s; }
.reveal.visible { opacity: 1; transform: none; }
</style>
