<template>
  <div class="box">
    <t-head-menu expand-type="popup" theme="dark">
      <t-submenu value="1">
        <template #title>
          <span>文件</span>
        </template>
        <t-submenu title="成图" value="1-0">
          <t-menu-item value="1-1-1" @click="openTianDiTuConfig('/gen_csv')"> 导入 CSV</t-menu-item>
          <!--          <t-menu-item value="1-1-2"> 导入 Excel</t-menu-item>-->
          <t-menu-item value="1-1-3" @click="openTianDiTuConfig('/gen_geo_json')">
            导入 GeoJson
          </t-menu-item>
          <t-menu-item value="1-1-4" @click="openTianDiTuConfig('/gen_mysql')">
            导入 MySQL
          </t-menu-item>
        </t-submenu>
        <t-submenu title="数据" value="1-2">
          <t-menu-item value="1-2-1" @click="openTianDiTuConfig('/expgeojson')">
            导出 GeoJson</t-menu-item
          >
        </t-submenu>
      </t-submenu>
      <t-submenu value="2">
        <template #title>
          <span>配置</span>
        </template>
        <t-menu-item value="2-0" @click="openTianDiTuConfig('/tdt_config')"
          >天地图token
        </t-menu-item>
      </t-submenu>
      <t-submenu value="3">
        <template #title>
          <span>工具</span>
        </template>
        <t-menu-item value="3-0" @click="openTianDiTuConfig('/move_xy')">移动到XY</t-menu-item>
      </t-submenu>
      <t-submenu value="4">
        <template #title>
          <span>外部数据获取</span>
        </template>
        <t-menu-item value="4-0" @click="openTianDiTuConfig('/subway')"
          >查看高德地图地铁</t-menu-item
        >
      </t-submenu>
      <t-submenu value="5">
        <template #title>
          <span>分析</span>
        </template>
        <t-menu-item value="5-0" @click="openTianDiTuConfig('/buffer')">缓冲区分析</t-menu-item>
      </t-submenu>
    </t-head-menu>
  </div>

  <dynamic-dialog v-model:path="pathV" v-model:model-value="visible.dialog"></dynamic-dialog>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, onMounted, provide, reactive, ref } from 'vue'
import router from '@/router'
import eventBus, { sendDialogCancel, sendDialogConfirm } from '@/utils/eventBus'
import DynamicDialog from '@/views/common/DynamicDialog.vue'

const cnm = () => {}
const visible = reactive({
  dialog: false,
  dialog_width: '75%'
})
const pathV = ref()
const confirm = () => {
  sendDialogConfirm(pathV.value)
}
onMounted(() => {
  eventBus.on('dialog_confirm_handler_ok', () => {
    visible.dialog = false
  })
})
const cancel = () => {
  sendDialogCancel()
  visible.dialog = false
}
const openTianDiTuConfig = (path) => {
  router.push({
    path: path
  })
  pathV.value = path
  visible.dialog = true
}
</script>
<style lang="less" scoped>
.t-menu__operations {
  .t-button {
    margin-left: 8px;
  }
}

.t-demo-menu--dark {
  .t-button {
    color: #fff;

    &:hover {
      background-color: #4b4b4b;
      border-color: transparent;
      --ripple-color: #383838;
    }
  }
}
</style>
