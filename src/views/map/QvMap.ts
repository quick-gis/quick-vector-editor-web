import OlMap from 'ol/Map'
import View from 'ol/View'
import { Vector as VectorSource } from 'ol/source.js'
import { Vector as VectorLayer } from 'ol/layer.js'
import GeoJSON from 'ol/format/GeoJSON.js'
import { ProdLayersTypeEnum } from './ConstValue'
import { GetTianDiTuLayers } from './Tdt'
import { Layer } from 'ol/layer'
import { Feature, MapBrowserEvent } from 'ol'
import { reactive } from 'vue'
import { Modify, Select, Snap } from 'ol/interaction'
import { getCenter } from 'ol/extent'
import { DefaultSelectStyle, SelectedStyles } from '@/views/map/mapmapStyle'
// @ts-ignore
import { buffer } from '@turf/turf'
import { useMapCurStore } from '@/stores/mapCur'
import eventBus from '@/utils/eventBus'
import { Point } from 'ol/geom'
import { Circle, Stroke, Style } from 'ol/style'

function getSelectPlus(mapData: any) {
  const clickInteraction = new Select({
    multi: false,
    style: function (f) {
      // @ts-ignore
      return DefaultSelectStyle[f.getGeometry().getType()]
    }
  })

  clickInteraction.on('select', function (event) {
    let selectedFeatures = event.target.getFeatures()
    let data = null
    if (selectedFeatures.getLength() > 0) {
      data = selectedFeatures.item(0)
    } else {
      data = event.selected[0]
    }
    let format = new GeoJSON()

    if (data) {
      let geoJSON = format.writeFeature(data, {
        featureProjection: 'EPSG:4326' // 指定要素的投影坐标系
      })
      mapData.selectData = geoJSON

      eventBus.emit('attr-click', {
        geojson: JSON.parse(geoJSON)
      })

      console.log('当前点击数据GEOJSON', geoJSON)
      console.log('当前点击数据', data)
    }
  })
  return clickInteraction
}

const a = {
  default_click: (e: MapBrowserEvent<any>, mapData: any, map: any) => {
    console.log('当前点击坐标111', e.coordinate)
    mapData.coordinates = e.coordinate
    mapData.click = true
  },
  move_mouse: (e: any, mapData: any, map: any) => {
    mapData.coordinates = e.coordinate
    let view = map.getView()
    mapData.zoom = view.getZoom()
    useMapCurStore().mapCurData.x = e.coordinate[0]
    useMapCurStore().mapCurData.y = e.coordinate[1]
    useMapCurStore().mapCurData.zoom = view.getZoom()
  }
}
const geojson = new GeoJSON()

export class QvMap {
  get map(): OlMap {
    return this._map
  }
  static addLayerBaseIndex = 30000
  static bufferBaseIndex = 10000
  static DbBaseIndex = 10000
  static lineRingBaseIndex = 90000
  static lineSelfOverBaseIndex = 80000
  static pointRepeatBaseIndex = 80000
  target: string
  hh: OlMap = new OlMap()
  // @ts-ignore
  private _map: OlMap
  /**
   * 地图
   * @private
   */
  private diTu = new Map<ProdLayersTypeEnum, Layer>()
  /**
   * 文件转换图层
   * @private
   */
  private _fileLayer = new Map<String, Layer>()
  /**
   * 缓冲图层
   * @private
   */
  private _bufferLayer = new Map<String, Layer>()
  /**
   * 环分析图层
   * @private
   */
  private _LineRingLayer = new Map<String, Layer>()
  /**
   * 线自重叠分析图层
   * @private
   */
  private _LineSelfOverlapsLayer = new Map<String, Layer>()
  /**
   * 数据库图层
   * @private
   */
  private _DbLayer = new Map<String, Layer>()
  /**
   * 点重叠分析图层
   * @private
   */
  private _PointRepeatLayer = new Map<String, Layer>()
  private curLayerIndex = QvMap.addLayerBaseIndex
  private curDbLayerIndex = QvMap.DbBaseIndex
  private curBufferLayerIndex = QvMap.bufferBaseIndex
  private curLineRingLayerIndex = QvMap.lineRingBaseIndex
  private curLineSelfOverLayerIndex = QvMap.lineSelfOverBaseIndex
  private curPointRepeatLayerIndex = QvMap.pointRepeatBaseIndex
  // @ts-ignore
  private mapData = reactive({
    coordinates: null,
    click: false,
    openSelect: false,
    selectData: {},
    isSelect: false,
    isOpenCoordinatePicku: false,
    zoom: -1
  })
  private openSelect = false
  private mapClickKey: any
  private curEditorLayer: EditorCon | null = null

  constructor(target: string, obj: any) {
    this.target = target
    this.mapData = obj
  }

  openSelectO() {
    this._map.addInteraction(getSelectPlus(this.mapData))
  }
  closeSelect() {
    this._map.removeInteraction(getSelectPlus(this.mapData))
  }

  openOrCloseCoordinatePickup() {
    this.mapData.isOpenCoordinatePicku = !this.mapData.isOpenCoordinatePicku
    if (this.mapData.isOpenCoordinatePicku) {
      this.mapClickKey = this._map.on('click', ($event) => {
        a['default_click']($event, this.mapData, this._map)
      })
    } else {
      this.closeCoordinatePickup()
    }
  }

  closeCoordinatePickup() {
    this.mapData.isOpenCoordinatePicku = false
    this._map.un(this.mapClickKey.type, this.mapClickKey.listener)
  }

  //  3. 要素图层的序号应该从10000开始
  initMap() {
    this._map = new OlMap({
      target: this.target,
      controls: [],

      layers: [],

      view: new View({
        center: [119.45436769887343, 29.2080525919085],

        zoom: 8,
        projection: 'EPSG:4326'
      })
    })

    this._map.on('pointermove', ($event) => {
      a['move_mouse']($event, this.mapData, this._map)
    })

    this._map.on('moveend', function (event) {
      useMapCurStore().mapCurData.zoom = event.target.getView().getZoom()
    })
    return this._map
  }

  showOrDisplay(layer: ProdLayersTypeEnum, check: boolean) {
    let layer1 = this.diTu.get(layer)
    if (layer1) {
      layer1.setVisible(check)
    } else {
      let tileLayer = GetTianDiTuLayers(layer)
      if (tileLayer) {
        this._map.addLayer(tileLayer)
        this.diTu.set(layer, tileLayer)
      }
    }
  }

  addMap(layer: ProdLayersTypeEnum) {
    this.diTu.forEach((v, k) => {
      v.setVisible(false)
    })
    let cache = this.diTu.get(layer)
    if (cache) {
      cache.setVisible(true)
    } else {
      let tileLayer = GetTianDiTuLayers(layer)
      if (tileLayer) {
        this._map.addLayer(tileLayer)
        this.diTu.set(layer, tileLayer)
      }
    }
  }

  showOrCloseFileLayers(uid: string, checked: boolean) {
    console.log('iiiiii', uid)
    let layer1 = this._fileLayer.get(uid)
    if (layer1) {
      layer1.setVisible(checked)
    }
  }

  showOrCloseLineRingLayers(uid: string, checked: boolean) {
    console.log('iiiiii', uid)
    let layer1 = this._LineRingLayer.get(uid)
    if (layer1) {
      layer1.setVisible(checked)
    }
  }

  showOrCloseDbLayers(uid: string, checked: boolean) {
    console.log('iiiiii', uid)
    let layer1 = this._DbLayer.get(uid)
    if (layer1) {
      layer1.setVisible(checked)
    }
  }

  showOrClose_LineSelfOverlapsLayer(uid: string, checked: boolean) {
    this._LineSelfOverlapsLayer.get(uid)?.setVisible(checked)
  }

  showOrCloseBufferLayers(uid: string, checked: boolean) {
    let layer1 = this._bufferLayer.get(uid)
    if (layer1) {
      layer1.setVisible(checked)
    }
  }

  showOrClosePointRepeatLayers(uid: string, checked: boolean) {
    let layer1 = this._PointRepeatLayer.get(uid)
    if (layer1) {
      layer1.setVisible(checked)
    }
  }

  getFileLayer(uid: string) {
    return this._fileLayer.get(uid)
  }

  exportGeoJsonString(uid: string) {
    let layer = this.getFileLayer(uid)
    if (layer == null) {
      layer = this._bufferLayer.get(uid)
    }
    if (layer == null) {
      layer = this._LineRingLayer.get(uid)
    }
    if (layer == null) {
      layer = this._LineSelfOverlapsLayer.get(uid)
    }
    if (layer == null) {
      layer = this._PointRepeatLayer.get(uid)
    }
    if (layer == null) {
      layer = this._DbLayer.get(uid)
    }
    if (layer == null) {
      throw Error('没有图层')
    }
    // @ts-ignore
    return geojson.writeFeatures(layer.getSource()?.getFeatures())
  }

  getLayersByUid(uid: string) {
    let layer = this._fileLayer.get(uid)
    if (layer == null) {
      layer = this._bufferLayer.get(uid)
    }
    if (layer == null) {
      layer = this._LineRingLayer.get(uid)
    }
    if (layer == null) {
      layer = this._LineSelfOverlapsLayer.get(uid)
    }
    if (layer == null) {
      layer = this._PointRepeatLayer.get(uid)
    }
    if (layer == null) {
      layer = this._DbLayer.get(uid)
    }
    return layer
  }

  CenteredDisplay(uid: string) {
    let layer = null

    layer = this.getFileLayer(uid)
    if (layer == null) {
      layer = this._bufferLayer.get(uid)
    }

    if (layer == null) {
      layer = this._LineRingLayer.get(uid)
    }
    if (layer == null) {
      layer = this._LineSelfOverlapsLayer.get(uid)
    }
    if (layer == null) {
      layer = this._PointRepeatLayer.get(uid)
    }
    if (layer == null) {
      layer = this._DbLayer.get(uid)
    }
    if (layer == null) {
      throw Error('没有图层')
    }
    // @ts-ignore
    let layerExtent = layer.getSource().getExtent()

    let view = this._map.getView()

    view.fit(layerExtent, {
      duration: 1000 // 动画持续时间，可选
    })
    view.setCenter(getCenter(layerExtent))
  }

  GetAllfileLayer(): Map<String, Layer> {
    return this._fileLayer
  }

  GetAllbufferLayer(): Map<String, Layer> {
    return this._bufferLayer
  }

  addSqlGeojsonFile(uid: string, json: string) {
    console.log(json)
    let vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: new GeoJSON().readFeatures(JSON.parse(json))
      }),
      style: function (f) {
        // @ts-ignore
        return SelectedStyles[f.getGeometry().getType()]
      }
    })
    this.curDbLayerIndex = this.curDbLayerIndex + 1
    vectorLayer.setZIndex(this.curDbLayerIndex)
    this._DbLayer.set(uid, vectorLayer)
    this._map.addLayer(vectorLayer)
  }

  addGeojsonFile(uid: string, json: string) {
    let vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: new GeoJSON().readFeatures(JSON.parse(json))
      }),
      style: function (f) {
        // @ts-ignore
        return SelectedStyles[f.getGeometry().getType()]
      }
    })
    this.curLayerIndex = this.curLayerIndex + 1
    vectorLayer.setZIndex(this.curLayerIndex)
    this._fileLayer.set(uid, vectorLayer)
    this._map.addLayer(vectorLayer)
  }

  addGeoJsonForCsvImport(uid: string, json: object, type: string) {
    let vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: new GeoJSON().readFeatures(json)
      }),
      // @ts-ignore

      style: SelectedStyles[type]
    })
    this.curLayerIndex = this.curLayerIndex + 1
    vectorLayer.setZIndex(this.curLayerIndex)
    this._fileLayer.set(uid, vectorLayer)
    this._map.addLayer(vectorLayer)
  }

  GetGeojsonWithLayer(uid: string) {
    let layer = this.getLayersByUid(uid)
    let fet = layer?.getSource().getFeatures()
    let geoJSON = geojson.writeFeatures(fet, {
      featureProjection: 'EPSG:4326' // 指定要素的投影坐标系
    })
    return geoJSON
  }

  addLineRingLayer(uid: string, json: any) {
    let vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: geojson.readFeatures(json)
      }),
      style: SelectedStyles['line']
    })
    this.curLineRingLayerIndex = this.curLineRingLayerIndex + 1
    vectorLayer.setZIndex(this.curLineRingLayerIndex)
    this._LineRingLayer.set(uid, vectorLayer)
    this._map.addLayer(vectorLayer)
  }

  /**
   * 添加buffer层
   * @param uid 唯一标识
   * @param json GeoJson
   * @param size 尺寸
   * @param unity 单位
   */
  addBufferLayer(uid: string, json: any, size: any, unity: any) {
    let geojson = buffer(JSON.parse(json), size, { units: unity })
    console.log('uffer', geojson)
    let vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: new GeoJSON().readFeatures(geojson)
      }),
      style: SelectedStyles['polygon']
    })
    this.curBufferLayerIndex = this.curBufferLayerIndex + 1
    vectorLayer.setZIndex(this.curBufferLayerIndex)
    this._bufferLayer.set(uid, vectorLayer)
    this._map.addLayer(vectorLayer)
  }

  addLineSelfOverlapsLayer(uid: string, json: any) {
    let vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: geojson.readFeatures(json)
      }),
      style: SelectedStyles['line']
    })
    this.curLineSelfOverLayerIndex = this.curLineSelfOverLayerIndex + 1
    vectorLayer.setZIndex(this.curLineSelfOverLayerIndex)
    this._LineSelfOverlapsLayer.set(uid, vectorLayer)
    this._map.addLayer(vectorLayer)
  }

  addPointRepeatLayer(uid: string, json: any) {
    let vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: geojson.readFeatures(json)
      }),
      style: SelectedStyles['point']
    })
    this.curPointRepeatLayerIndex = this.curPointRepeatLayerIndex + 1
    vectorLayer.setZIndex(this.curPointRepeatLayerIndex)
    this._PointRepeatLayer.set(uid, vectorLayer)
    this._map.addLayer(vectorLayer)
  }

  /**
   * 移动到xy
   */
  moveToXY(x: number, y: number, zoom?: number) {
    const view = this._map.getView()
    view.setCenter([x, y])

    if (zoom) {
      view.setZoom(zoom)
    }
  }

  startEditor(uid: string) {
    if (this.curEditorLayer) {
      this._map.removeInteraction(this.curEditorLayer.modify)
      this._map.removeInteraction(this.curEditorLayer.snap)
    }

    let layersByUid = this.getLayersByUid(uid)
    if (layersByUid) {
      let source = layersByUid.getSource()
      if (source != null) {
        let modify = new Modify({
          // @ts-ignore
          source: source
        })
        let snap = new Snap({
          // @ts-ignore
          source: source
        })
        this.curEditorLayer = new EditorCon(modify, snap, layersByUid)
        this._map.addInteraction(this.curEditorLayer.modify)
        this._map.addInteraction(this.curEditorLayer.snap)
      }
    }
  }

  endEditor(uid: string) {
    if (this.curEditorLayer) {
      this._map.removeInteraction(this.curEditorLayer.modify)
      this._map.removeInteraction(this.curEditorLayer.snap)
    }
  }
  addShanLayers(x: number, y: number, expire: number) {
    let feature = new Feature({
      geometry: new Point([x, y])
    })
    let vectorSource = new VectorSource({
      features: [feature]
    })
    let vectorLayer = new VectorLayer({
      source: vectorSource,
      zIndex: 999999999999
    })

    this.map.addLayer(vectorLayer)
    let radius = 0
    this.map.on('postcompose', function () {
      radius++
      radius = radius % 50
      // 设置样式
      feature.setStyle(
        new Style({
          image: new Circle({
            radius: radius,
            stroke: new Stroke({
              color: 'red'
            })
          })
        })
      )
    })
    setTimeout(() => {
      this._map.removeLayer(vectorLayer)
    }, expire)
  }
}

class EditorCon {
  private readonly _modify: Modify
  private readonly _snap: Snap
  private readonly _layer: Layer

  constructor(modify: Modify, snap: Snap, layer: Layer) {
    this._modify = modify
    this._snap = snap
    this._layer = layer
  }

  get modify(): Modify {
    return this._modify
  }

  get snap(): Snap {
    return this._snap
  }

  get layer(): Layer {
    return this._layer
  }
}
