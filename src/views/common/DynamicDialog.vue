<script lang="ts" setup>
import Buffer from '@/views/anasys/Buffer.vue'
import { provide, reactive, ref } from 'vue'
import ExportGeoJson from '@/views/exp/ExportGeoJson.vue'
import GenCsv from '@/views/gen/GenCsv.vue'
import GenMysql from '@/views/gen/GenMysql.vue'
import GenGeoJson from '@/views/gen/GenGeoJson.vue'
import TianDiTuToken from '@/views/token/TianDiTuToken.vue'
import MoveToXY from '@/views/tools/move_xy/MoveToXY.vue'
import GaoDeSubway from '@/views/dataview/GaoDeSubway.vue'
import eventBus from '@/utils/eventBus'

const visible = reactive({
  dialog: false,
  dialog_width: '75%'
})
const props = defineProps({
  modelValue: {
    type: Boolean
  },
  path: {
    type: String
  }
})
const emit = defineEmits(['update:modelValue'])

const cancel = () => {
  console.log('取消')
  emit('update:modelValue', false)
}
const confirm = () => {
  console.log('确定')
  okFlag.value = true
  eventBus.emit('dialog_confirm', { path: props.path })
  emit('update:modelValue', false)
}
const okFlag = ref(false)
provide('ok', okFlag)
</script>

<template>
  <t-dialog
    @close="emit('update:modelValue', false)"
    v-model:visible="props.modelValue"
    :draggable="true"
    :width="visible.dialog_width"
    @cancel="cancel"
    @confirm="confirm"
  >
    <Buffer v-if="props.path == '/buffer'"></Buffer>
    <export-geo-json v-if="props.path == '/expgeojson'"></export-geo-json>
    <gen-csv v-if="props.path == '/gen_csv'"></gen-csv>
    <gen-mysql v-if="props.path == '/gen_mysql'"></gen-mysql>
    <gen-geo-json v-if="props.path == '/gen_geo_json'"></gen-geo-json>
    <tian-di-tu-token v-if="props.path == '/tdt_config'"></tian-di-tu-token>
    <move-to-x-y v-if="props.path == '/move_xy'"></move-to-x-y>
    <gao-de-subway v-if="props.path == '/subway'"></gao-de-subway>
  </t-dialog>
</template>

<style scoped></style>
