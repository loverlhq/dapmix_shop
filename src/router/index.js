import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import Welcome from '../components/welcome.vue'
import Users from '../components/users/users.vue'
import Rights from '../components/power/rights.vue'
import Roles from '../components/power/roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/params'
import breadcurmb from '../components/public/breadcurmb.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', components: { title: breadcurmb, default: Users } },
      { path: '/rights', components: { title: breadcurmb, default: Rights } },
      { path: '/roles', components: { title: breadcurmb, default: Roles } },
      { path: '/categories', components: { title: breadcurmb, default: Cate } },
      { path: '/params', components: { title: breadcurmb, default: Params } }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, form, next) => {
  if (to.path === '/login') {
    return next()
  } else {
    // 检查是否含有token值，如空返回/login
    const usrToken = window.sessionStorage.getItem('token')
    if (!usrToken) {
      next('/login')
    } else {
      next()
    }
  }
})

export default router
