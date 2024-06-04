<script setup lang="ts">
import type { CategoryResolutionInterface } from '@/stores/user'

export interface Props {
  resolution_categories?: Array<CategoryResolutionInterface>
}

const props = withDefaults(defineProps<Props>(), {})
</script>

<template>
  <div>
    <div class="grid grid-cols-3 gap-1">
      <div v-for="category in props.resolution_categories" :key="category._id">
        <button class="btn btn-outline-info hover:bg-[#3D8AF7] overflow-hidden">
          {{ category.name }}
        </button>
      </div>
    </div>
  </div>
</template>
