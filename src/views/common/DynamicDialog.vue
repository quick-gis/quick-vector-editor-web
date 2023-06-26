<script lang="ts" setup>
import Buffer from '@/views/anasys/Buffer.vue'
import { onMounted, provide, reactive, ref } from 'vue'
import ExportGeoJson from '@/views/exp/ExportGeoJson.vue'
import GenCsv from '@/views/gen/GenCsv.vue'
import GenMysql from '@/views/gen/GenMysql.vue'
import GenGeoJson from '@/views/gen/GenGeoJson.vue'
import TianDiTuToken from '@/views/token/TianDiTuToken.vue'
import MoveToXY from '@/views/tools/move_xy/MoveToXY.vue'
import GaoDeSubway from '@/views/dataview/GaoDeSubway.vue'
import eventBus from '@/utils/eventBus'
import LabelViewLine from '@/views/label/LabelViewLine.vue'
import LabelViewPoint from '@/views/label/LabelViewPoint.vue'
import LabelViewPolygon from '@/views/label/LabelViewPolygon.vue'
import GenConver from '@/views/gen/GenConver.vue'
import IsolationPoint from '@/views/anasys/point/IsolationPoint.vue'
import PointOverride from '@/views/anasys/point/PointOverride.vue'
import LineCoverage from '@/views/anasys/line/LineCoverage.vue'
import RingAnalysis from '@/views/anasys/line/RingAnalysis.vue'

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
onMounted(() => {
  console.log('?a')
})
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
    <label-view-line v-if="props.path == '/style_line'"></label-view-line>
    <label-view-point v-if="props.path == '/style_point'"></label-view-point>
    <label-view-polygon v-if="props.path == '/style_polygon'"></label-view-polygon>
    <gen-conver v-if="props.path == '/add_conver'"></gen-conver>

    <IsolationPoint v-if="props.path == '/isolation_point'" />
    <PointOverride v-if="props.path == '/PointOverride'" />
    <LineCoverage v-if="props.path == '/LineCoverage'" />
    <RingAnalysis v-if="props.path == '/RingAnalysis'" />
  </t-dialog>
</template>

<style scoped></style>
