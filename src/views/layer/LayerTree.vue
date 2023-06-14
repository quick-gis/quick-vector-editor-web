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
    >
      <template #label="node">
        <t-space @contextmenu="a($event, node.node)">{{ node.node.label }}</t-space>
      </template>
    </t-tree>
  </t-space>

  <div
    v-if="contextmenuConfig.display"
    id="contextmenu"
    :style="{
      top: contextmenuConfig.y + 'px',
      left: contextmenuConfig.x + 'px'
    }"
  >
    <t-space class="tdesign-demo-dropdown">
      <t-menu
        theme="light"
        expand-type="popup"
        style="
          margin-right: 40px;

          border: 1px solid #999999;
          background-color: #f4f4f4;
        "
        height="550px"
      >
        <t-submenu
          v-if="
            curNode.tag == ProdLayersTypeEnum.file ||
            curNode.tag == ProdLayersTypeEnum.sql ||
            curNode.tag == ProdLayersTypeEnum.buffer ||
            curNode.tag == ProdLayersTypeEnum.line_ring ||
            curNode.tag == ProdLayersTypeEnum.line_self_ov ||
            curNode.tag == ProdLayersTypeEnum.point_repeat
          "
          value="3-1"
          title="数据"
        >
          <t-menu-item value="3-1-1">导出 Shp </t-menu-item>
          <t-menu-item value="3-1-2">导出 GeoJson </t-menu-item>
        </t-submenu>
      </t-menu>
    </t-space>
  </div>
</template>

<script setup>
import { ChevronDownIcon } from 'tdesign-icons-vue-next'
import { MessagePlugin } from 'tdesign-vue-next'

const curNode = ref()
const clickHandler = (data) => {
  MessagePlugin.success(`选中【${data.content}】`)
}
const contextmenuConfig = reactive({
  x: 0,
  y: 0,
  display: false
})
const a = (e, node) => {
  e.preventDefault()
  if (node.data.tag) {
    contextmenuConfig.display = true
    contextmenuConfig.y = e.clientY
    contextmenuConfig.x = e.clientX
    curNode.value = node.data
  }
  if (
    node.data.tag == ProdLayersTypeEnum.vec_c_jwd ||
    node.data.tag == ProdLayersTypeEnum.vec_jwd_label ||
    node.data.tag == ProdLayersTypeEnum.vec_c_mkt ||
    node.data.tag == ProdLayersTypeEnum.vec_mkt_label ||
    node.data.tag == ProdLayersTypeEnum.img_c_jwd ||
    node.data.tag == ProdLayersTypeEnum.img_jwd_label ||
    node.data.tag == ProdLayersTypeEnum.img_c_mkt ||
    node.data.tag == ProdLayersTypeEnum.img_mkt_label
  ) {
    contextmenuConfig.display = false
  }
}
import { reactive, ref } from 'vue'
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
      tag: '',
      children: [
        {
          tag: '',
          value: '2-1',
          label: '数据库图层',
          children: [],
          disabled: true
        },
        {
          tag: '',
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
      tag: '',

      children: [
        {
          value: '1-1',
          label: '天地图',
          disabled: true,
          tag: '',

          children: [
            {
              value: '1-1-2',
              label: '天地图矢量（经纬度投影）',
              tag: '',
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
            },
            {
              value: '1-1-1',
              label: '天地图影像（经纬度投影）',
              tag: '',
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
eventBus.on('click-body', (e) => {
  contextmenuConfig.display = false
})
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

eventBus.on('gen-geojson', (e) => {
  console.log(e)
  let findNodeByLabel1 = findNodeByLabel(data.itemsString, '文件图层')

  let node = {
    value: e.uid,
    label: e.name,
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

<style scoped>
#contextmenu {
  position: fixed;
  height: auto;
  width: 120px;
  border-radius: 3px;

  padding: 10px;
  z-index: 12;

  button {
    display: block;
    margin: 0 0 5px;
  }
}
</style>
