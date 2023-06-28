<script lang="ts" setup>
import { reactive, ref } from 'vue';
import eventBus from '@/utils/eventBus';
import GeoJSON from 'ol/format/GeoJSON';
import { GML, KML, TopoJSON } from 'ol/format';
import XML from 'ol/format/XML';
import { Vector } from 'ol/source';

const feature = reactive({
  properties: {},
  geometry: {}
});

const positioning = () => {
  if (tableData.value) {
    eventBus.emit('positioning', {
      x: tableData.value[0].x,
      y: tableData.value[0].y
    });
  }
};
eventBus.on('attr-click', (e) => {
  feature.properties = e.geojson.properties;
  feature.geometry = e.geojson.geometry;
  let d = getCoordinates(feature.geometry);
  const arr = [];
  for (let i in d) {
    if (d[i][0][0]) {
      arr.push({
        id: i,
        x: d[i][0][0],
        y: d[i][1][1]
      });
    } else {
      arr.push({
        id: i,
        x: d[i][0],
        y: d[i][1]
      });
    }
  }
  tableData.value = arr;
});
const getCoordinates = (geometry) => {
  let coordinates = [];
  if (geometry.type === 'Point' || geometry.type === 'MultiPoint') {
    coordinates.push(geometry.coordinates);
  } else if (geometry.type === 'LineString' || geometry.type === 'MultiLineString') {
    coordinates.push(...geometry.coordinates);
  } else if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
    geometry.coordinates.forEach((coords) => {
      coordinates.push(...coords);
    });
  }
  return coordinates;
};
const tableData = ref();
const cols = ref([
  { colKey: 'id', title: '序号', width: 20, foot: '-' },
  {
    colKey: 'x',
    title: 'x',
    width: 30,
    foot: '-'
  },
  { colKey: 'y', title: 'y', width: 30, foot: '-' }
]);
const o = () => {
  let d = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          a: 'a'
        },
        geometry: {
          coordinates: [
            [117.0, 30.0],
            [117.0, 30.1],
            [117.1, 30.1],
            [117.0, 30.0]
          ],
          type: 'LineString'
        }
      }
    ]
  };

  var geoJSON = new GeoJSON();

  var defaultArray = geoJSON.readFeatures(d);

  var vectorSource = new Vector({
    features: defaultArray
  });
  console.log(defaultArray);
  var kml = new KML();
  console.log(kml.writeFeatures(vectorSource.getFeatures()));
};
</script>

<template>
  <div>
    <t-button @click="o">a</t-button>
  </div>
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
  <div>
    <t-button @click="positioning">定位</t-button>
  </div>
</template>

<style scoped></style>
