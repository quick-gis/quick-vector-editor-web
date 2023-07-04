<script setup lang="ts">
import { onMounted } from 'vue';
import eventBus, { sendDialogConfirmHandlerOk } from '@/utils/eventBus';

const PATH = '/PointOverride';

onMounted(() => {
  eventBus.on('dialog_confirm', (e) => {
    if (e.path == PATH) {
      sendDialogConfirmHandlerOk();
    }
  });
});
</script>

<template>
  <div>点覆盖分析</div>
</template>

<style scoped></style>
