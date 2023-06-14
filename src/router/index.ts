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
    }
  ]
})

export default router
