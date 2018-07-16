import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Register from '@/components/Register'
import Allocations from '@/components/Allocations'
import Drivers from '@/components/Drivers'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/Allocations',
      name: 'Allocations',
      component: Allocations
    },
    {
      path: '/Drivers',
      name: 'Drivers',
      component: Drivers
    }
  ]
})
