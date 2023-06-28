<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import eventBus, { sendDialogConfirmHandlerOk } from '@/utils/eventBus';
import { GML, KML, TopoJSON } from 'ol/format';
import XML from 'ol/format/XML';
import GeoJSON from 'ol/format/GeoJSON.js';
const PATH = '/move_xy';

const data = reactive({
  x: 120,
  y: 30
});

onMounted(() => {
  eventBus.on('dialog_confirm', (e) => {
    if (e.path == PATH) {
      eventBus.emit('positioning', {
        x: data.x,
        y: data.y
      });

      sendDialogConfirmHandlerOk();
    }
  });
});
</script>

<template>
  <div>
    <t-form :data="data">
      <t-form-item label="X" name="X">
        <t-input v-model="data.x" type="number" placeholder="请输入内容" />
      </t-form-item>
      <t-form-item label="Y" name="Y">
        <t-input v-model="data.y" type="number" placeholder="请输入内容" />
      </t-form-item>
    </t-form>
  </div>
</template>

<style scoped></style>
