<script setup lang="ts">
import { computed, ref, onUnmounted } from 'vue'
import type { Project } from '../data/projects'

const props = defineProps<{ project: Project; index: number }>()

const num = computed(() => String(props.index + 1).padStart(2, '0'))
const flipped = computed(() => props.index % 2 === 1)

/* ---------- 3D-tilt ----------
   Enkel met een muis en zonder reduced-motion. De stand wordt per frame
   als CSS-variabelen gezet, zodat Vue niet bij elke muisbeweging rendert. */
const canTilt =
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches

const tilt = ref<HTMLElement | null>(null)
const tilting = ref(false)
const MAX_X = 7 // graden voor/achterover
const MAX_Y = 9 // graden links/rechts
let frame = 0

function onTiltMove(e: PointerEvent) {
  if (!canTilt || e.pointerType !== 'mouse' || !tilt.value) return
  const el = tilt.value
  const { clientX, clientY } = e
  tilting.value = true
  if (frame) return
  frame = requestAnimationFrame(() => {
    frame = 0
    const r = el.getBoundingClientRect()
    const px = (clientX - r.left) / r.width
    const py = (clientY - r.top) / r.height
    el.style.setProperty('--ry', `${((px - 0.5) * 2 * MAX_Y).toFixed(2)}deg`)
    el.style.setProperty('--rx', `${((0.5 - py) * 2 * MAX_X).toFixed(2)}deg`)
    el.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`)
    el.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`)
  })
}

function onTiltLeave() {
  cancelAnimationFrame(frame)
  frame = 0
  tilting.value = false
  tilt.value?.style.setProperty('--rx', '0deg')
  tilt.value?.style.setProperty('--ry', '0deg')
}

onUnmounted(() => cancelAnimationFrame(frame))
</script>

<template>
  <article class="row" :class="{ flipped }">
    <div class="media reveal" :class="flipped ? 'from-right' : 'from-left'">
      <div
        ref="tilt"
        class="tilt"
        :class="{ 'is-tilting': tilting }"
        @pointermove="onTiltMove"
        @pointerleave="onTiltLeave"
      >
      <a
        v-if="project.demo"
        :href="project.demo"
        target="_blank"
        rel="noopener"
        class="thumb"
        :aria-label="`Bekijk ${project.title} (opent in een nieuw tabblad)`"
        :style="{ background: project.imageBg }"
      >
        <img
          v-if="project.image"
          :src="project.image"
          :alt="`Screenshot van ${project.title}`"
          :class="project.imageFit ?? 'cover'"
          loading="lazy"
        />
      </a>
      <div v-else class="thumb" :style="{ background: project.imageBg }">
        <img
          v-if="project.image"
          :src="project.image"
          :alt="`Afbeelding van ${project.title}`"
          :class="project.imageFit ?? 'cover'"
          loading="lazy"
        />
        <span v-else class="placeholder">{{ project.title }}</span>
      </div>
      <span v-if="project.status" class="status small-caps">{{ project.status }}</span>
      <span class="glare" aria-hidden="true"></span>
      </div>
      <span class="line" aria-hidden="true"></span>
    </div>

    <div class="info reveal" style="--delay: 0.15s">
      <span class="bignum" aria-hidden="true">{{ num }}</span>

      <p class="type small-caps"><span class="dot"></span>{{ project.type }}</p>

      <h3 class="title">{{ project.title }}</h3>

      <p class="desc">{{ project.description }}</p>

      <div v-if="project.contributions" class="contrib">
        <p class="contrib-label small-caps">Mijn bijdrage</p>
        <ul>
          <li v-for="c in project.contributions" :key="c">{{ c }}</li>
        </ul>
      </div>

      <p class="tech small-caps">{{ project.tech.join(' · ') }}</p>

      <div class="links">
        <a v-if="project.demo" :href="project.demo" target="_blank" rel="noopener" class="demo">
          {{ project.demoLabel ?? 'Live demo' }} <span>↗</span>
        </a>
        <a v-if="project.github" :href="project.github" target="_blank" rel="noopener" class="code small-caps">
          Bekijk code ↗
        </a>
        <span v-if="!project.demo && !project.github" class="soon small-caps">Binnenkort online</span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.row {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 2rem;
  align-items: center;
  padding: 3rem 0;
}

.row:first-child {
  padding-top: 0;
  border-top: 0;
}

.media {
  position: relative;
  grid-column: 1 / 8;
}

.flipped .media {
  grid-column: 6 / 13;
  grid-row: 1;
}

/* ---------- 3D-tilt ---------- */
.media {
  perspective: 1100px;
}

.tilt {
  --rx: 0deg;
  --ry: 0deg;
  --gx: 50%;
  --gy: 50%;

  position: relative;
  transform: rotateX(var(--rx)) rotateY(var(--ry));
  transform-style: preserve-3d;
  transition:
    transform 0.7s cubic-bezier(0.2, 0.65, 0.3, 1),
    box-shadow 0.7s ease;
  will-change: transform;
}

/* tijdens het bewegen volgt het vlak de muis bijna direct */
.tilt.is-tilting {
  transition:
    transform 0.12s ease-out,
    box-shadow 0.4s ease;
  box-shadow: 0 2.5rem 4rem -1.5rem rgba(0, 0, 0, 0.75);
}

.glare {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background: radial-gradient(
    circle at var(--gx) var(--gy),
    rgba(255, 255, 255, 0.16),
    transparent 55%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
}

.tilt.is-tilting .glare {
  opacity: 1;
}

.thumb {
  display: grid;
  place-items: center;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border: 1px solid var(--border);
  background: var(--bg-soft);
}

.thumb img {
  width: 100%;
  height: 100%;
  object-position: top;
  transition: transform 0.6s cubic-bezier(0.2, 0.65, 0.3, 1), filter 0.5s ease;
}

.thumb img.cover {
  object-fit: cover;
}

.thumb img.contain {
  object-fit: contain;
  object-position: center;
  padding: 12%;
}

.placeholder {
  padding: 1rem;
  font-family: var(--display);
  font-size: 3rem;
  color: var(--border);
  text-align: center;
  text-transform: uppercase;
}

.status {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  background: var(--bg);
  color: var(--text);
  font-size: 0.65rem;
  z-index: 3;
  /* zweeft iets boven de afbeelding, zodat de diepte zichtbaar is */
  transform: translateZ(40px);
}

/* rode lijn die onder de afbeelding tekent bij hover */
.line {
  position: absolute;
  left: 0;
  bottom: -0.75rem;
  width: 100%;
  height: 0.2rem;
  background: var(--red);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.6s cubic-bezier(0.7, 0, 0.3, 1);
}

.flipped .line {
  transform-origin: right;
}

/* ---------- tekst ---------- */
.info {
  position: relative;
  grid-column: 9 / 13;
}

.flipped .info {
  grid-column: 1 / 5;
  grid-row: 1;
}

.bignum {
  position: absolute;
  top: -4.5rem;
  right: 0;
  z-index: -1;
  font-family: var(--display);
  font-size: clamp(7rem, 12vw, 11rem);
  line-height: 1;
  color: transparent;
  -webkit-text-stroke: 1px var(--border);
  pointer-events: none;
  user-select: none;
}

.flipped .bignum {
  right: auto;
  left: 0;
}

.type {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  color: var(--muted);
}

.title {
  margin-top: 0.75rem;
  font-size: clamp(2.5rem, 4.5vw, 4rem);
  line-height: 0.92;
  transition: color 0.25s, transform 0.3s;
}

.desc {
  margin: 1rem 0 0;
  font-size: 0.95rem;
  color: #cfcfcf;
}

.contrib {
  margin-top: 1.25rem;
}

.contrib-label {
  margin: 0 0 0.5rem;
  color: var(--muted);
}

.contrib ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.contrib li {
  position: relative;
  padding: 0.3rem 0 0.3rem 1.1rem;
  font-size: 0.9rem;
  color: #cfcfcf;
}

.contrib li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.85rem;
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  background: var(--red);
}

.tech {
  margin: 1.25rem 0 0;
  padding-top: 1rem;
  color: var(--red);
}

.links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.25rem;
  margin-top: 1.75rem;
}

.demo {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: 999px;
  background: var(--red);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.demo span {
  transition: transform 0.2s;
}

.code {
  border-bottom: 1px solid var(--muted);
  padding-bottom: 0.15rem;
  color: var(--muted);
  transition: color 0.2s, border-color 0.2s;
}

.soon {
  color: var(--muted);
}

@media (hover: hover) {
  .thumb img {
    filter: grayscale(0.7);
  }

  .row:hover .thumb img {
    filter: none;
    transform: scale(1.03);
  }

  .row:hover .line {
    transform: scaleX(1);
  }

  .row:hover .title {
    color: var(--red);
    transform: translateX(0.4rem);
  }

  .flipped:hover .title {
    transform: translateX(0.4rem);
  }

  .demo:hover span {
    transform: translate(0.125rem, -0.125rem);
  }

  .code:hover {
    color: var(--text);
    border-color: var(--text);
  }
}

/* ---------- tablet & gsm ---------- */
@media (max-width: 56.25rem) {
  .row {
    gap: 1.75rem;
    padding: 2.5rem 0;
  }

  .media,
  .flipped .media,
  .info,
  .flipped .info {
    grid-column: 1 / -1;
    grid-row: auto;
  }

  .bignum,
  .flipped .bignum {
    top: -1.5rem;
    right: 0;
    left: auto;
    font-size: 6rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .thumb img,
  .line,
  .title {
    transition: none;
  }
}
</style>
