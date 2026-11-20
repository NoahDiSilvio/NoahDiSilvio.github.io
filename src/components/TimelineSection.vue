<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { timeline } from '../data/timeline'

const list = ref<HTMLElement | null>(null)
const progress = ref(0)
const reached = ref(-1)

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* De lijn kleurt mee terwijl je scrollt; een stap is "bereikt"
   zodra zijn bolletje het midden van het scherm passeert. */
function update() {
  if (!list.value) return
  const mid = window.innerHeight * 0.6
  const box = list.value.getBoundingClientRect()
  progress.value = Math.min(1, Math.max(0, (mid - box.top) / box.height))

  let last = -1
  list.value.querySelectorAll<HTMLElement>('.node').forEach((node, i) => {
    if (node.getBoundingClientRect().top < mid) last = i
  })
  reached.value = last
}

let frame = 0
function onScroll() {
  if (frame) return
  frame = requestAnimationFrame(() => {
    frame = 0
    update()
  })
}

onMounted(() => {
  if (reduced) {
    progress.value = 1
    reached.value = timeline.length - 1
    return
  }
  update()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
})

onUnmounted(() => {
  cancelAnimationFrame(frame)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})
</script>

<template>
  <section id="timeline" class="section">
    <h2 class="section-label reveal from-left">Traject</h2>

    <div ref="list" class="tl">
      <span class="rail" aria-hidden="true">
        <span class="fill" :style="{ transform: `scaleY(${progress})` }"></span>
      </span>

      <ol class="items">

      <li
        v-for="(item, i) in timeline"
        :key="item.title"
        class="item"
        :class="{ right: i % 2 === 1, stage: item.type === 'Stage', reached: reached >= i }"
      >
        <span class="period reveal" :class="i % 2 === 1 ? 'from-right' : 'from-left'">{{ item.period }}</span>

        <span class="node" aria-hidden="true"></span>

        <div class="card reveal" :class="i % 2 === 1 ? 'from-left' : 'from-right'" style="--delay: 0.1s">
          <span class="small-caps type"><span class="dot"></span> {{ item.type }}</span>
          <h3>{{ item.title }}</h3>
          <p class="place small-caps">{{ item.place }}</p>
          <p class="desc">{{ item.description }}</p>
          <p v-if="item.tags" class="tags small-caps">{{ item.tags.join(' · ') }}</p>
          <a v-if="item.type === 'Stage'" href="#contact" class="btn-arrow">
            <span class="label">Laten we praten</span>
            <span class="arrow">→</span>
          </a>
        </div>
      </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.tl {
  --node: 1rem;

  position: relative;
  padding: 1rem 0;
}

/* ---------- de lijn ---------- */
.rail {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  background: var(--border);
  transform: translateX(-50%);
}

.items {
  list-style: none;
  margin: 0;
  padding: 0;
}

.fill {
  position: absolute;
  inset: 0;
  background: var(--red);
  transform-origin: top;
  transform: scaleY(0);
}

/* ---------- een stap ---------- */
.item {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 4rem minmax(0, 1fr);
  align-items: start;
  padding: 2.5rem 0;
}

.period {
  grid-column: 1;
  grid-row: 1;
  justify-self: end;
  font-family: var(--display);
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  line-height: 0.9;
  color: var(--border);
  white-space: nowrap;
  transition: color 0.5s;
}

.node {
  grid-column: 2;
  grid-row: 1;
  justify-self: center;
  position: relative;
  z-index: 1;
  width: var(--node);
  height: var(--node);
  margin-top: 0.6rem;
  border: 1px solid var(--muted);
  border-radius: 50%;
  background: var(--bg);
  transition:
    background-color 0.4s,
    border-color 0.4s,
    transform 0.4s;
}

.card {
  grid-column: 3;
  grid-row: 1;
  max-width: 28rem;
}

/* afwisselend: kaart links, jaartal rechts */
.right .period {
  grid-column: 3;
  justify-self: start;
}

.right .card {
  grid-column: 1;
  justify-self: end;
  text-align: right;
}

.right .type {
  flex-direction: row-reverse;
}

.type {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--muted);
}

.type .dot {
  background: var(--muted);
}

h3 {
  margin: 0.6rem 0 0.4rem;
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  line-height: 1;
}

.place {
  margin: 0;
  color: var(--muted);
}

.desc {
  margin: 1rem 0 0;
  font-size: 0.9rem;
  color: #cfcfcf;
}

.tags {
  margin: 0.75rem 0 0;
  color: var(--red);
}

.card .btn-arrow {
  margin-top: 1.5rem;
}

/* ---------- bereikt ---------- */
.reached .node {
  background: var(--text);
  border-color: var(--text);
}

.reached .period {
  color: var(--text);
}

/* ---------- de volgende stap: stage ---------- */
.stage .type {
  color: var(--red);
}

.stage .type .dot {
  background: var(--red);
}

.stage.reached .node {
  background: var(--red);
  border-color: var(--red);
  transform: scale(1.3);
}

.stage.reached .period {
  color: var(--red);
}

.stage .node::after {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 50%;
  border: 1px solid var(--red);
  opacity: 0;
}

.stage.reached .node::after {
  animation: ping 2s ease-out infinite;
}

@keyframes ping {
  from {
    opacity: 0.8;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(2.6);
  }
}

@media (hover: hover) {
  .item:hover h3 {
    color: var(--red);
  }
}

h3 {
  transition: color 0.2s;
}

/* ---------- gsm & tablet: lijn links ---------- */
@media (max-width: 56.25rem) {
  .rail {
    left: calc(var(--node) / 2);
  }

  .item,
  .right {
    grid-template-columns: calc(var(--node) + 1.5rem) minmax(0, 1fr);
    padding: 1.75rem 0;
  }

  .node,
  .right .node {
    grid-column: 1;
    grid-row: 1;
    justify-self: start;
    margin-top: 0.4rem;
  }

  .period,
  .right .period {
    grid-column: 2;
    grid-row: 1;
    justify-self: start;
    font-size: clamp(2.2rem, 10vw, 3rem);
  }

  .card,
  .right .card {
    grid-column: 2;
    grid-row: 2;
    justify-self: start;
    text-align: left;
    margin-top: 0.75rem;
  }

  .right .type {
    flex-direction: row;
  }
}

@media (prefers-reduced-motion: reduce) {
  .stage.reached .node::after {
    animation: none;
  }

  .node,
  .period {
    transition: none;
  }
}
</style>
