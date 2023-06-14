<script setup lang="ts">
import { useMapCurStore } from '@/stores/mapCur'
import { reactive, watch } from 'vue'
import eventBus from '@/utils/eventBus'

const data = reactive({
  module: 'ordinary'
})
watch(
  () => {
    return data.module
  },
  (ov, nv) => {
    eventBus.emit('map-change-module', { module: nv })
    useMapCurStore().mapCurData.module = data.module
  }
)
</script>

<template>
  <!--  <t-space :size="size">-->
  <t-space>x: <t-input disabled :value="useMapCurStore().mapCurData.x"></t-input></t-space>
  <t-space>y:<t-input disabled :value="useMapCurStore().mapCurData.y"></t-input></t-space>
  <t-space>zoom:<t-input disabled :value="useMapCurStore().mapCurData.zoom"></t-input> </t-space>
  <t-space>PROJ:<t-input disabled :value="useMapCurStore().mapCurData.proj"></t-input> </t-space>

  <t-space
    >模式:
    <t-select auto-width v-model="data.module">
      <t-option key="apple" label="普通" value="ordinary" />
      <t-option key="orange" label="查看" value="view"></t-option>
    </t-select>
  </t-space>

  <!--  </t-space>-->
</template>

<style scoped></style>
