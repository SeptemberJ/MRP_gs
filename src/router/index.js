import Vue from 'vue'
import VueRouter from 'vue-router'
import MRPList from '@/pages/OrderList'
import AddMRP from '@/pages/AddOrder'
import MRPDetail from '@/pages/OrderDetail'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/MRPList',
      name: 'MRPList',
      component: MRPList,
      meta: {requireAuth: true}
    },
    {
      path: '/AddMRP',
      name: 'AddMRP',
      component: AddMRP,
      meta: {requireAuth: true}
    },
    {
      path: '/MRPDetail',
      name: 'MRPDetail',
      component: MRPDetail,
      meta: {requireAuth: true}
    },
    {path: '*', redirect: '/MRPList'}
  ]
})

// 登录控制
router.beforeEach((to, from, next) => {
  next()
  // if (to.meta.requireAuth) {
  //   if (getCookie('ZTC_18a808c40bba58c2c')) {
  //     next()
  //   } else {
  //     localStorage.clear()
  //     next({
  //       path: '/Login'
  //     })
  //   }
  // } else {
  //   next()
  // }
})

export default router
// export default new Router({
//   routes: [
//     {
//       path: '/',
//       name: 'HelloWorld',
//       component: HelloWorld
//     }
//   ]
// })
