import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Index',
        component: () => import('@/page/Index.vue')
    },
    {
        path: '/rule/add',
        component: () => import('@/page/Rule/Add.vue')
    },
    {
        path: '/rule/set',
        component: () => import('@/page/Rule/Set.vue')
    }
]

const router = new VueRouter({
    routes
})

export default router
