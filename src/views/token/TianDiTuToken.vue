<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import eventBus, { sendDialogConfirmHandlerOk } from '@/utils/eventBus'
import { useMapTokenStore } from '@/stores/mapToken'
const PATH = '/tdt_config'

onMounted(() => {
  eventBus.on('dialog_confirm', (e) => {
    if (e.path == PATH) {
      useMapTokenStore().mapTokenData.tdt = data.token
      sendDialogConfirmHandlerOk()
    }
  })
})
const data = reactive({
  token: useMapTokenStore().mapTokenData.tdt
})
</script>

<template>
  <t-form :data="data">
    <t-form-item label="令牌" name="token" initial-data="TDesign">
      <t-input v-model="data.token" placeholder="请输入天地图令牌" />
    </t-form-item>
  </t-form>
</template>

<style scoped></style>
