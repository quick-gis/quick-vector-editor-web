<script setup lang="ts">
import { useMapCurStore } from '@/stores/mapCur'
import { onMounted, reactive } from 'vue'
import eventBus, { sendDialogConfirmHandlerOk } from '@/utils/eventBus'
const data = reactive({
  layerName: ''
})
const PATH = '/isolation_point'

onMounted(() => {
  eventBus.on('dialog_confirm', (e) => {
    if (e.path == PATH) {
      sendDialogConfirmHandlerOk()
    }
  })
})
</script>

<template>
  <div>孤立点分析</div>
  <!--  1. 选择图层-->

  <t-form :model="data" label-width="120px">
    <t-form-item label="分析图层" prop="layerName">
      <t-select auto-width v-model="data.layerName">
        <t-option
          :key="col.nid"
          :label="col.name"
          :value="col.nid"
          v-for="(col, index) in useMapCurStore().canEditorLayerNodeComputed"
        >
          {{ col }}
        </t-option>
      </t-select>
    </t-form-item>
  </t-form>
</template>

<style scoped></style>
