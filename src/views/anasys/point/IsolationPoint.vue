<script setup lang="ts">
import { useMapCurStore } from '@/stores/mapCur';
import { onMounted, reactive, watch } from 'vue';
import eventBus, { sendDialogConfirmHandlerOk } from '@/utils/eventBus';
const data = reactive({
  layerName: '',
  radio1: '1',
  field: ''
});
const PATH = '/isolation_point';

watch(
  () => {
    return data.layerName;
  },
  (ov, nv) => {
    eventBus.emit('get_fields', { uid: data.layerName });
  }
);
onMounted(() => {
  eventBus.on('dialog_confirm', (e) => {
    if (e.path == PATH) {
      eventBus.emit('point-repeat', data);
      sendDialogConfirmHandlerOk();
    }
  });
});
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
        </t-option>
      </t-select>
    </t-form-item>

    <t-form-item label="检查模式" prop="module">
      <t-radio-group v-model="data.radio1" class="ml-4">
        <t-radio value="1" size="large">字段检查</t-radio>
        <t-radio value="2" size="large">坐标检查</t-radio>
      </t-radio-group>
    </t-form-item>
    <t-form-item v-if="data.radio1 == 1" label="检查字段" prop="fields">
      <t-select v-model="data.field">
        <t-option
          v-for="item in useMapCurStore().mapCurData.field"
          :key="item"
          :label="item"
          :value="item"
        >
        </t-option>
      </t-select>
    </t-form-item>
  </t-form>
</template>

<style scoped></style>
