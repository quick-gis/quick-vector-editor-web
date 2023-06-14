<script lang="ts" setup>
import { reactive, ref } from 'vue'
import eventBus from '@/utils/eventBus'

const feature = reactive({
  properties: {},
  geometry: {}
})
eventBus.on('attr-click', (e) => {
  feature.properties = e.geojson.properties
  feature.geometry = e.geojson.geometry
  let d = getCoordinates(feature.geometry)
  const arr = []
  debugger
  for (let i in d) {
    arr.push({
      id: i + 1,
      x: d[i][0][0],
      y: d[i][1][1]
    })
  }
  tableData.value = arr
})
const getCoordinates = (geometry) => {
  let coordinates = []
  if (geometry.type === 'Point' || geometry.type === 'MultiPoint') {
    coordinates.push(geometry.coordinates)
  } else if (geometry.type === 'LineString' || geometry.type === 'MultiLineString') {
    coordinates.push(...geometry.coordinates)
  } else if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
    geometry.coordinates.forEach((coords) => {
      coordinates.push(...coords)
    })
  }
  return coordinates
}
const tableData = ref()
const cols = ref([
  { colKey: 'id', title: '序号', width: 20, foot: '-' },
  {
    colKey: 'x',
    title: 'x',
    width: 30,
    foot: '-'
  },
  { colKey: 'y', title: 'y', width: 30, foot: '-' }
])
</script>

<template>
  <div>逻辑属性</div>
  <t-form :model="feature" label-position="right" label-width="100px" style="max-width: 460px">
    <t-form-item v-for="(col, index) in feature.properties" :label="index">
      <t-input v-model="feature.properties[index]" disabled />
    </t-form-item>
  </t-form>
  <div></div>
  <div>空间属性</div>
  <t-form :model="feature" label-position="right" label-width="100px" style="max-width: 460px">
    <t-table :columns="cols" :data="tableData" style="width: 100%"></t-table>
  </t-form>
</template>

<style scoped></style>
