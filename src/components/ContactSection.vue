<template>
  <section id="contact">
    <div class="container">
      <!-- Header -->
      <div class="contact-header">
        <span class="section-label reveal">Let's Talk</span>
        <h2 class="section-title reveal reveal-delay-1">Get In <em>Touch</em> •</h2>
        <p class="section-sub reveal reveal-delay-2">Let's discuss your next project</p>
      </div>

      <div class="contact-grid">
        <!-- Avatar kiri — statis -->
        <div class="contact-avatar-wrap reveal">
          <div class="contact-avatar-box">
            <img
              src="@/assets/images/w_png.png"
              alt="Contact Avatar"
            />
          </div>
          <!-- Info cards -->
          <div class="info-cards">
            <div v-for="info in infos" :key="info.label" class="info-card">
              <span class="info-icon">{{ info.icon }}</span>
              <div>
                <p class="info-label">{{ info.label }}</p>
                <p class="info-val">{{ info.val }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Form kanan -->
        <div class="reveal reveal-delay-1">
          <div class="form-row">
            <div class="form-field">
              <input v-model="form.firstName" type="text" placeholder="First Name" />
            </div>
            <div class="form-field">
              <input v-model="form.lastName" type="text" placeholder="Last Name" />
            </div>
            <div class="form-field full">
              <input v-model="form.email" type="email" placeholder="Email Address" />
            </div>
            <div class="form-field full">
              <input v-model="form.phone" type="tel" placeholder="Phone Number" />
            </div>
            <div class="form-field full">
              <textarea v-model="form.message" placeholder="Your Message" rows="4" />
            </div>
          </div>

          <button class="btn-send" @click="handleSend" :disabled="sending">
            <span v-if="!sending">✉ Send Message</span>
            <span v-else class="sending-anim">Sending…</span>
          </button>

          <!-- Success toast -->
          <Transition name="toast">
            <div v-if="sent" class="toast">✓ Message sent! I'll get back to you shortly.</div>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'

const form = reactive({ firstName: '', lastName: '', email: '', phone: '', message: '' })
const sending = ref(false)
const sent    = ref(false)

const infos = [
  { icon: '📧', label: 'Email',    val: 'cordlink@gmail.com' },
  { icon: '📱', label: 'Phone',    val: '+62 857-8619-9483'   },
  { icon: '📍', label: 'Location', val: 'Indonesia'  },
]

async function handleSend() {
  if (!form.email || !form.message) return
  sending.value = true
  await new Promise(r => setTimeout(r, 1200))
  sending.value = false
  sent.value    = true
  Object.keys(form).forEach(k => form[k] = '')
  setTimeout(() => sent.value = false, 4000)
}

let obs
onMounted(() => {
  obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
  }, { threshold: .12 })
  document.querySelectorAll('#contact .reveal').forEach(el => obs.observe(el))
})
onUnmounted(() => obs?.disconnect())
</script>

<style scoped>
#contact { background: var(--cream); padding: 5rem 0; }

.contact-header { text-align: center; margin-bottom: 3rem; }
.section-title em { color: var(--mid); font-style: normal; }

.contact-grid {
  display: grid; grid-template-columns: 1fr 1.4fr;
  gap: 4rem; align-items: start;
}

/* Avatar */
.contact-avatar-wrap { display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
.contact-avatar-box {
  width: 260px; height: 300px; border-radius: 20px; overflow: hidden;
  background: linear-gradient(135deg, rgba(80,104,169,.1), rgba(134,166,223,.15));
  border: 1px solid rgba(134,166,223,.2);
  display: flex; align-items: center; justify-content: center;
  box-shadow: var(--shadow);
  transition: transform .4s ease;
}
.contact-avatar-box:hover { transform: translateY(-5px); }
.contact-avatar-box img { width: 100%; height: 100%; object-fit: cover; }

/* Info cards */
.info-cards { display: flex; flex-direction: column; gap: .75rem; width: 100%; }
.info-card {
  display: flex; align-items: center; gap: .9rem;
  background: #fff; border: 1px solid rgba(134,166,223,.2);
  border-radius: 12px; padding: .75rem 1rem;
  box-shadow: 0 2px 12px rgba(50,78,123,.06);
  transition: transform .2s, box-shadow .2s;
}
.info-card:hover { transform: translateX(4px); box-shadow: 0 4px 18px rgba(50,78,123,.1); }
.info-icon { font-size: 1.2rem; }
.info-label { font-size: .7rem; color: var(--text-muted); font-weight: 500; margin-bottom: .1rem; }
.info-val   { font-size: .82rem; color: var(--text-dark); font-weight: 600; }

/* Form */
.form-row {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: .9rem; margin-bottom: .9rem;
}
.form-field { position: relative; }
.form-field.full { grid-column: 1 / -1; }
.form-field input,
.form-field textarea {
  width: 100%; padding: .72rem 1rem;
  border: 1.5px solid rgba(134,166,223,.4);
  border-radius: 10px; background: #fff;
  color: var(--text-dark); font-size: .88rem;
  font-family: 'DM Sans', sans-serif;
  outline: none; resize: none;
  transition: border-color .2s, box-shadow .2s;
}
.form-field input:focus,
.form-field textarea:focus {
  border-color: var(--mid);
  box-shadow: 0 0 0 3px rgba(80,104,169,.12);
}

.btn-send {
  width: 100%; padding: .85rem;
  background: linear-gradient(135deg, var(--mid), var(--deep));
  color: #fff; border: none; border-radius: 10px;
  font-size: .9rem; font-weight: 700; cursor: pointer;
  transition: opacity .2s, transform .2s, box-shadow .2s;
  font-family: 'DM Sans', sans-serif;
  margin-top: .5rem;
}
.btn-send:hover:not(:disabled) {
  opacity: .9; transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(50,78,123,.3);
}
.btn-send:disabled { opacity: .65; cursor: not-allowed; }

@keyframes spin { to { transform: rotate(360deg); } }
.sending-anim::before {
  content: ''; display: inline-block; width: 12px; height: 12px;
  border: 2px solid rgba(255,255,255,.4); border-top-color: #fff;
  border-radius: 50%; margin-right: .5rem;
  animation: spin .7s linear infinite; vertical-align: middle;
}

/* Toast */
.toast {
  margin-top: 1rem; padding: .7rem 1.2rem;
  background: #edf7f0; border: 1px solid #6fcf97;
  border-radius: 10px; color: #1a6640; font-size: .85rem; font-weight: 500;
}
.toast-enter-active, .toast-leave-active { transition: opacity .35s, transform .35s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(-6px); }

/* Reveal */
.reveal { opacity: 0; transform: translateY(32px); transition: opacity .7s ease, transform .7s ease; }
.reveal.visible { opacity: 1; transform: none; }
.reveal-delay-1 { transition-delay: .12s; }
.reveal-delay-2 { transition-delay: .24s; }

@media (max-width: 768px) {
  .contact-grid { grid-template-columns: 1fr; gap: 2rem; }
  .contact-avatar-wrap { display: none; }
  .form-row { grid-template-columns: 1fr; }
}
</style>
