<script setup lang="ts">
type Categories = {
  [key: string]: any
  id: string
  category: string
}

export interface Props {
  resolution_categories?: Array<Categories>
}

const props = withDefaults(defineProps<Props>(), {})
</script>

<template>
  <div>
    <div class="grid grid-cols-3 gap-1">
      <div v-for="category in props.resolution_categories" :key="category.id">
        <button class="btn btn-outline-info hover:bg-[#3D8AF7] overflow-hidden">
          {{ category.name }}
        </button>
      </div>
    </div>
  </div>
</template>
