<script lang="ts" setup>
import { useMapCurStore } from '@/stores/mapCur'
import { onMounted, reactive, ref } from 'vue'
import { QvMap } from '@/views/map/QvMap'
import eventBus from '@/utils/eventBus'
import { findNodeByLabel } from '@/utils/NodeUtil'
import { ProdLayersTypeEnum } from '@/views/map/ConstValue'
import { Circle, Fill, Stroke, Style } from 'ol/style'
import { Point } from 'ol/geom'
import { Feature } from 'ol'
import { Vector as VectorSource } from 'ol/source.js'
import { Vector as VectorLayer } from 'ol/layer.js'
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

/**
 * 事件处理器
 */
const ebs = () => {
  eventBus.on('closeDiTuLayer', (e) => {
    console.log('closeDiTuLayer', e)
    qvMap.showOrDisplay(e, false)
  })
  eventBus.on('openDiTuLayer', (e) => {
    console.log('openDiTuLayer', e)
    qvMap.showOrDisplay(e, true)
  })
  eventBus.on('closeVectorLayer', (e) => {
    console.log('closeVectorLayer', e)
    let layersByUid = qvMap.getLayersByUid(e)
    layersByUid.setVisible(false)
  })
  eventBus.on('openVectorLayer', (e) => {
    console.log('openVectorLayer', e)
    let layersByUid = qvMap.getLayersByUid(e)
    layersByUid.setVisible(true)
  })

  eventBus.on('gen-csv', (e) => {
    console.log(e)
    qvMap.addGeoJsonForCsvImport(e.uid, e.geo, e.geo_type)
  })

  eventBus.on('gen-mysql', (e) => {
    qvMap.addSqlGeojsonFile(e.uid, e.geojsons[0])
  })
  eventBus.on('map-change-module', (e) => {
    let module = e.module
    if (module == 'view') {
      // 开启属性查看模式
      mapData.openSelect = true
    } else {
      mapData.openSelect = false
    }
    qvMap.openOrClose()
  })

  eventBus.on('positioning', (e) => {
    // 地图中心移动到 e.x e.y
    qvMap.moveToXY(e.x, e.y)
    // 地图上标记一个闪烁的点 5秒后移除
    qvMap.addShanLayers(e.x, e.y, 3000)
  })
  eventBus.on('gen-geojson', (e) => {
    qvMap.addGeojsonFile(e.uid, e.geojson)
  })
}

onMounted(() => {
  console.log('初始化地图')
  map.value = qvMap.initMap()

  ebs()
  // qvMap.showOrDisplay(ProdLayersTypeEnum.vec_c_jwd, true)
  // qvMap.showOrDisplay(ProdLayersTypeEnum.vec_jwd_label, true)
})
</script>

<template>
  <div id="map" ref="map" style="height: 100%; width: 100%"></div>
  <!--  <t-button @click="chuanbo">传播案例</t-button>-->
</template>

<style scoped></style>
