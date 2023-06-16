<script setup lang="ts">
import { useMapCurStore } from '@/stores/mapCur'
import { reactive, watch } from 'vue'
import eventBus from '@/utils/eventBus'

const data = reactive({
  module: 'ordinary',
  curLayer: ''
})
watch(
  () => {
    return data.module
  },
  (ov, nv) => {
    eventBus.emit('map-change-module', { module: data.module })
    useMapCurStore().mapCurData.module = data.module
  }
)
watch(
  () => {
    return data.curLayer
  },
  (nv, ov) => {
    eventBus.emit('stop-editor', { nid: ov })
    eventBus.emit('start-editor', { nid: nv })
    useMapCurStore().mapCurData.curEditorLayerNid = nv
  }
)
</script>

<template>
  <!--  todo：样式调整-->
  <t-space>x: <t-input disabled :value="useMapCurStore().mapCurData.x"></t-input></t-space>
  <t-space>y:<t-input disabled :value="useMapCurStore().mapCurData.y"></t-input></t-space>
  <t-space>zoom:<t-input disabled :value="useMapCurStore().mapCurData.zoom"></t-input> </t-space>
  <t-space>PROJ:<t-input disabled :value="useMapCurStore().mapCurData.proj"></t-input> </t-space>

  <t-space
    >模式:
    <t-select auto-width v-model="data.module">
      <t-option key="ordinary" label="普通" value="ordinary" />
      <t-option key="view" label="查看" value="view"></t-option>
      <t-option key="editor" label="编辑" value="editor"></t-option>
    </t-select>
  </t-space>
  <t-space v-if="data.module == 'editor'">
    图层:
    <t-select auto-width v-model="data.curLayer">
      <t-option
        :key="col.nid"
        :label="col.name"
        :value="col.nid"
        v-for="(col, index) in useMapCurStore().mapCurData.canEditorLayerNode"
      >
      </t-option>
    </t-select>
  </t-space>

  <!--  </t-space>-->
</template>

<style scoped></style>
