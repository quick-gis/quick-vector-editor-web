<script setup lang="ts">
import { nextTick, onMounted, reactive } from 'vue'
import { useMapCurStore } from '@/stores/mapCur'
import eventBus, { sendDialogConfirmHandlerOk } from '@/utils/eventBus'

const units = [
  { label: '米', value: 'meters' },
  { label: '毫米', value: 'millimeters' },
  { label: '厘米', value: 'centimeters' },
  { label: '千米', value: 'kilometers' },
  { label: '英亩', value: 'acres' },
  { label: '英里', value: 'miles' },
  { label: '海里', value: 'nauticalmiles' },
  { label: '英寸', value: 'inches' },
  { label: '码', value: 'yards' },
  { label: '英尺', value: 'feet' },
  { label: '弧度', value: 'radians' },
  { label: '度', value: 'degrees' },
  { label: '公顷', value: 'hectares' }
]
import { v4 as uuidv4 } from 'uuid'

const data = reactive({
  unity: 'meters',
  size: 1,
  layerName: '',
  id: ''
})

const PATH = '/buffer'
const ok = () => {
  console.log('缓冲区参数', data)
  eventBus.emit('gen-buffer', data)
}
eventBus.on('dialog_confirm', async (e) => {
  if (e.path == PATH) {
    // data.id = uuidv4()
    await ok()
    sendDialogConfirmHandlerOk()
  }
})
</script>

<template>
  <div>缓冲区分析</div>

  <div>{{ data }}</div>
  <t-form :model="data" label-width="120px">
    <t-form-item label="缓冲图层" prop="layerName">
      <t-select auto-width v-model="data.layerName">
        <t-option
          :key="col.nid"
          :label="col.name"
          :value="col.nid"
          v-for="(col, index) in useMapCurStore().mapCurData.canEditorLayerNode"
        >
        </t-option>
      </t-select>
    </t-form-item>
    <t-form-item label="缓冲长度" prop="size">
      <t-input-number v-model="data.size" :step="0.1" />
    </t-form-item>
    <t-form-item label="单位" prop="unity">
      <t-select v-model="data.unity" placeholder="请选择长度单位">
        <t-option
          v-for="unit in units"
          :key="unit.value"
          :label="unit.label"
          :value="unit.value"
        ></t-option>
      </t-select>
    </t-form-item>
  </t-form>
</template>

<style scoped></style>
