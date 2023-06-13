<script setup lang="ts">
import { useMapCurStore } from '@/stores/mapCur'
import { onMounted, reactive, ref } from 'vue'
import { QvMap } from '@/views/map/QvMap'
import { ProdLayersTypeEnum } from '@/views/map/ConstValue'

const chuanbo = () => {
  console.log('传播')
  useMapCurStore().mapCurData.x = 100
  useMapCurStore().mapCurData.y = 200
  useMapCurStore().mapCurData.zoom = 200
}
const map = ref<any>()
let mapData = reactive({
  coordinates: [],
  zoom: -1,
  click: false,
  // 是否开启选择元素
  openSelect: false,
  // 选择要素的数据
  selectData: {},

  // 是否选中要素
  isSelect: false,
  // 是否开启坐标拾取
  isOpenCoordinatePicku: false
})

let qvMap = new QvMap('map', mapData)

onMounted(() => {
  console.log('初始化地图')
  map.value = qvMap.initMap()
  qvMap.showOrDisplay(ProdLayersTypeEnum.vec_c_jwd, true)
  qvMap.showOrDisplay(ProdLayersTypeEnum.vec_jwd_label, true)
})
</script>

<template>
  <div id="map" ref="map" style="height: 100%; width: 100%"></div>
  <!--  <t-button @click="chuanbo">传播案例</t-button>-->
</template>

<style scoped></style>
