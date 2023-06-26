<script setup lang="ts">
import { onMounted } from 'vue'
import eventBus, { sendDialogConfirmHandlerOk } from '@/utils/eventBus'

const PATH = '/LineCoverage'

onMounted(() => {
  eventBus.on('dialog_confirm', (e) => {
    if (e.path == PATH) {
      sendDialogConfirmHandlerOk()
    }
  })
})
</script>

<template><div>线覆盖</div></template>

<style scoped></style>
