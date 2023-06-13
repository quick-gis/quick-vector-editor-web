<template>
  <t-space direction="vertical">
    <t-tree
      :data="items"
      hover
      expand-all
      :keys="keys"
      :checkable="checkable"
      :check-strictly="checkStrictly"
      value-mode="onlyLeaf"
      @change="onChange"
      @click="onClick"
    />
  </t-space>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ProdLayersTypeEnum } from '@/views/map/ConstValue'
import { MessagePlugin } from 'tdesign-vue-next'

const itemsString = [
  {
    id: '1',
    label: '底图',
    disabled: true,

    children: [
      {
        id: '1-1',
        label: '天地图',
        disabled: true,

        children: [
          {
            id: '1-1-1',
            label: '天地图影像（经纬度投影）',

            children: [
              {
                id: '1-1-1-1',
                label: '影像底图',
                tag: ProdLayersTypeEnum.img_c_jwd
              },
              {
                id: '1-1-1-2',
                label: '影像标注',
                tag: ProdLayersTypeEnum.img_jwd_label
              }
            ]
          },
          {
            id: '1-1-2',
            label: '天地图矢量（经纬度投影）',
            children: [
              {
                id: '1-1-2-1',
                label: '矢量底图',
                tag: ProdLayersTypeEnum.vec_c_jwd
              },
              {
                id: '1-1-2-2',
                label: '矢量标注',
                tag: ProdLayersTypeEnum.vec_jwd_label
              }
            ]
          }
        ]
      }
    ]
  }
]

const keys = ref({})
const checkable = ref(true)
const checkStrictly = ref(false)
const items = ref(itemsString)

const onClick = (context) => {
  console.info('onClick:', context)
}
const onChange = (checked, context) => {
  console.info('onChange:', checked, context)
}
</script>
