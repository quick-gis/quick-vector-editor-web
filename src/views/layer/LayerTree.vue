<template>
  <t-space direction="vertical">
    <t-tree
      ref="tree"
      :check-strictly="checkStrictly"
      :checkable="checkable"
      :data="data.itemsString"
      :defaultValue="defaultValue"
      expand-all
      hover
      value-mode="onlyLeaf"
      @change="onChange"
      @click="onClick"
    />
  </t-space>
  <t-button @click="a">a</t-button>
</template>

<script setup>
const a = () => {
  console.log(tree.value.getItems())
}
import { nextTick, reactive, ref } from 'vue'
import { ProdLayersTypeEnum } from '@/views/map/ConstValue'
import { difference } from '@/utils/Utils'
import { findNodeByLabel, findNodeByValue } from '@/utils/NodeUtil'
import eventBus, {
  closeDiTuLayer,
  closeVectorLayer,
  openDiTuLayer,
  openVectorLayer
} from '@/utils/eventBus'

const tree = ref()
const data = reactive({
  itemsString: [
    {
      value: '2',
      label: '展示图层',
      disabled: true,

      children: [
        {
          value: '2-1',
          label: '数据库图层',
          children: [],
          disabled: true
        },
        {
          value: '2-2',
          label: '文件图层',
          children: [],
          disabled: true
        }
      ]
    },
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
const defaultValue = ref([])

eventBus.on('gen-csv', (e) => {
  console.log(e)
  let findNodeByLabel1 = findNodeByLabel(data.itemsString, '文件图层')

  let node = {
    value: e.uid,
    label: e.fileName,
    uid: e.uid,
    tag: ProdLayersTypeEnum.file,
    geo_type: e.geo_type,
    checked: true
  }
  tree.value.appendTo(findNodeByLabel1.value, node)
  tree.value.setItem(e.uid, { checked: true })
  aboutNode.selectNode.unshift(e.uid)
  findNodeByLabel1.children.unshift(node)
})

eventBus.on('gen-mysql', (e) => {
  let findNodeByLabel1 = findNodeByLabel(data.itemsString, '数据库图层')
  let node = {
    value: e.uid,
    label: e.name,
    uid: e.uid,
    tag: ProdLayersTypeEnum.sql,
    geo_type: e.geo_type,
    checked: true
  }
  tree.value.appendTo(findNodeByLabel1.value, node)
  tree.value.setItem(e.uid, { checked: true })
  aboutNode.selectNode.unshift(e.uid)
  findNodeByLabel1.children.unshift(node)
})
const onChange = (checked, context) => {
  // 找到需要设置为关闭的节点
  let closeNode = difference(aboutNode.selectNode, checked)
  console.log('需要关闭的', closeNode)
  // 找到需要设置为显示的节点（显示节点直接等于checked变量）
  console.log('需要开启的', checked)
  for (let never of closeNode) {
    let findNodeByValue1 = findNodeByValue(data.itemsString, never)
    if (findNodeByValue1) {
      if (
        findNodeByValue1.tag == ProdLayersTypeEnum.vec_c_jwd ||
        findNodeByValue1.tag == ProdLayersTypeEnum.vec_jwd_label ||
        findNodeByValue1.tag == ProdLayersTypeEnum.vec_c_mkt ||
        findNodeByValue1.tag == ProdLayersTypeEnum.vec_mkt_label ||
        findNodeByValue1.tag == ProdLayersTypeEnum.img_c_jwd ||
        findNodeByValue1.tag == ProdLayersTypeEnum.img_jwd_label ||
        findNodeByValue1.tag == ProdLayersTypeEnum.img_c_mkt ||
        findNodeByValue1.tag == ProdLayersTypeEnum.img_mkt_label
      ) {
        closeDiTuLayer(findNodeByValue1.tag)
      } else {
        closeVectorLayer(findNodeByValue1.value)
      }
    }
  }

  for (let n of checked) {
    let findNodeByValue1 = findNodeByValue(data.itemsString, n)

    if (findNodeByValue1) {
      if (
        findNodeByValue1.tag == ProdLayersTypeEnum.vec_c_jwd ||
        findNodeByValue1.tag == ProdLayersTypeEnum.vec_jwd_label ||
        findNodeByValue1.tag == ProdLayersTypeEnum.vec_c_mkt ||
        findNodeByValue1.tag == ProdLayersTypeEnum.vec_mkt_label ||
        findNodeByValue1.tag == ProdLayersTypeEnum.img_c_jwd ||
        findNodeByValue1.tag == ProdLayersTypeEnum.img_jwd_label ||
        findNodeByValue1.tag == ProdLayersTypeEnum.img_c_mkt ||
        findNodeByValue1.tag == ProdLayersTypeEnum.img_mkt_label
      ) {
        openDiTuLayer(findNodeByValue1.tag)
      } else {
        openVectorLayer(findNodeByValue1.value)
      }
    }
  }
  aboutNode.selectNode = checked

  console.log(context)
}
</script>
