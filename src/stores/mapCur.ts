import { computed, reactive } from 'vue';
import { defineStore } from 'pinia';

export const useMapCurStore = defineStore('map_cur', () => {
  const mapCurData = reactive({
    x: -1,
    y: -1,
    zoom: -1,
    proj: 'EPSG:4326',
    module: 'ordinary',
    canEditorLayerNode: [],
    curEditorLayerNid: '',
    exportLayer: '',
    field: []
  });

  const canEditorLayerNodeComputed = computed(() => {
    return mapCurData.canEditorLayerNode.filter(
      (col) => col.geo_type && col.geo_type?.toLowerCase() == 'point'.toLowerCase()
    );
  });
  const canEditorLayerNodeLineComputed = computed(() => {
    return mapCurData.canEditorLayerNode.filter(
      (col) => col.geo_type && col.geo_type?.toLowerCase() == 'line'.toLowerCase()
    );
  });
  return { mapCurData, canEditorLayerNodeComputed, canEditorLayerNodeLineComputed };
});
