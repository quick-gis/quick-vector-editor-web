<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import eventBus, { sendDialogConfirmHandlerOk } from '@/utils/eventBus';
import { useMapCurStore } from '@/stores/mapCur';

const PATH = '/LineCoverage';

onMounted(() => {
  eventBus.on('dialog_confirm', (e) => {
    if (e.path == PATH) {
      eventBus.emit('line-self-overlaps', data);

      sendDialogConfirmHandlerOk();
    }
  });
});
const data = reactive({
  layerName: '',
  full: 'true'
});
</script>

<template>
  <div>线覆盖</div>

  <t-form :model="data" label-width="120px">
    <t-form-item label="分析图层" prop="layerName">
      <t-select auto-width v-model="data.layerName">
        <t-option
          :key="col.nid"
          :label="col.name"
          :value="col.nid"
          v-for="(col, index) in useMapCurStore().canEditorLayerNodeLineComputed"
        >
        </t-option>
      </t-select>
    </t-form-item>
  </t-form>
</template>

<style scoped></style>
