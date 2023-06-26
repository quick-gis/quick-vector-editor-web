<template>
  <t-tabs :default-value="1">
    <t-tab-panel :value="1" label="图形样式">
      <t-form-item label="填充颜色(color)">
        <t-color-picker v-model="polygon.FillColor"></t-color-picker>
      </t-form-item>
      <t-form-item label="边框颜色(color)">
        <t-color-picker v-model="polygon.StrokeColor"></t-color-picker>
      </t-form-item>
      <t-form-item label="边框宽度(width)">
        <t-input v-model="polygon.StrokeWidth"></t-input>
      </t-form-item>
    </t-tab-panel>
    <t-tab-panel :value="2" label="文字样式">
      <t-form-item label="文字位置">
        <t-select v-model="polygon.TextAglin" placeholder="请选择">
          <t-option v-for="item in TextAglinArray" :key="item" :label="item" :value="item">
          </t-option>
        </t-select>
      </t-form-item>
      <t-form-item label="文字基线">
        <t-select v-model="polygon.TextBaseline" placeholder="请选择">
          <t-option v-for="item in TextBaselineArray" :key="item" :label="item" :value="item">
          </t-option>
        </t-select>
      </t-form-item>
      <t-form-item label="文字旋转角度">
        <t-input v-model="polygon.TextRotation">
          <span slot="append">°</span>
        </t-input>
      </t-form-item>
      <t-form-item label="字体">
        <t-select v-model="polygon.TextFont" placeholder="请选择">
          <t-option v-for="item in pointTextFontArray" :key="item" :label="item" :value="item">
          </t-option>
        </t-select>
      </t-form-item>
      <t-form-item label="粗细">
        <t-select v-model="polygon.TextWeight" placeholder="请选择">
          <t-option v-for="item in TextWeightArray" :key="item" :label="item" :value="item">
          </t-option>
        </t-select>
      </t-form-item>
      <t-form-item label="大小">
        <t-input v-model="polygon.TextSize">
          <span slot="append">px</span>
        </t-input>
      </t-form-item>
      <t-form-item label="x偏移量">
        <t-input v-model="polygon.TextOffsetX"></t-input>
      </t-form-item>
      <t-form-item label="y偏移量">
        <t-input v-model="polygon.TextOffsetY"></t-input>
      </t-form-item>
      <t-form-item label="外框颜色">
        <t-color-picker v-model="polygon.TextColor"></t-color-picker>
      </t-form-item>
      <t-form-item label="外框宽度">
        <t-input v-model="polygon.TextOutlineColor"></t-input>
      </t-form-item>
    </t-tab-panel>
  </t-tabs>
</template>
<script lang="ts" setup>
import { reactive, ref, nextTick } from 'vue';
import eventBus, { sendDialogConfirmHandlerOk } from '@/utils/eventBus';

const PATH = '/style_polygon';
eventBus.on('dialog_confirm', (e) => {
  if (e.path == PATH) {
    console.log(point);
    console.log(e);
    nextTick(() => {
      eventBus.emit('change-style', {
        uid: e.uid,
        style: polygon,
        geo_type: 'polygon'
      });
    });
    sendDialogConfirmHandlerOk();
  }
});
const polygon = reactive({
  //图形样式
  FillColor: '#aa3300',
  StrokeColor: '#f00',
  StrokeWidth: '2',
  //文字样式
  TextAglin: 'center',
  TextBaseline: 'middle',
  TextRotation: 0,
  TextFont: 'Arial',
  TextWeight: 'normal',
  TextSize: '12',
  TextOffsetX: '0',
  TextOffsetY: '0',
  TextColor: '#0ff',
  TextOutlineColor: '3',
  fieldName: ''
});
//点
const point = reactive({
  //图形样式
  Size: 10,
  FillColor: '#aa3300',
  StrokeColor: '#f00',
  StrokeWidth: '2',
  //文字样式
  TextAglin: 'center',
  TextBaseline: 'middle',
  TextRotation: 0,
  TextFont: 'Arial',
  TextWeight: 'normal',
  TextSize: '12',
  TextOffsetX: '0',
  TextOffsetY: '0',
  TextColor: '#0ff',
  TextOutlineColor: '3'
});
//线
const line = reactive({
  //图形样式
  StrokeColor: '#f00',
  StrokeWidth: '2',
  //文字样式
  TextAglin: 'center',
  TextBaseline: 'middle',
  TextRotation: 0,
  TextFont: 'Arial',
  TextWeight: 'normal',
  TextSize: '12',
  TextOffsetX: '0',
  TextOffsetY: '0',
  TextColor: '#0ff',
  TextOutlineColor: '3'
});
const form = ref();
const TextWeightArray = ['normal', 'bold', 'bolder'];
const pointTextFontArray = ['Arial', 'Courier New', 'Verdana'];
const TextAglinArray = ['center', 'end', 'left', 'right', 'start'];
const TextBaselineArray = ['alphabetic', 'bottom', 'hanging', 'ideographic', 'middle', 'top'];

const activePoint = 'first_Point';
const activeLine = 'first_Line';
const activePolygon = 'first_Polygon';
</script>
<style scoped>
.featruesStyle_BOX {
  display: flex;
  justify-content: space-between;
  height: 800px;
}

.featruesStyle-demo {
  width: 50%;
  height: 800px;
}

.formClass {
  width: 50%;
}

.el-card__header {
  padding: 10px;
  font-size: 12px;
  font-weight: bold;
}

.el-card__body,
.el-main {
  padding: 5px;
}
</style>
<script setup></script>
