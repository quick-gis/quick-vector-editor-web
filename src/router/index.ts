import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      // @ts-ignore
      component: () => import('../views/map/MapView.vue')
    },
    {
      path: '/about',
      name: 'about',
      // @ts-ignore
      component: () => import('../views/map/MapView.vue')
    },
    {
      path: '/tdt_config',
      name: 'tdtConfig',
      component: () => {
        // @ts-ignore
        return import('../views/token/TianDiTuToken.vue')
      }
    },
    {
      path: '/gen_csv',
      name: 'genCsv',
      component: () => {
        // @ts-ignore
        return import('../views/gen/GenCsv.vue')
      }
    },
    {
      path: '/gen_geo_json',
      name: 'genGeoJson',
      component: () => {
        // @ts-ignore
        return import('../views/gen/GenGeoJson.vue')
      }
    },
    {
      path: '/gen_mysql',
      name: 'genMysql',
      component: () => {
        // @ts-ignore
        return import('../views/gen/GenMysql.vue')
      }
    },
    {
      path: '/move_xy',
      name: 'move_xy',
      component: () => {
        // @ts-ignore
        return import('../views/tools/move_xy/MoveToXY.vue')
      }
    },
    {
      path: '/subway',
      name: 'subway',
      component: () => {
        // @ts-ignore
        return import('../views/dataview/GaoDeSubway.vue')
      }
    },
    {
      path: '/expgeojson',
      name: 'expgeojson',
      component: () => {
        // @ts-ignore
        return import('../views/exp/ExportGeoJson.vue')
      }
    },
    {
      path: '/buffer',
      name: 'buffer',
      component: () => {
        // @ts-ignore
        return import('../views/anasys/Buffer.vue')
      }
    },
    {
      path: '/style',
      name: 'style',
      component: () => {
        // @ts-ignore
        return import('../views/label/LabelViewLine.vue')
      }
    }
  ]
})

export default router
