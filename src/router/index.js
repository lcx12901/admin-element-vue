import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'

const Login = () => import("views/login/Login.vue")
const Home = () => import("views/home/Home.vue")
const Welcome = () => import("views/welcome/Welcome.vue")
const Users = () => import('views/users/Users.vue')
const Roles = () => import('views/roles/Roles.vue')
const Rights = () => import('views/rights/Rights.vue')
const Reports = () => import('views/reports/Reports')
const Params = () => import('views/params/Params.vue')
const Orders = () => import('views/orders/Orders.vue')
const Goods = () => import('views/goods/Goods.vue')
const Categories = () => import('views/categories/Categories.vue')
const AddGood = () => import('views/good/Good.vue')
const EditGood = () => import('views/good/Good.vue')
const NotFound = () => import('views/notFound/NotFound.vue')
Vue.use(VueRouter)


const authRoutersList = {
  users: {path: '/users', component: Users, name: 'Users'},
  roles: {path: '/roles', component: Roles, name: 'Roles'},
  rights: {path: '/rights', component: Rights, name: 'Rights'},
  goods: {path: '/goods', component: Goods, name: 'Goods'},
  params: {path: '/params', component: Params, name: 'Params'},
  categories: {path: '/categories', component: Categories, name: 'Categories'},
  orders: {path: '/orders', component: Orders, name: 'Orders'},
  reports: {path: '/reports', component: Reports, name: 'Reports'},

}

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login,
    name: 'Login'
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    meta: {
      isLogin: true
    },
    children: [
      {path: '/welcome',component: Welcome,name: 'Welcome'},
      {path: '/goods/editGood',component: EditGood,name: 'Good'},
      {path: '/goods/addGood',component: AddGood,name: 'Good'},
      // {path: '/users',component: Users,name: 'Users'},
      // {path: '/roles',component: Roles,name: 'Roles'},
      // {path: '/rights',component: Rights,name: 'Rights'},
      // {path: '/reports',component: Reports,name: 'Reports'},
      // {path: '/params',component: Params,name: 'Params'},
      // {path: '/orders',component: Orders,name: 'Orders'},
      // {path: '/goods',component: Goods,name: 'Goods'},
      // {path: '/categories',component: Categories,name: 'Categories',},
      // {path: '/goods/addGood',component: AddGood,name: 'Good'},
      // {path: '/goods/editGood',component: EditGood,name: 'Good'}
    ]
  },
  {
    path: '*',
    component: NotFound
  }

]

const router = new VueRouter({
  mode: 'history',
  routes
})

NProgress.inc(0.2)
NProgress.configure({
  easing: 'ease', // 动画方式
  speed: 500, // 递增进度条的速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3 // 初始化时的最小百分比
})
// 路由前置守卫
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.meta.isLogin) {
    if (sessionStorage.getItem("token")) {
      next()
    } else {
      next('/login')
    }
  } 
  else {
    next()
  }
})

// 当路由进入后：关闭进度条
router.afterEach(() => {
  // 在即将进入新的页面组件前，关闭掉进度条
  NProgress.done()
})


export const authDynamicRouter = () => {
  const routes = router.options.routes
  const authMenusList = JSON.parse(sessionStorage.getItem("authMenus"))
  authMenusList.forEach(item => {
    item.children.forEach(citem => {
      routes[2].children.push(authRoutersList[citem.path])
    })
  })
  //让新的路由规则起效
  router.addRoutes(routes)
}


export default router
