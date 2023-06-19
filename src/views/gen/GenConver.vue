<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import eventBus, { sendDialogConfirmHandlerOk } from '@/utils/eventBus'
import { v4 as uuidv4 } from 'uuid'

const data = reactive({
  files: [],
  geojson: '',
  color: ''
})
const requestMethod = (file) => {
  return new Promise((resolve) => {
    resolve({ status: 'success', response: { url: '/' } })
  })
}
let reader = new FileReader()
const PATH = '/add_conver'

onMounted(() => {
  eventBus.on('dialog_confirm', (e) => {
    if (e.path == PATH) {
      eventBus.emit('add_conver', {
        uid: uuidv4(),
        name: '遮罩',
        geojson: data.geojson,
        geo_type: 'collection',
        color: data.color
      })
      sendDialogConfirmHandlerOk()
    }
  })
})
const first = (file) => {
  console.log(file.raw)
  data.files = [file.name]
  reader.readAsText(file.raw)
  reader.onload = () => {
    data.geojson = reader.result
  }

  return true
}
</script>

<template>
  <t-upload
    v-model="data.files"
    :abridge-name="[8, 6]"
    :before-upload="first"
    :request-method="requestMethod"
    accept=".json"
    action="./"
    placeholder="未选择文件"
    style="width: 100%"
    theme="file-input"
  />
  <t-form-item label="遮罩颜色">
    <t-color-picker v-model="data.color"></t-color-picker>
  </t-form-item>
</template>

<style scoped></style>
