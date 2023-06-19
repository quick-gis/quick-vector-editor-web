<script lang="ts" setup>
import LabelViewPolygon from '@/views/label/LabelViewPolygon.vue'
import LabelViewLine from '@/views/label/LabelViewLine.vue'
import LabelViewPoint from '@/views/label/LabelViewPoint.vue'
import eventBus from '@/utils/eventBus'
import { provide, reactive, ref } from 'vue'
import LableMu from '@/views/label/LableMu.vue'

const props = defineProps({
  modelValue: {
    type: Boolean
  },
  path: {
    type: String
  },
  uid: {
    type: String
  }
})
const emit = defineEmits(['update:modelValue'])

const cancel = () => {
  console.log('取消')
  emit('update:modelValue', false)
}
const confirm = () => {
  console.log('确定')
  okFlag.value = true
  eventBus.emit('dialog_confirm', { path: props.path, uid: props.uid })
  emit('update:modelValue', false)
}

const visible = reactive({
  dialog: false,
  dialog_width: '75%'
})
const okFlag = ref(false)
provide('ok', okFlag)
</script>

<template>
  <t-dialog
    v-model:visible="props.modelValue"
    :draggable="true"
    :width="visible.dialog_width"
    @cancel="cancel"
    @close="emit('update:modelValue', false)"
    @confirm="confirm"
  >
    <label-view-line v-if="props.path == '/style_line'"></label-view-line>
    <label-view-point v-if="props.path == '/style_point'"></label-view-point>
    <label-view-polygon v-if="props.path == '/style_polygon'"></label-view-polygon>
    <lable-mu v-if="props.path == '/style_collection'"></lable-mu>
  </t-dialog>
</template>

<style scoped></style>
