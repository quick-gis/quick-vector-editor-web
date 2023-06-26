<script lang="ts" setup>
import { onMounted, reactive } from 'vue';
import eventBus, { sendDialogConfirmHandlerOk } from '@/utils/eventBus';
import { useMapCurStore } from '@/stores/mapCur';

const PATH = '/RingAnalysis';
const data = reactive({
  layerName: ''
});
onMounted(() => {
  eventBus.on('dialog_confirm', (e) => {
    if (e.path == PATH) {
      eventBus.emit('line-ring', data);
      sendDialogConfirmHandlerOk();
    }
  });
});
</script>

<template>
  <div>环分析</div>
  <t-form :model="data" label-width="120px">
    <t-form-item label="分析图层" prop="layerName">
      <t-select v-model="data.layerName" auto-width>
        <t-option
          v-for="(col, index) in useMapCurStore().canEditorLayerNodeLineComputed"
          :key="col.nid"
          :label="col.name"
          :value="col.nid"
        >
        </t-option>
      </t-select>
    </t-form-item>
  </t-form>
</template>

<style scoped></style>
