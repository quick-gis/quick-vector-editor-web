<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { BgAxios } from '@/utils/axiosUtils'
import eventBus from '@/utils/eventBus'

const data = reactive({
  d: null
})
onMounted(() => {})
const sss = () => {
  eventBus.emit('subway', {
    geo: data.d
  })
}
const getData = () => {
  BgAxios()
    .post('/gaode/findLineByGid/3301')
    .then((res) => {
      data.d = res.data.data
    })
}
</script>

<template>
  <div>高德地图地铁</div>
  <div>
    <t-button @click="getData">获取数据</t-button>
    <t-button @click="sss">成图</t-button>
  </div>
  {{ data.d }}
</template>

<style scoped></style>
