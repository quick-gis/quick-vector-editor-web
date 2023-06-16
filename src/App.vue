<script setup lang="ts">
import TopMenu from '@/views/topmenu/TopMenu.vue'
import FooterMap from '@/views/footer/FooterMap.vue'
import MapView from '@/views/map/MapView.vue'
import LayerTree from '@/views/layer/LayerTree.vue'
import AttrWin from '@/views/attr/AttrWin.vue'
import eventBus from '@/utils/eventBus'
import { useMapCurStore } from '@/stores/mapCur'

document.body.addEventListener('click', (e) => {
  eventBus.emit('click-body')
})
</script>

<template>
  <div>
    <t-layout style="height: 100vh">
      <t-header>
        <TopMenu />
      </t-header>
      <t-layout style="height: 100%">
        <t-aside style="width: 240px; overflow: auto">
          <LayerTree></LayerTree>
        </t-aside>
        <t-content>
          <t-layout style="height: 100%">
            <t-content style="height: 100%">
              <MapView></MapView>
            </t-content>
            <t-footer height="5px">
              <footer-map></footer-map>
            </t-footer>
          </t-layout>
        </t-content>
        <!--        todo: 右侧属性查看界面处理-->
        <t-aside style="width: 240px; overflow: auto">
          <attr-win />
        </t-aside>
      </t-layout>
    </t-layout>
  </div>
</template>

<style scoped></style>
