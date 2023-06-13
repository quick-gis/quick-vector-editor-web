<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useMapCurStore } from '@/stores/mapCur'

const size = ref(8)
const data = reactive({
  x: 0,
  y: 0,
  zoom: 0
})
</script>

<template>
  <t-space :size="size">
    <t-space
      >x:<t-space size="medium"> {{ useMapCurStore().mapCurData.x }}</t-space></t-space
    >
    <t-space
      >y:<t-space size="medium"> {{ useMapCurStore().mapCurData.y }}</t-space></t-space
    >
    <t-space
      >zoom:<t-space size="medium"> {{ useMapCurStore().mapCurData.zoom }}</t-space>
    </t-space>
  </t-space>
</template>

<style scoped></style>
