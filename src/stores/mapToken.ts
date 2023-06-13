import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'

export const useMapTokenStore = defineStore('mapToken', () => {
  const mapTokenData = reactive({
    tdt: 'af329b7c71730694d8ffadce86e45236'
  })

  return { mapTokenData }
})
