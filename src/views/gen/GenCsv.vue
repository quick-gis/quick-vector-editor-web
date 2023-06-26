<script lang="ts" setup>
import { onMounted, reactive } from 'vue';
import eventBus, { sendDialogConfirmHandlerOk } from '@/utils/eventBus';
import Papa from 'papaparse';
import { v4 as uuidv4 } from 'uuid';
import { MessagePlugin } from 'tdesign-vue-next';

let reader = new FileReader();
const PATH = '/gen_csv';
onMounted(() => {
  eventBus.on('dialog_confirm', (e) => {
    if (e.path == PATH) {
      ok();
      eventBus.emit('gen-csv', data.dataRes);
      sendDialogConfirmHandlerOk();
    }
  });
});

function convertToKeyValue(data: string[][]) {
  const result: [] = [];

  const keys: string[] = data[0];

  // 将其余的子列表转换为键值对
  for (let i = 1; i < data.length; i++) {
    const values: string[] = data[i];
    if (values.length === keys.length) {
      const resultDict = Object.fromEntries(keys.map((key, index) => [key, values[index]]));
      result.push(resultDict);
    }
  }

  return { data: result, head: keys };
}

const importcsv = (obj) => {
  console.log(obj);
};
const importJson = (f) => {
  reader.readAsText(f);
  reader.onload = () => {
    console.log(reader.result);
  };
};
const first = (file) => {
  console.log(file.raw);
  data.files = [file.name];
  Papa.parse(file.raw, {
    complete(results) {
      let nevers = convertToKeyValue(results.data);
      data.gen_shp.fields = nevers.head;
      data.csv.data = nevers.data;
      data.csv.header = nevers.head;
    }
  });

  return true;
};

const sec = (file) => {
  data.link_config.file = [file.name];

  Papa.parse(file.raw, {
    complete(results) {
      let nevers = convertToKeyValue(results.data);
      data.link_config.fields = nevers.head;

      data.linkcsv.data = nevers.data;

      data.link_config.canSelectFile = true;
    }
  });
  return true;
};

const data = reactive({
  files: [],

  res: null,
  csv: {
    header: [],
    data: []
  },
  vlink: false,
  linkcsv: {
    data: [],
    header: []
  },
  pre_list: ['ringtClick'],
  link_config: {
    canSelectFile: true,
    rules: {
      file: [{ required: true, message: '必填', trigger: 'blur' }],
      source_field: [{ required: true, message: '必填', trigger: 'blur' }],
      target_field: [{ required: true, message: '必填', trigger: 'blur' }],
      pre: [
        { required: true, message: '必填', trigger: 'blur' },
        {
          validator: (rule: any, value: any, callback: any) => {
            if (~data.pre_list.indexOf(value)) {
              callback(new Error('前缀已使用'));
            }
          }
        }
      ],
      ref_field: [{ required: true, message: '必填', trigger: 'blur' }]
    },
    fields: [],
    display: false,
    file: [],
    source_field: '',
    target_field: '',
    pre: '',
    ref_field: []
  },
  gen_shp: {
    file: '',
    type: '',
    hasGeo: false,
    fields: [],
    point: {
      x_field: '',
      y_field: ''
    },
    line: {
      sx_field: '',
      sy_field: '',
      ex_field: '',
      ey_field: ''
    }
  },
  dataRes: null
});

const ok = () => {
  let features: any[] = [];

  if (data.gen_shp.type == 'point') {
    for (let datum of data.csv.data) {
      datum['iid'] = uuidv4();
      let once = {
        type: 'Feature',
        properties: datum,
        geometry: {
          coordinates: [
            Number(datum[data.gen_shp.point.x_field]),
            Number(datum[data.gen_shp.point.y_field])
          ],
          type: 'Point'
        }
      };
      features.push(once);
    }
  } else if (data.gen_shp.type == 'line') {
    for (let datum of data.csv.data) {
      datum['iid'] = uuidv4();
      let once = {
        type: 'Feature',
        properties: datum,
        geometry: {
          coordinates: [
            [Number(datum[data.gen_shp.line.sx_field]), Number(datum[data.gen_shp.line.sy_field])],
            [Number(datum[data.gen_shp.line.ex_field]), Number(datum[data.gen_shp.line.ey_field])]
          ],
          type: 'LineString'
        }
      };
      features.push(once);
    }
  }
  let dataRes = {
    uid: uuidv4(),
    fileName: data.files[0].name,
    type: data.gen_shp.type,
    geo: {
      type: 'FeatureCollection',
      features: features
    },
    geo_type: data.gen_shp.type
  };
  data.dataRes = dataRes;
  console.log(dataRes);
};
const requestMethod = (file) => {
  return new Promise((resolve) => {
    resolve({ status: 'success', response: { url: '/' } });
  });
};

const validateLinkConfig = () => {
  if (!data.link_config.file) {
    MessagePlugin('error', { content: '链接文件必填' });
  }

  if (!data.link_config.source_field) {
    MessagePlugin('error', { content: '原始字段必填' });
  }
  if (!data.link_config.target_field) {
    MessagePlugin('error', { content: '目标字段必填' });
  }
  if (!data.link_config.pre) {
    MessagePlugin('error', { content: '前缀必填' });

    if (~data.pre_list.indexOf(data.link_config.pre)) {
      MessagePlugin('error', { content: '已使用前缀' });
    }
  }
  if (!data.link_config.ref_field || data.link_config.ref_field.length == 0) {
    MessagePlugin('error', { content: '引用字段必填' });
  }

  let vPre = data.link_config.pre != '';
  data.pre_list.push(vPre);

  let vRefField = data.link_config.ref_field.length > 0;
  return vPre == true && vRefField == true;
};
const linkClose = () => {
  console.log('链接表窗口关闭');
  data.vlink = validateLinkConfig();

  data.link_config.ref_field.forEach((e) => {
    data.gen_shp.fields.push(data.link_config.pre + '_' + e);
  });
  data.csv.data.forEach((ee) => {
    let ss = ee[data.link_config.source_field];
    let o = find(ss, data.link_config.target_field);

    for (let refFieldElement of data.link_config.ref_field) {
      if (o) {
        ee[data.link_config.pre + '_' + refFieldElement] = o[refFieldElement];
      }
    }
    console.log('sssssssssss', ss);
    console.log('oooooo', o);
  });
  data.link_config.display = false;
};
const find = (ss, field) => {
  let o = null;
  data.linkcsv.data.forEach((e) => {
    if (e[field] == ss) {
      o = e;
      return;
    }
  });
  return o;
};
</script>

<template>
  <div>CSV 成图</div>
  <t-form>
    <t-form-item label="文件" name="file">
      <t-upload
        v-model="data.files"
        :abridge-name="[8, 6]"
        :before-upload="first"
        :request-method="requestMethod"
        accept=".csv"
        action="./"
        placeholder="未选择文件"
        style="width: 100%"
        theme="file-input"
      />
    </t-form-item>

    <t-form-item label="成图类型">
      <t-select v-model="data.gen_shp.type" placeholder="请选择成图类型">
        <t-option label="点" value="point" />
        <t-option label="线" value="line" />
      </t-select>
    </t-form-item>

    <t-form-item label="是否包含坐标">
      <t-radio-group v-model="data.gen_shp.hasGeo">
        <t-radio label="是" value="是" />
        <t-radio label="否" value="否" />
      </t-radio-group>
    </t-form-item>

    <div v-if="data.gen_shp.hasGeo == '否'">
      <t-form-item label="属性链接配置">
        <t-button
          @click="
            () => {
              data.link_config.display = true;
              data.link_config.file = [];
              data.link_config.fields = [];
              data.link_config.source_field = '';
              data.link_config.target_field = '';
              data.link_config.pre = '';
              data.link_config.ref_field = [];
            }
          "
          >配置
        </t-button>
      </t-form-item>
    </div>

    <div v-if="data.gen_shp.type == 'point' && (data.gen_shp.hasGeo == '是' || data.vlink)">
      <t-form-item label="X坐标">
        <t-select v-model="data.gen_shp.point.x_field" placeholder="请选择X坐标">
          <t-option
            v-for="(col, idx) in data.gen_shp.fields"
            :key="idx"
            :index="idx"
            :label="data.gen_shp.fields[idx]"
            :value="data.gen_shp.fields[idx]"
            >{{ data.gen_shp.fields[idx] }}
          </t-option>
        </t-select>
      </t-form-item>

      <t-form-item label="Y坐标">
        <t-select v-model="data.gen_shp.point.y_field" placeholder="请选择Y坐标">
          <t-option
            v-for="(col, idx) in data.gen_shp.fields"
            :key="idx"
            :index="idx"
            :label="data.gen_shp.fields[idx]"
            :value="data.gen_shp.fields[idx]"
          />
        </t-select>
      </t-form-item>
    </div>

    <div v-if="data.gen_shp.type == 'line' && (data.gen_shp.hasGeo == '是' || data.vlink)">
      <t-form-item label="起点X坐标">
        <t-select v-model="data.gen_shp.line.sx_field" placeholder="请选择起点X坐标">
          <t-option
            v-for="(col, idx) in data.gen_shp.fields"
            :key="idx"
            :index="idx"
            :label="data.gen_shp.fields[idx]"
            :value="data.gen_shp.fields[idx]"
          />
        </t-select>
      </t-form-item>

      <t-form-item label="起点Y坐标">
        <t-select v-model="data.gen_shp.line.sy_field" placeholder="请选择起点Y坐标">
          <t-option
            v-for="(col, idx) in data.gen_shp.fields"
            :key="idx"
            :index="idx"
            :label="data.gen_shp.fields[idx]"
            :value="data.gen_shp.fields[idx]"
          />
        </t-select>
      </t-form-item>
      <t-form-item label="终点X坐标">
        <t-select v-model="data.gen_shp.line.ex_field" placeholder="请选择终点X坐标">
          <t-option
            v-for="(col, idx) in data.gen_shp.fields"
            :key="idx"
            :index="idx"
            :label="data.gen_shp.fields[idx]"
            :value="data.gen_shp.fields[idx]"
          />
        </t-select>
      </t-form-item>
      <t-form-item label="终点Y坐标">
        <t-select v-model="data.gen_shp.line.ey_field" placeholder="请选择终点Y坐标">
          <t-option
            v-for="(col, idx) in data.gen_shp.fields"
            :key="idx"
            :index="idx"
            :label="data.gen_shp.fields[idx]"
            :value="data.gen_shp.fields[idx]"
          />
        </t-select>
      </t-form-item>
    </div>
  </t-form>

  <div>
    <t-dialog
      @confirm="linkClose"
      v-model:visible="data.link_config.display"
      :close-on-click-modal="false"
      :show-close="false"
      title="引用配置"
      width="40%"
    >
      <t-form :model="data.link_config" :rules="data.link_config.rules" labt-width="120px">
        <t-form-item label="选择链接文件" prop="file" required>
          <t-upload
            v-model="data.link_config.file"
            :abridge-name="[8, 6]"
            :before-upload="sec"
            :request-method="requestMethod"
            accept=".csv"
            action="./"
            placeholder="未选择文件"
            style="width: 100%"
            theme="file-input"
          />
        </t-form-item>
        <t-form-item label="原始表字段" prop="source_field" required>
          <t-select v-model="data.link_config.source_field" placeholder="请选择原始表字段">
            <t-option
              v-for="(col, idx) in data.gen_shp.fields"
              :key="idx"
              :index="idx"
              :label="data.gen_shp.fields[idx]"
              :value="data.gen_shp.fields[idx]"
            />
          </t-select>
        </t-form-item>
        <t-form-item label="目标表字段" prop="target_field" required>
          <t-select v-model="data.link_config.target_field" placeholder="请选择目标表字段">
            <t-option
              v-for="(col, idx) in data.link_config.fields"
              :key="idx"
              :index="idx"
              :label="data.link_config.fields[idx]"
              :value="data.link_config.fields[idx]"
            />
          </t-select>
        </t-form-item>
        <t-form-item label="前缀" prop="pre" required>
          <t-input v-model="data.link_config.pre" placeholder="请输入前缀"></t-input>
        </t-form-item>
        <t-form-item label="引用字段" prop="ref_field" required>
          <t-select v-model="data.link_config.ref_field" multiple placeholder="请选择引用字段">
            <t-option
              v-for="(col, idx) in data.link_config.fields"
              :key="idx"
              :index="idx"
              :label="data.link_config.fields[idx]"
              :value="data.link_config.fields[idx]"
            />
          </t-select>
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<style scoped></style>
