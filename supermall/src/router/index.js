import VueRouter from 'vue-router'
import Vue from 'vue'

const Home = () => import('../views/home/Home')
const Category = () => import('../views/category/Category')
const Shopcart = () => import('../views/shopcart/Shopcart')
const Profile = () => import('../views/profile/Profile')
const Detail = () => import('../views/detail/Detail.vue')


Vue.use(VueRouter)

const routes =[
  {
    path:'',
    redirect:'/home'
},
{
    path:'/home',
    component: Home
},
{
    path:'/category',
    component: Category
},
{
    path:'/shopcart',
    component: Shopcart
},
{
    path:'/profile',
    component: Profile
},
{ 
    path: '/detail/:iid',
     component: Detail
 ,}
]

const router = new VueRouter({
  routes,
  mode:'history'
})
export default router