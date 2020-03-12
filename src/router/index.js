import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import Members from '../components/Members.vue'
import Discussions from '../components/Discussions.vue'
import Signup from '../components/Signup.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/members',
    name: 'members',
    component: Members
  },
  {
    path: '/members/:id',
    name: 'member',
    component: Members
  },
  {
    path: '/discussions',
    name: 'discussions',
    component: Discussions
  },
  {
    path: '/discussions/:id',
    name: 'discussion', 
    component: Discussions,
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup
  },
]

const router = new VueRouter({
  routes
})

export default router
