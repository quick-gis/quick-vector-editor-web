<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { QvMap } from '@/views/map/QvMap';
import eventBus from '@/utils/eventBus';
import { Fill, Stroke, Style } from 'ol/style';
import { Tile, Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource, XYZ } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import { SelectedStyles } from '@/views/map/mapmapStyle';
import { useMapCurStore } from '@/stores/mapCur';
import { saveAs } from 'file-saver';
import { BgAxios } from '@/utils/axiosUtils';
import { PointAnalysis } from '@/views/anasys/point/PointAnalysis';

import { v4 as uuidv4 } from 'uuid';
import { ProdLayersTypeEnum } from '@/views/map/ConstValue';
import { LineAnalysis } from '@/views/anasys/line/LineAnalysis';
import { GeoJsonLineCyc } from '@/views/anasys/line/GeoJsonLineCyc';
import { getCenter, getHeight, getWidth } from 'ol/extent';
import { Feature, Graticule } from 'ol';
import { KML } from 'ol/format';
import { Point } from 'ol/geom';
import { buffer } from '@turf/turf';
import { randomColor } from '@/utils/Utils';
import { DEVICE_PIXEL_RATIO } from 'ol/has';

let pointAna = new PointAnalysis();
let lineAna = new LineAnalysis();
const map = ref<any>();
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
});

let qvMap = new QvMap('map', mapData);

function exportGeojson(e) {
  let str = qvMap.GetGeojsonWithLayer(e.uid);
  let strData = new Blob([str], { type: 'text/plain;charset=utf-8' });
  saveAs(strData, 'export.json');
}

var kml = new KML();
function exportKML(e) {
  let vectorSource = qvMap.getLayersByUid(e.uid);
  let str = kml.writeFeatures(vectorSource.getFeatures());
  let strData = new Blob([str], { type: 'text/plain;charset=utf-8' });
  saveAs(strData, 'export.xml');
}

function exportShp(e) {
  let str = qvMap.GetGeojsonWithLayer(e.uid);
  BgAxios()
    .post(
      '/tools/geojson_to_shp',
      {
        json: str
      },
      {
        responseType: 'blob',
        timeout: 10000
      }
    )
    .then((res) => {
      let blob = new Blob([res.data], {});
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectUrl;
      a.download = 'export.zip';
      a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      window.URL.revokeObjectURL(blob);
    });
}

/**
 * 事件处理器
 */
const ebs = () => {
  eventBus.on('closeDiTuLayer', (e) => {
    console.log('closeDiTuLayer', e);
    qvMap.showOrDisplay(e, false);
  });
  eventBus.on('openDiTuLayer', (e) => {
    console.log('openDiTuLayer', e);
    qvMap.showOrDisplay(e, true);
  });
  eventBus.on('closeVectorLayer', (e) => {
    console.log('closeVectorLayer', e);
    let layersByUid = qvMap.getLayersByUid(e);
    if (layersByUid) {
      layersByUid.setVisible(false);
    }
  });
  eventBus.on('openVectorLayer', (e) => {
    console.log('openVectorLayer', e);
    let layersByUid = qvMap.getLayersByUid(e);
    if (layersByUid) {
      layersByUid.setVisible(true);
    }
  });

  eventBus.on('gen-csv', (e) => {
    console.log(e);
    qvMap.addGeoJsonForCsvImport(e.uid, e.geo, e.geo_type);
  });

  eventBus.on('gen-mysql', (e) => {
    qvMap.addSqlGeojsonFile(e.uid, e.geojsons[0]);
  });
  eventBus.on('export-geojson', (e) => {
    exportGeojson(e);
  });
  eventBus.on('export-kml', (e) => {
    exportKML(e);
  });
  eventBus.on('export-shp', (e) => {
    exportShp(e);
  });

  eventBus.on('map-change-module', (e) => {
    let module = e.module;
    if (module == 'view') {
      // 开启属性查看模式
      // 查看模式切换没有关闭
      qvMap.openSelectO();
    } else {
      qvMap.closeSelect();
    }

    if (module != 'editor') {
      if (useMapCurStore().mapCurData.curEditorLayerNid) {
        qvMap.endEditor(useMapCurStore().mapCurData.curEditorLayerNid);
      }
    }
  });

  eventBus.on('positioning', (e) => {
    // 地图中心移动到 e.x e.y
    qvMap.moveToXY(e.x, e.y);
    // 地图上标记一个闪烁的点 5秒后移除
    qvMap.addShanLayers(e.x, e.y, 3000);
  });
  eventBus.on('gen-geojson', (e) => {
    qvMap.addGeojsonFile(e.uid, e.geojson);
  });

  eventBus.on('stop-editor', (e) => {
    if (e.nid) {
      qvMap.endEditor(e.nid);
    }
  });
  eventBus.on('start-editor', (e) => {
    if (e.nid) {
      qvMap.startEditor(e.nid);
    }
  });

  eventBus.on('gen-buffer', (e) => {
    console.log('缓冲区', e);
    let gjson = qvMap.GetGeojsonWithLayer(e.layerName);
    qvMap.addBufferLayer(e.id, gjson, e.size, e.unity);
    eventBus.emit('gen-buffer-menu', e);
  });

  eventBus.on('change-style', (e) => {
    qvMap.changeStyle(e);
  });

  eventBus.on('get_fields', (e) => {
    let layersByUid = qvMap.getLayersByUid(e.uid);
    var attributeNames = [];
    if (layersByUid.getSource().getFeatures()) {
      layersByUid
        .getSource()
        .getFeatures()
        .forEach(function (feature) {
          var properties = feature.getProperties();
          var keys = Object.keys(properties);
          keys.forEach(function (key) {
            if (!attributeNames.includes(key)) {
              attributeNames.push(key);
            }
          });
        });
    }
    useMapCurStore().mapCurData.field = attributeNames;
  });

  eventBus.on('add_conver', (e) => {
    qvMap.addConver(e.geojson, e.color);
  });
  eventBus.on('remove_conver', (e) => {
    qvMap.removeConver();
  });

  eventBus.on('moveToCenter', (e) => {
    var ppp = qvMap.getLayersByUid(e.uid);
    var layerExtent = ppp.getSource().getExtent();

    let view = map.value.getView();
    view.fit(layerExtent, {
      duration: 1000000000 // 动画持续时间，可选
    });
    view.setCenter(getCenter(layerExtent));
  });
  eventBus.on('line-ring', (e) => {
    let geojsonstr = qvMap.exportGeoJsonString(e.layerName);
    let geoJsonLineCyc = GeoJsonLineCyc(JSON.parse(geojsonstr));
    let nodeId = uuidv4();

    qvMap?.addLineRingLayer(nodeId, geoJsonLineCyc);
    eventBus.emit('line-ring-tree', {
      old: e.layerName,
      value: nodeId,
      label: nodeId,
      uid: nodeId,
      tag: ProdLayersTypeEnum.line_ring,
      geo_type: 'line'
    });
  });

  eventBus.on('line-self-overlaps', (e) => {
    let geojsonstr = qvMap.exportGeoJsonString(e.layerName);
    let nodeId = uuidv4();
    let findSelfFullOverlaps = lineAna.findSelfOverlaps(JSON.parse(geojsonstr), e.full === 'true');

    qvMap.addLineSelfOverlapsLayer(nodeId, findSelfFullOverlaps);

    eventBus.emit('line-self-overlaps-tree', {
      old: e.layerName,
      value: nodeId,
      label: nodeId,
      uid: nodeId,
      tag: ProdLayersTypeEnum.line_self_ov,
      geo_type: 'line'
    });
  });
  eventBus.on('point-repeat', (e) => {
    let geojsonstr = qvMap.exportGeoJsonString(e.layerName);
    let res;
    if (e.field) {
      res = pointAna.filterFeaturesByAttribute(JSON.parse(geojsonstr), e.field);
    } else {
      res = pointAna.findFeaturesWithSameCoordinates(JSON.parse(geojsonstr));
    }
    let nodeId = uuidv4();
    qvMap?.addPointRepeatLayer(nodeId, { type: 'FeatureCollection', features: res });

    eventBus.emit('point-repeat-tree', {
      old: e.layerName,
      value: nodeId,
      label: nodeId,
      uid: nodeId,
      tag: ProdLayersTypeEnum.point_repeat,
      geo_type: 'point'
    });
  });

  eventBus.on('exportMap', (e) => {
    qvMap.map.once('rendercomplete', function () {
      const mapCanvas = document.createElement('canvas');
      const size = qvMap.map.getSize();
      mapCanvas.width = size[0];
      mapCanvas.height = size[1];
      const mapContext = mapCanvas.getContext('2d');
      Array.prototype.forEach.call(
        qvMap.map.getViewport().querySelectorAll('.ol-layer canvas, canvas.ol-layer'),
        function (canvas) {
          if (canvas.width > 0) {
            const opacity = canvas.parentNode.style.opacity || canvas.style.opacity;
            mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
            let matrix;
            const transform = canvas.style.transform;
            if (transform) {
              // Get the transform parameters from the style's transform matrix
              matrix = transform
                .match(/^matrix\(([^\(]*)\)$/)[1]
                .split(',')
                .map(Number);
            } else {
              matrix = [
                parseFloat(canvas.style.width) / canvas.width,
                0,
                0,
                parseFloat(canvas.style.height) / canvas.height,
                0,
                0
              ];
            }
            // Apply the transform to the export map context
            CanvasRenderingContext2D.prototype.setTransform.apply(mapContext, matrix);
            const backgroundColor = canvas.parentNode.style.backgroundColor;
            if (backgroundColor) {
              mapContext.fillStyle = backgroundColor;
              mapContext.fillRect(0, 0, canvas.width, canvas.height);
            }
            mapContext.drawImage(canvas, 0, 0);
          }
        }
      );
      mapContext.globalAlpha = 1;
      mapContext.setTransform(1, 0, 0, 1, 0, 0);
      const link = document.getElementById('image-download');
      link.href = mapCanvas.toDataURL();
      link.click();
    });
    qvMap.map.renderSync();
  });

  //todo: 功能还不正确（数据相关
  eventBus.on('subway', (e) => {
    let features = [];

    for (let d in e.geo) {
      let fet = [];
      for (let o of e.geo[d]) {
        fet.push({
          type: 'Feature',
          properties: {},
          geometry: o
        });
      }
      features.push(...fet);
    }

    let d2 = {
      type: 'FeatureCollection',
      features: features
    };

    let vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: new GeoJSON().readFeatures(JSON.parse(JSON.stringify(d2)))
      }),
      style: function (f) {
        // @ts-ignore
        return SelectedStyles[f.getGeometry().getType()];
      }
    });
    vectorLayer.setZIndex(99999);
    qvMap.map.addLayer(vectorLayer);
    console.log(JSON.stringify(d2));
  });
  eventBus.on('closeOrOpenGraticule', (e) => {
    if (!e.flag) {
      qvMap.addGraticule();
    } else {
      qvMap.removeGraticule();
    }
  });
};

onMounted(() => {
  console.log('初始化地图');
  map.value = qvMap.initMap();

  ebs();

  let d = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          coordinates: [
            [
              [120.90679143868482, 29.918143646632046],
              [120.90679143868482, 29.891314098531936],
              [120.91740301263843, 29.891314098531936],
              [120.9271302887638, 29.89208075731409],
              [120.95984930845651, 29.908945758436133],
              [120.95100633016051, 29.908945758436133],
              [120.94570054318376, 29.91737718839724],
              [120.90679143868482, 29.918143646632046]
            ]
          ],
          type: 'Polygon'
        },
        id: 0
      }
    ]
  };

  let vectorLayer = new VectorLayer({
    source: new VectorSource({
      features: new GeoJSON().readFeatures(d)
    }),
    style: function (f) {
      // @ts-ignore
      return SelectedStyles[f.getGeometry().getType()];
    },
    zIndex: 10
  });

  qvMap.map.addLayer(vectorLayer);

  const pixelRatio = DEVICE_PIXEL_RATIO;

  let geojson2 = buffer(d, 10, { units: 'kilometers' });

  let vectorLayer2 = new VectorLayer({
    source: new VectorSource({
      features: new GeoJSON().readFeatures({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              coordinates: [
                [
                  [120.92773668228097, 29.932492325018416],
                  [120.92773668228097, 29.92113586071764],
                  [120.9607435025473, 29.92113586071764],
                  [120.9607435025473, 29.932492325018416],
                  [120.92773668228097, 29.932492325018416]
                ]
              ],
              type: 'Polygon'
            }
          }
        ]
      })
    }),
    style: function (feature) {
      var extent = feature.getGeometry().getExtent();
      var center = getCenter(extent);
      var radius = Math.max(getWidth(extent), getHeight(extent)) * 0.5;
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      console.log('aaaaaa');
      var g = context.createRadialGradient(center[0], center[1], 0, center[0], center[1], radius);

      g.addColorStop(0, 'red');
      g.addColorStop(0.2, 'orange');
      g.addColorStop(0.4, 'tomato');
      g.addColorStop(0.6, 'purple');
      g.addColorStop(0.8, 'lavender');
      g.addColorStop(1, 'rgb(204 ,26,248)');
      return new Style({
        fill: new Fill({
          color: g
        })
      });
    },
    zIndex: 9
  });
  qvMap.map.addLayer(vectorLayer2);
  // let geojson3 = buffer(d, 30, { units: 'kilometers' });
  //
  // let vectorLayer3 = new VectorLayer({
  //   source: new VectorSource({
  //     features: new GeoJSON().readFeatures(geojson3)
  //   }),
  //   style: new Style({
  //     fill: new Fill({
  //       color: '#2a76c5' // 红色填充
  //     }),
  //     stroke: new Stroke({
  //       color: randomColor(), // 黑色边框
  //       width: 3.5 // 边框粗细为3
  //     })
  //   }),
  //   zIndex: 8
  // });
  // qvMap.map.addLayer(vectorLayer3);
  //
  // let geojson4 = buffer(d, 40, { units: 'kilometers' });
  // let vectorLayer4 = new VectorLayer({
  //   source: new VectorSource({
  //     features: new GeoJSON().readFeatures(geojson4)
  //   }),
  //   style: new Style({
  //     fill: new Fill({
  //       color: '#578bc0' // 红色填充
  //     }),
  //     stroke: new Stroke({
  //       width: 3.5, // 边框粗细为3
  //       lineDash: [20, 10, 40, 20]
  //     })
  //   }),
  //   zIndex: 7
  // });
  // qvMap.map.addLayer(vectorLayer4);

  // qvMap.showOrDisplay(ProdLayersTypeEnum.vec_c_jwd, true)
  // qvMap.showOrDisplay(ProdLayersTypeEnum.vec_jwd_label, true)
});
</script>

<template>
  <div id="map" ref="map" style="height: 100%; width: 100%"></div>
  <a id="image-download" download="map.png"></a>
  <!--  <t-button @click="chuanbo">传播案例</t-button>-->
</template>

<style scoped></style>
