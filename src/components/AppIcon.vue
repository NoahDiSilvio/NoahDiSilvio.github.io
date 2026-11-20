<script setup lang="ts">
import { computed } from 'vue'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown'

const props = defineProps<{ name: 'right' | 'up-right' | 'download' }>()

const def = computed(() => (props.name === 'download' ? faArrowDown : faArrowRight).icon)
const width = computed(() => def.value[0])
const height = computed(() => def.value[1])
const path = computed(() => {
  const d = def.value[4]
  return Array.isArray(d) ? d.join(' ') : d
})
</script>

<template>
  <svg
    class="icon"
    :class="`icon-${name}`"
    :viewBox="name === 'download' ? `0 0 ${width} ${height + 96}` : `0 0 ${width} ${height}`"
    aria-hidden="true"
    focusable="false"
  >
    <path fill="currentColor" :d="path" />
    <rect v-if="name === 'download'" x="16" :y="height + 32" :width="width - 32" height="64" rx="32" fill="currentColor" />
  </svg>
</template>

<style scoped>
.icon {
  display: inline-block;
  width: auto;
  height: 0.9em;
  vertical-align: -0.1em;
  overflow: visible;
  flex-shrink: 0;
}

.icon-up-right {
  transform: rotate(-45deg);
}
</style>
