import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home/Home.vue'
import Works from '../components/Works/Works.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
        path: '/works',
        name: 'Works',
        component: Works
    },
  ]
})
