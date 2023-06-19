<script lang="ts" setup>
import { nextTick, onMounted, reactive, watch } from 'vue'
import * as mysql from 'mysql'
import { BgAxios } from '@/utils/axiosUtils'
import eventBus, { sendDialogConfirmHandlerOk } from '@/utils/eventBus'
import { v4 as uuidv4 } from 'uuid'
const PATH = '/gen_mysql'

onMounted(() => {
  eventBus.on('dialog_confirm', async (e) => {
    if (e.path == PATH) {
      await calcGeojson()
      await nextTick(() => {
        eventBus.emit('gen-mysql', {
          geojsons: data.geojsonCollections,
          name: data.linkConfig.table,
          geo_type: data.type,
          uid: uuidv4()
        })
      })
      sendDialogConfirmHandlerOk()
    }
  })
})
const data = reactive({
  type: 'collection',
  linkConfig: {
    table: '',
    field: '',
    db: '',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root123@',
    databases: [],
    tables: [],
    tableFields: [],
    isLink: false
  },

  geojsonCollections: []
})
let connection
const testLink = () => {
  BgAxios()
    .post('/db/dbs', data.linkConfig)
    .then((res) => {
      if (res.data.code == 'ok') {
        data.linkConfig.databases = res.data.data
        data.linkConfig.isLink = true
      }
      console.log(res)
    })
}
watch(
  () => {
    return data.linkConfig.db
  },
  (newVal, oldVal) => {
    BgAxios()
      .post('/db/tables', data.linkConfig)
      .then((res) => {
        if (res.data.code == 'ok') {
          data.linkConfig.tables = res.data.data
        }
        console.log(res)
      })
  }
)
watch(
  () => {
    return data.linkConfig.table
  },
  (nv, ov) => {
    BgAxios()
      .post('/db/tableFields', data.linkConfig)
      .then((res) => {
        if (res.data.code == 'ok') {
          data.linkConfig.tableFields = res.data.data
        }
        console.log(res)
      })
  }
)
const calcGeojson = async () => {
  let res = await BgAxios().post('/db/geojson', data.linkConfig)

  if (res.data.code == 'ok') {
    return (data.geojsonCollections = res.data.data)
  }
}
</script>

<template>
  <div>数据库链接</div>
  <div>
    <t-form :model="data.linkConfig">
      <t-form-item label="数据库ip">
        <t-input v-model="data.linkConfig.host" />
      </t-form-item>
      <t-form-item label="数据库端口">
        <t-input v-model="data.linkConfig.port" />
      </t-form-item>
      <t-form-item label="账号">
        <t-input v-model="data.linkConfig.username" />
      </t-form-item>
      <t-form-item label="密码">
        <t-input type="password" v-model="data.linkConfig.password" />
      </t-form-item>
      <t-form-item label="成图类型">
        <t-select v-model="data.type" placeholder="请选择成图类型">
          <t-option label="点" value="point" />
          <t-option label="线" value="line" />
          <t-option label="面" value="polygon" />
          <t-option label="集合" value="collection" />
        </t-select>
      </t-form-item>

      <t-form-item v-if="data.linkConfig.isLink" label="数据库">
        <t-select v-model="data.linkConfig.db">
          <t-option v-for="(col, idx) in data.linkConfig.databases" :label="col" :value="col" />
        </t-select>
      </t-form-item>
      <t-form-item v-if="data.linkConfig.db" label="表">
        <t-select v-model="data.linkConfig.table">
          <t-option
            v-for="(col, idx) in data.linkConfig.tables"
            :key="idx"
            :label="col.en_name"
            :value="col.cn_name"
          >
          </t-option>
        </t-select>
      </t-form-item>
      <t-form-item v-if="data.linkConfig.table" label="空间字段">
        <t-select v-model="data.linkConfig.field">
          <t-option
            v-for="(col, idx) in data.linkConfig.tableFields"
            :key="idx"
            :label="col.cn_name"
            :value="col.en_name"
          >
          </t-option>
        </t-select>
      </t-form-item>
    </t-form>
    <!--    <div>{{ data.geojsonCollections }}</div>-->
    <!--    <div>{{ data.linkConfig.tableFields }}</div>-->
    <!---->
    <t-button @click="testLink">获取数据</t-button>
    <!--    <t-button @click="calcGeojson">获取geojson</t-button>-->
  </div>
</template>

<style scoped></style>
