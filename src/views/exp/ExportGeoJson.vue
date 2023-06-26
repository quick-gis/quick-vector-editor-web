<script setup lang="ts">
import { useMapCurStore } from '@/stores/mapCur';
import { onMounted, reactive, watch } from 'vue';
import eventBus, { sendDialogConfirmHandlerOk } from '@/utils/eventBus';
import { useMapTokenStore } from '@/stores/mapToken';
const data = reactive({
  curLayer: null
});
const PATH = '/expgeojson';
import { saveAs } from 'file-saver';

onMounted(() => {
  eventBus.on('dialog_confirm', (e) => {
    if (e.path == PATH) {
      if (data.curLayer) {
        eventBus.emit('export-geojson', { uid: data.curLayer });
      }
    }
  });
});

const downloadTxt = () => {
  let str = data.curLayer;
  let strData = new Blob([str], { type: 'text/plain;charset=utf-8' });
  saveAs(strData, '测试文件下载.txt');
};
</script>

<template>
  <div>{{ data }}</div>
  <t-form :data="data" :label-width="60">
    <t-form-item label="图层" title="图层">
      <t-select auto-width v-model="data.curLayer">
        <t-option
          :key="col.nid"
          :label="col.name"
          :value="col.nid"
          v-for="(col, index) in useMapCurStore().mapCurData.canEditorLayerNode"
        >
        </t-option>
      </t-select>
    </t-form-item>
  </t-form>
</template>

<style scoped></style>
