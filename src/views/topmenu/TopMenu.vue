<template>
  <div class="box">
    <t-head-menu expand-type="popup" theme="dark">
      <t-submenu value="1">
        <template #title>
          <span>文件</span>
        </template>
        <t-submenu title="成图" value="1-0">
          <t-menu-item value="1-1-1"> 导入 CSV</t-menu-item>
          <t-menu-item value="1-1-2"> 导入 Excel</t-menu-item>
          <t-menu-item value="1-1-3"> 导入 MySQL</t-menu-item>
        </t-submenu>
        <t-submenu title="数据" value="1-2">
          <t-menu-item value="1-2-1"> 导出 GeoJson</t-menu-item>
        </t-submenu>
      </t-submenu>
      <t-submenu value="2">
        <template #title>
          <span>配置</span>
        </template>
        <t-menu-item value="2-0" @click="openTianDiTuConfig">天地图token</t-menu-item>
      </t-submenu>
    </t-head-menu>
  </div>

  <div id="dialog">
    <t-dialog
      @confirm="confirm"
      @cancel="cancel"
      v-model:visible="visible.dialog"
      :draggable="true"
    >
      <router-view />
    </t-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from 'vue'
import router from '@/router'
import eventBus, { sendDialogCancel, sendDialogConfirm } from '@/utils/eventBus'

const visible = reactive({
  dialog: false
})
const confirm = () => {
  sendDialogConfirm()
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
const openTianDiTuConfig = () => {
  router.push({
    path: '/tdt_config'
  })
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
