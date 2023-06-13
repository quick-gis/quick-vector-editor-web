import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'

export const useMapCurStore = defineStore('map_cur', () => {
  const mapCurData = reactive({
    x: -1,
    y: -1,
    zoom: -1
  })

  return { mapCurData }
})
