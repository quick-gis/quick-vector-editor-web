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
    }
  ]
})

export default router
