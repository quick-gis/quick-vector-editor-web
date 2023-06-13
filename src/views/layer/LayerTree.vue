<template>
  <t-space direction="vertical">
    <t-tree
      :data="data.itemsString"
      hover
      expand-all
      :checkable="checkable"
      :check-strictly="checkStrictly"
      value-mode="onlyLeaf"
      @change="onChange"
      @click="onClick"
    />
  </t-space>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { ProdLayersTypeEnum } from '@/views/map/ConstValue'
import { MessagePlugin } from 'tdesign-vue-next'
import { difference } from '@/utils/Utils'
import { findNodeByValue } from '@/utils/NodeUtil'
import eventBus, {
  closeDiTuLayer,
  closeVectorLayer,
  openDiTuLayer,
  openVectorLayer
} from '@/utils/eventBus'

const data = reactive({
  itemsString: [
    {
      value: '1',
      label: '底图',
      disabled: true,

      children: [
        {
          value: '1-1',
          label: '天地图',
          disabled: true,

          children: [
            {
              value: '1-1-1',
              label: '天地图影像（经纬度投影）',

              children: [
                {
                  value: '1-1-1-1',
                  label: '影像底图',
                  tag: ProdLayersTypeEnum.img_c_jwd
                },
                {
                  value: '1-1-1-2',
                  label: '影像标注',
                  tag: ProdLayersTypeEnum.img_jwd_label
                }
              ]
            },
            {
              value: '1-1-2',
              label: '天地图矢量（经纬度投影）',
              children: [
                {
                  value: '1-1-2-1',
                  label: '矢量底图',
                  tag: ProdLayersTypeEnum.vec_c_jwd
                },
                {
                  value: '1-1-2-2',
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
})

const checkable = ref(true)
const checkStrictly = ref(false)

const aboutNode = reactive({
  selectNode: []
})

const onClick = (context) => {
  console.info('onClick:', context)
}
const onChange = (checked, context) => {
  // 找到需要设置为关闭的节点
  let closeNode = difference(aboutNode.selectNode, checked)
  console.log('需要关闭的', closeNode)
  // 找到需要设置为显示的节点（显示节点直接等于checked变量）
  console.log('需要开启的', checked)
  for (let never of closeNode) {
    let findNodeByValue1 = findNodeByValue(data.itemsString, never)
    if (findNodeByValue1.tag) {
      closeDiTuLayer(findNodeByValue1.tag)
    } else {
      closeVectorLayer(findNodeByValue1.value)
    }
  }

  for (let n of checked) {
    let findNodeByValue1 = findNodeByValue(data.itemsString, n)

    if (findNodeByValue1.tag) {
      openDiTuLayer(findNodeByValue1.tag)
    } else {
      openVectorLayer(findNodeByValue1.value)
    }
  }
  aboutNode.selectNode = checked

  console.log(context)
}
</script>
