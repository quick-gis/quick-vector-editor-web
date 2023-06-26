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
      @onActive="onActive"
    >
      <template #label="node">
        <t-space @contextmenu="rightClick($event, node.node)">{{ node.node.label }}</t-space>
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
        expand-type="popup"
        height="550px"
        style="
          margin-right: 40px;

          border: 1px solid #999999;
          background-color: #f4f4f4;
        "
        theme="light"
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
          title="数据"
          value="3-1"
        >
          <t-menu-item value="3-1-1" @click="exportShp">导出 Shp</t-menu-item>
          <t-menu-item value="3-1-2" @click="exportGeojson">导出 GeoJson</t-menu-item>
        </t-submenu>
        <t-menu-item title="样式" value="4-1" @click="changeLabel">样式</t-menu-item>
        <t-menu-item title="居中" value="5-1" @click="moveToCenter">居中</t-menu-item>
      </t-menu>
    </t-space>
  </div>

  <Label
    v-model:model-value="visible.dialog"
    v-model:path="pathV"
    v-model:uid="visible.uid"
  ></Label>
</template>

<script setup>
import { MessagePlugin } from 'tdesign-vue-next';
import { nextTick, reactive, ref } from 'vue';
import { ProdLayersTypeEnum } from '@/views/map/ConstValue';
import { difference } from '@/utils/Utils';
import { findNodeByLabel, findNodeByValue } from '@/utils/NodeUtil';
import eventBus, {
  closeDiTuLayer,
  closeVectorLayer,
  openDiTuLayer,
  openVectorLayer
} from '@/utils/eventBus';
import { useMapCurStore } from '@/stores/mapCur';
import Label from '@/views/label/Label.vue';

const visible = reactive({
  dialog: false,
  dialog_width: '75%',
  uid: ''
});
const pathV = ref();

const curNode = ref();
const clickHandler = (data) => {
  MessagePlugin.success(`选中【${data.content}】`);
};
const contextmenuConfig = reactive({
  x: 0,
  y: 0,
  display: false
});
const rightClick = (e, node) => {
  e.preventDefault();
  if (node.data.tag) {
    contextmenuConfig.display = true;
    contextmenuConfig.y = e.clientY;
    contextmenuConfig.x = e.clientX;
    curNode.value = node.data;
  }
  if (
    node.data.tag == ProdLayersTypeEnum.vec_c_jwd ||
    node.data.tag == ProdLayersTypeEnum.vec_jwd_label ||
    node.data.tag == ProdLayersTypeEnum.vec_c_mkt ||
    node.data.tag == ProdLayersTypeEnum.vec_mkt_label ||
    node.data.tag == ProdLayersTypeEnum.img_c_jwd ||
    node.data.tag == ProdLayersTypeEnum.img_jwd_label ||
    node.data.tag == ProdLayersTypeEnum.img_c_mkt ||
    node.data.tag == ProdLayersTypeEnum.img_mkt_label ||
    node.data.tag == ProdLayersTypeEnum.gd_wx ||
    node.data.tag == ProdLayersTypeEnum.gd_lw ||
    node.data.tag == ProdLayersTypeEnum.gd_jd
  ) {
    contextmenuConfig.display = false;
  }
};

const tree = ref();
const exportGeojson = () => {
  eventBus.emit('export-geojson', { uid: curNode.value.uid });
};

const changeLabel = () => {
  visible.uid = curNode.value.uid;

  eventBus.emit('get_fields', { uid: curNode.value.uid });

  if (curNode.value.geo_type.toLowerCase() == 'point'.toLowerCase()) {
    pathV.value = '/style_point';
    visible.dialog = true;
  } else if (curNode.value.geo_type.toLowerCase() == 'line'.toLowerCase()) {
    pathV.value = '/style_line';
    visible.dialog = true;
  } else if (curNode.value.geo_type.toLowerCase() == 'polygon'.toLowerCase()) {
    pathV.value = '/style_polygon';
    visible.dialog = true;
  } else if (curNode.value.geo_type.toLowerCase() == 'collection'.toLowerCase()) {
    pathV.value = '/style_collection';
    visible.dialog = true;
  }
};

const moveToCenter = () => {
  eventBus.emit('moveToCenter', { uid: curNode.value.uid });
};
const exportShp = () => {
  eventBus.emit('export-shp', { uid: curNode.value.uid });
};

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
      value: '3',
      label: '分析',
      disabled: true,
      tag: '',
      children: [
        {
          value: '3-1',
          label: '缓冲区分析',
          disabled: true,
          tag: '',
          children: []
        },
        {
          value: '3-2',
          label: '点重复分析',
          disabled: true,
          tag: '',
          children: []
        },
        {
          value: '3-3',
          label: '线重复分析',
          disabled: true,
          tag: '',
          children: []
        },
        {
          value: '3-4',
          label: '环分析',
          disabled: true,
          tag: '',
          children: []
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
        },
        {
          value: '1-2',
          label: '高德地图',
          tag: '',
          disabled: true,
          children: [
            {
              value: '1-2-1',
              label: '卫星图',
              tag: ProdLayersTypeEnum.gd_wx
            },
            {
              value: '1-2-2',
              label: '街道图',
              tag: ProdLayersTypeEnum.gd_jd
            },
            {
              value: '1-2-3',
              label: '路网',
              tag: ProdLayersTypeEnum.gd_lw
            }
          ]
        }
      ]
    }
  ]
});

const checkable = ref(true);
const checkStrictly = ref(false);

const aboutNode = reactive({
  selectNode: []
});
const onActive = (v, c) => {};
const onClick = (context) => {};
const defaultValue = ref([]);
eventBus.on('click-body', (e) => {
  contextmenuConfig.display = false;
});

eventBus.on('line-ring-tree', (e) => {
  let findNodeByLabel1 = findNodeByLabel(data.itemsString, '环分析');
  let fn = findNodeByValue(data.itemsString, e.old).label + '-环分析';
  let node = {
    value: e.uid,
    label: fn,
    uid: e.uid,
    tag: ProdLayersTypeEnum.line_ring,
    geo_type: e.geo_type,
    checked: true
  };
  useMapCurStore().mapCurData.canEditorLayerNode.push({
    nid: e.uid,
    name: fn,
    geo_type: e.geo_type
  });

  tree.value.appendTo(findNodeByLabel1.value, node);
  tree.value.setItem(e.uid, { checked: true });
  aboutNode.selectNode.unshift(e.uid);
  findNodeByLabel1.children.unshift(node);
});
eventBus.on('line-self-overlaps-tree', (e) => {
  let findNodeByLabel1 = findNodeByLabel(data.itemsString, '线重复分析');
  let fn = findNodeByValue(data.itemsString, e.old).label + '-线重复分析';
  let node = {
    value: e.uid,
    label: fn,
    uid: e.uid,
    tag: ProdLayersTypeEnum.line_self_ov,
    geo_type: e.geo_type,
    checked: true
  };
  useMapCurStore().mapCurData.canEditorLayerNode.push({
    nid: e.uid,
    name: fn,
    geo_type: e.geo_type
  });

  tree.value.appendTo(findNodeByLabel1.value, node);
  tree.value.setItem(e.uid, { checked: true });
  aboutNode.selectNode.unshift(e.uid);
  findNodeByLabel1.children.unshift(node);
});
eventBus.on('point-repeat-tree', (e) => {
  let findNodeByLabel1 = findNodeByLabel(data.itemsString, '点重复分析');
  let fn = findNodeByValue(data.itemsString, e.old).value + '-点重复分析';
  let node = {
    value: e.uid,
    label: fn,
    uid: e.uid,
    tag: ProdLayersTypeEnum.point_repeat,
    geo_type: e.geo_type,
    checked: true
  };
  useMapCurStore().mapCurData.canEditorLayerNode.push({
    nid: e.uid,
    name: fn,
    geo_type: e.geo_type
  });

  tree.value.appendTo(findNodeByLabel1.value, node);
  tree.value.setItem(e.uid, { checked: true });
  aboutNode.selectNode.unshift(e.uid);
  findNodeByLabel1.children.unshift(node);
});
eventBus.on('gen-csv', (e) => {
  console.log(e);
  let findNodeByLabel1 = findNodeByLabel(data.itemsString, '文件图层');

  let node = {
    value: e.uid,
    label: e.fileName,
    uid: e.uid,
    tag: ProdLayersTypeEnum.file,
    geo_type: e.geo_type,
    checked: true
  };
  useMapCurStore().mapCurData.canEditorLayerNode.push({
    nid: e.uid,
    name: e.fileName,
    geo_type: e.geo_type
  });

  tree.value.appendTo(findNodeByLabel1.value, node);
  tree.value.setItem(e.uid, { checked: true });
  aboutNode.selectNode.unshift(e.uid);
  findNodeByLabel1.children.unshift(node);
});
eventBus.on('gen-buffer-menu', (e) => {
  nextTick(() => {
    // todo: 缓冲区图层
    let findNodeByLabel1 = findNodeByLabel(data.itemsString, '缓冲区分析');
    let n = findNodeByValue(data.itemsString, e.layerName);

    let node = {
      value: e.id,
      label: n.label + '-缓冲分析',
      uid: e.id,
      tag: ProdLayersTypeEnum.buffer,
      geo_type: 'polygon',
      checked: true
    };
    useMapCurStore().mapCurData.canEditorLayerNode.push({
      nid: e.id,
      name: n.label + '-缓冲分析',
      geo_type: 'polygon'
    });
    tree.value.appendTo(findNodeByLabel1.value, node);
    tree.value.setItem(e.id, { checked: true });
    aboutNode.selectNode.unshift(e.id);
    findNodeByLabel1.children.unshift(node);
  });
});
eventBus.on('gen-mysql', (e) => {
  let findNodeByLabel1 = findNodeByLabel(data.itemsString, '数据库图层');
  let node = {
    value: e.uid,
    label: e.name,
    uid: e.uid,
    tag: ProdLayersTypeEnum.sql,
    geo_type: e.geo_type
  };
  useMapCurStore().mapCurData.canEditorLayerNode.push({
    nid: e.uid,
    name: e.name,
    geo_type: e.geo_type
  });
  tree.value.appendTo(findNodeByLabel1.value, node);
  tree.value.setItem(e.uid, { checked: true });
  aboutNode.selectNode.unshift(e.uid);
  findNodeByLabel1.children.unshift(node);
});

eventBus.on('gen-geojson', (e) => {
  console.log(e);
  let findNodeByLabel1 = findNodeByLabel(data.itemsString, '文件图层');

  let node = {
    value: e.uid,
    label: e.name,
    uid: e.uid,
    tag: ProdLayersTypeEnum.file,
    geo_type: e.geo_type,
    checked: true
  };
  useMapCurStore().mapCurData.canEditorLayerNode.push({
    nid: e.uid,
    name: e.name,
    geo_type: e.geo_type
  });

  tree.value.appendTo(findNodeByLabel1.value, node);
  tree.value.setItem(e.uid, { checked: true });
  aboutNode.selectNode.unshift(e.uid);
  findNodeByLabel1.children.unshift(node);
});
const onChange = (checked, context) => {
  // 找到需要设置为关闭的节点
  let closeNode = difference(aboutNode.selectNode, checked);
  console.log('需要关闭的', closeNode);
  // 找到需要设置为显示的节点（显示节点直接等于checked变量）
  console.log('需要开启的', checked);
  for (let never of closeNode) {
    let findNodeByValue1 = findNodeByValue(data.itemsString, never);
    if (findNodeByValue1) {
      if (
        findNodeByValue1.tag == ProdLayersTypeEnum.vec_c_jwd ||
        findNodeByValue1.tag == ProdLayersTypeEnum.vec_jwd_label ||
        findNodeByValue1.tag == ProdLayersTypeEnum.vec_c_mkt ||
        findNodeByValue1.tag == ProdLayersTypeEnum.vec_mkt_label ||
        findNodeByValue1.tag == ProdLayersTypeEnum.img_c_jwd ||
        findNodeByValue1.tag == ProdLayersTypeEnum.img_jwd_label ||
        findNodeByValue1.tag == ProdLayersTypeEnum.img_c_mkt ||
        findNodeByValue1.tag == ProdLayersTypeEnum.img_mkt_label ||
        findNodeByValue1.tag == ProdLayersTypeEnum.gd_wx ||
        findNodeByValue1.tag == ProdLayersTypeEnum.gd_lw ||
        findNodeByValue1.tag == ProdLayersTypeEnum.gd_jd
      ) {
        closeDiTuLayer(findNodeByValue1.tag);
      } else {
        closeVectorLayer(findNodeByValue1.value);
      }
    }
  }

  for (let n of checked) {
    let findNodeByValue1 = findNodeByValue(data.itemsString, n);

    if (findNodeByValue1) {
      if (
        findNodeByValue1.tag == ProdLayersTypeEnum.vec_c_jwd ||
        findNodeByValue1.tag == ProdLayersTypeEnum.vec_jwd_label ||
        findNodeByValue1.tag == ProdLayersTypeEnum.vec_c_mkt ||
        findNodeByValue1.tag == ProdLayersTypeEnum.vec_mkt_label ||
        findNodeByValue1.tag == ProdLayersTypeEnum.img_c_jwd ||
        findNodeByValue1.tag == ProdLayersTypeEnum.img_jwd_label ||
        findNodeByValue1.tag == ProdLayersTypeEnum.img_c_mkt ||
        findNodeByValue1.tag == ProdLayersTypeEnum.img_mkt_label ||
        findNodeByValue1.tag == ProdLayersTypeEnum.gd_wx ||
        findNodeByValue1.tag == ProdLayersTypeEnum.gd_lw ||
        findNodeByValue1.tag == ProdLayersTypeEnum.gd_jd
      ) {
        openDiTuLayer(findNodeByValue1.tag);
      } else {
        openVectorLayer(findNodeByValue1.value);
      }
    }
  }
  aboutNode.selectNode = checked;

  console.log(context);
};
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
