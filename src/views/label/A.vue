<template>
  <div class="featruesStyle_BOX">
    <div id="featruesStyle" class="featruesStyle-demo"></div>
    <t-form ref="form" :model="form" label-width="120px" class="formClass">
      <t-row :gutter="10">
        <t-col :span="8">
          <t-card>
            <div
              slot="header"
              style="display: flex; justify-content: space-between; line-height: 28px"
            >
              <span>点要素样式</span>
              <t-button type="text" @click="PonitUp">更新</t-button>
            </div>
            <t-tabs v-model="activePoint">
              <t-tab-pane label="图形样式" name="first_Point">
                <t-form-item label="点大小(radius)">
                  <t-input v-model="point.Size"></t-input>
                </t-form-item>
                <t-form-item label="填充颜色(color)">
                  <t-color-picker v-model="point.FillColor"></t-color-picker>
                </t-form-item>
                <t-form-item label="边框颜色(color)">
                  <t-color-picker v-model="point.StrokeColor"></t-color-picker>
                </t-form-item>
                <t-form-item label="边框宽度(width)">
                  <t-input v-model="point.StrokeWidth"></t-input>
                </t-form-item>
              </t-tab-pane>
              <t-tab-pane label="文字样式" name="second_Point">
                <t-form-item label="文字位置">
                  <t-select v-model="point.TextAglin" placeholder="请选择">
                    <t-option
                      v-for="item in TextAglinArray"
                      :key="item"
                      :label="item"
                      :value="item"
                    >
                    </t-option>
                  </t-select>
                </t-form-item>
                <t-form-item label="文字基线">
                  <t-select v-model="point.TextBaseline" placeholder="请选择">
                    <t-option
                      v-for="item in TextBaselineArray"
                      :key="item"
                      :label="item"
                      :value="item"
                    >
                    </t-option>
                  </t-select>
                </t-form-item>
                <t-form-item label="文字旋转角度">
                  <t-input v-model="point.TextRotation">
                    <span slot="append">°</span>
                  </t-input>
                </t-form-item>
                <t-form-item label="字体">
                  <t-select v-model="point.TextFont" placeholder="请选择">
                    <t-option
                      v-for="item in pointTextFontArray"
                      :key="item"
                      :label="item"
                      :value="item"
                    >
                    </t-option>
                  </t-select>
                </t-form-item>
                <t-form-item label="粗细">
                  <t-select v-model="point.TextWeight" placeholder="请选择">
                    <t-option
                      v-for="item in TextWeightArray"
                      :key="item"
                      :label="item"
                      :value="item"
                    >
                    </t-option>
                  </t-select>
                </t-form-item>
                <t-form-item label="大小">
                  <t-input v-model="point.TextSize">
                    <span slot="append">px</span>
                  </t-input>
                </t-form-item>
                <t-form-item label="x偏移量">
                  <t-input v-model="point.TextOffsetX"> </t-input>
                </t-form-item>
                <t-form-item label="y偏移量">
                  <t-input v-model="point.TextOffsetY"> </t-input>
                </t-form-item>
                <t-form-item label="外框颜色">
                  <t-color-picker v-model="point.TextColor"></t-color-picker>
                </t-form-item>
                <t-form-item label="外框宽度">
                  <t-input v-model="point.TextOutlineColor"></t-input>
                </t-form-item>
              </t-tab-pane>
            </t-tabs>
          </t-card>
        </t-col>
        <t-col :span="8">
          <t-card>
            <div
              slot="header"
              style="display: flex; justify-content: space-between; line-height: 28px"
            >
              <span>线要素样式</span>
              <t-button type="text" @click="LineUp">更新</t-button>
            </div>
            <t-tabs v-model="activeLine">
              <t-tab-pane label="图形样式" name="first_Line">
                <t-form-item label="边框颜色(color)">
                  <t-color-picker v-model="line.StrokeColor"></t-color-picker>
                </t-form-item>
                <t-form-item label="边框宽度(width)">
                  <t-input v-model="line.StrokeWidth"></t-input>
                </t-form-item>
              </t-tab-pane>
              <t-tab-pane label="文字样式" name="second_Line">
                <t-form-item label="文字位置">
                  <t-select v-model="line.TextAglin" placeholder="请选择">
                    <t-option
                      v-for="item in TextAglinArray"
                      :key="item"
                      :label="item"
                      :value="item"
                    >
                    </t-option>
                  </t-select>
                </t-form-item>
                <t-form-item label="文字基线">
                  <t-select v-model="line.TextBaseline" placeholder="请选择">
                    <t-option
                      v-for="item in TextBaselineArray"
                      :key="item"
                      :label="item"
                      :value="item"
                    >
                    </t-option>
                  </t-select>
                </t-form-item>
                <t-form-item label="文字旋转角度">
                  <t-input v-model="line.TextRotation">
                    <span slot="append">°</span>
                  </t-input>
                </t-form-item>
                <t-form-item label="字体">
                  <t-select v-model="line.TextFont" placeholder="请选择">
                    <t-option
                      v-for="item in pointTextFontArray"
                      :key="item"
                      :label="item"
                      :value="item"
                    >
                    </t-option>
                  </t-select>
                </t-form-item>
                <t-form-item label="粗细">
                  <t-select v-model="line.TextWeight" placeholder="请选择">
                    <t-option
                      v-for="item in TextWeightArray"
                      :key="item"
                      :label="item"
                      :value="item"
                    >
                    </t-option>
                  </t-select>
                </t-form-item>
                <t-form-item label="大小">
                  <t-input v-model="line.TextSize">
                    <span slot="append">px</span>
                  </t-input>
                </t-form-item>
                <t-form-item label="x偏移量">
                  <t-input v-model="line.TextOffsetX"> </t-input>
                </t-form-item>
                <t-form-item label="y偏移量">
                  <t-input v-model="line.TextOffsetY"> </t-input>
                </t-form-item>
                <t-form-item label="外框颜色">
                  <t-color-picker v-model="line.TextColor"></t-color-picker>
                </t-form-item>
                <t-form-item label="外框宽度">
                  <t-input v-model="line.TextOutlineColor"></t-input>
                </t-form-item>
              </t-tab-pane>
            </t-tabs>
          </t-card>
        </t-col>
        <t-col :span="8">
          <t-card>
            <div
              slot="header"
              style="display: flex; justify-content: space-between; line-height: 28px"
            >
              <span>区要素样式</span>
              <t-button type="text" @click="polygonUp">更新</t-button>
            </div>
            <t-tabs v-model="activePolygon">
              <t-tab-pane label="图形样式" name="first_Polygon">
                <t-form-item label="填充颜色(color)">
                  <t-color-picker v-model="polygon.FillColor"></t-color-picker>
                </t-form-item>
                <t-form-item label="边框颜色(color)">
                  <t-color-picker v-model="polygon.StrokeColor"></t-color-picker>
                </t-form-item>
                <t-form-item label="边框宽度(width)">
                  <t-input v-model="polygon.StrokeWidth"></t-input>
                </t-form-item>
              </t-tab-pane>
              <t-tab-pane label="文字样式" name="second_Polygon">
                <t-form-item label="文字位置">
                  <t-select v-model="polygon.TextAglin" placeholder="请选择">
                    <t-option
                      v-for="item in TextAglinArray"
                      :key="item"
                      :label="item"
                      :value="item"
                    >
                    </t-option>
                  </t-select>
                </t-form-item>
                <t-form-item label="文字基线">
                  <t-select v-model="polygon.TextBaseline" placeholder="请选择">
                    <t-option
                      v-for="item in TextBaselineArray"
                      :key="item"
                      :label="item"
                      :value="item"
                    >
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
                    <t-option
                      v-for="item in pointTextFontArray"
                      :key="item"
                      :label="item"
                      :value="item"
                    >
                    </t-option>
                  </t-select>
                </t-form-item>
                <t-form-item label="粗细">
                  <t-select v-model="polygon.TextWeight" placeholder="请选择">
                    <t-option
                      v-for="item in TextWeightArray"
                      :key="item"
                      :label="item"
                      :value="item"
                    >
                    </t-option>
                  </t-select>
                </t-form-item>
                <t-form-item label="大小">
                  <t-input v-model="polygon.TextSize">
                    <span slot="append">px</span>
                  </t-input>
                </t-form-item>
                <t-form-item label="x偏移量">
                  <t-input v-model="polygon.TextOffsetX"> </t-input>
                </t-form-item>
                <t-form-item label="y偏移量">
                  <t-input v-model="polygon.TextOffsetY"> </t-input>
                </t-form-item>
                <t-form-item label="外框颜色">
                  <t-color-picker v-model="polygon.TextColor"></t-color-picker>
                </t-form-item>
                <t-form-item label="外框宽度">
                  <t-input v-model="polygon.TextOutlineColor"></t-input>
                </t-form-item>
              </t-tab-pane>
            </t-tabs>
          </t-card>
        </t-col>
      </t-row>
    </t-form>
  </div>
</template>
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
