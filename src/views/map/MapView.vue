<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { QvMap } from '@/views/map/QvMap'
import eventBus from '@/utils/eventBus'
import { Style } from 'ol/style'
import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import GeoJSON from 'ol/format/GeoJSON'
import { SelectedStyles } from '@/views/map/mapmapStyle'

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

  eventBus.on('subway', (e) => {
    let features = []

    for (let d in e.geo) {
      let fet = []
      for (let o of e.geo[d]) {
        fet.push({
          type: 'Feature',
          properties: {},
          geometry: o
        })
      }
      features.push(...fet)
    }

    let d2 = {
      type: 'FeatureCollection',
      features: features
    }

    let vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: new GeoJSON().readFeatures(JSON.parse(JSON.stringify(d2)))
      }),
      style: function (f) {
        // @ts-ignore
        return SelectedStyles[f.getGeometry().getType()]
      }
    })
    vectorLayer.setZIndex(99999)
    qvMap.map.addLayer(vectorLayer)
    console.log(JSON.stringify(d2))
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
