<script setup lang="ts">
import ProjectCard from './ProjectCard.vue'
import { projects } from '@/data/projects'
</script>

<template>
  <section id="projects" class="section">
    <h2 class="section-label reveal from-left">Projecten</h2>

    <div class="list">
      <ProjectCard v-for="(p, i) in projects" :key="p.title" :project="p" :index="i" />
    </div>
  </section>
</template>

<style scoped>
.list {
  display: flex;
  flex-direction: column;
  isolation: isolate;
}
</style>
