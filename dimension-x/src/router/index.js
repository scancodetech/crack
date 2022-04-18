import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: "/home",
    name: "home",
    meta: 'home',
    component: resolve => require(['@/views/home/index.vue'], resolve)
  },
  {
    path:"/mine",
    name:"mine",
    meta:'mine',
    component: resolve => require(['@/views/mine/index.vue'], resolve)
  },
  {
    path:"/invite",
    name:"invite",
    meta:'invite',
    component: resolve => require(['@/views/invite/index.vue'], resolve)
  },
  {
    path:"/invite",
    name:"invite",
    meta:'invite',
    component: resolve => require(['@/views/invite/index.vue'], resolve)
  },
  {
    path:"/storeItem",
    name:"storeItem",
    meta:'storeItem',
    component: resolve => require(['@/views/storeItem/index.vue'], resolve)
  },
  {
    path:"/auction",
    name:"auction",
    meta:'auction',
    component: resolve => require(['@/views/auction/index.vue'], resolve)
  },
  {
    path:"/setting",
    name:"setting",
    meta:'setting',
    component: resolve => require(['@/views/setting/index.vue'], resolve)
  },
  {
    path:"/create",
    name:"create",
    meta:'create',
    component: resolve => require(['@/views/create/index.vue'], resolve)
  },
  {
    path:"/sellcard",
    name:"sellcard",
    meta:'sellcard',
    component: resolve => require(['@/views/sellcard/index.vue'], resolve)
  },
  {
    path:"/auctionSelf",
    name:"auctionSelf",
    meta:'auctionSelf',
    component: resolve => require(['@/views/auctionSelf/index.vue'], resolve)
  },
  {
    path:"/transfer",
    name:"transfer",
    meta:'transfer',
    component: resolve => require(['@/views/transfer/index.vue'], resolve)
  },
]

const originalPush = VueRouter.prototype.push
// 修改原型对象中的push方法
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  // mode: "history",
  // base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes
})

export default router
