<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import eventBus, { sendDialogConfirmHandlerOk } from '@/utils/eventBus';
import { v4 as uuidv4 } from 'uuid';

const data = reactive({
  files: [],
  geojson: '',
  type: 'collection'
});
const requestMethod = (file) => {
  return new Promise((resolve) => {
    resolve({ status: 'success', response: { url: '/' } });
  });
};
let reader = new FileReader();
const PATH = '/gen_geo_json';

onMounted(() => {
  eventBus.on('dialog_confirm', (e) => {
    if (e.path == PATH) {
      eventBus.emit('gen-geojson', {
        uid: uuidv4(),
        name: data.files[0].name,
        geojson: data.geojson,
        geo_type: data.type
      });
      sendDialogConfirmHandlerOk();
    }
  });
});
const first = (file) => {
  console.log(file.raw);
  data.files = [file.name];
  reader.readAsText(file.raw);
  reader.onload = () => {
    data.geojson = reader.result;
  };

  return true;
};
</script>

<template>
  <t-upload
    v-model="data.files"
    :abridge-name="[8, 6]"
    :before-upload="first"
    :request-method="requestMethod"
    accept=".json"
    action="./"
    placeholder="未选择文件"
    style="width: 100%"
    theme="file-input"
  />
  <t-form-item label="成图类型">
    <t-select v-model="data.type" placeholder="请选择成图类型">
      <t-option label="点" value="point" />
      <t-option label="线" value="line" />
      <t-option label="面" value="polygon" />
      <t-option label="集合" value="collection" />
    </t-select>
  </t-form-item>
</template>

<style scoped></style>
