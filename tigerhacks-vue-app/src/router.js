import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from './views/Dashboard.vue';
import ScheduleTab from './views/ScheduleTab.vue';
import SponsorsTab from './views/SponsorsTab.vue';
import PrizesTab from './views/PrizesTab.vue';
import AboutTab from './views/AboutTab.vue';
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
      children: [
        {
          path: 'schedule',
          name: 'schedule',
          component: ScheduleTab
        }, 
        {
          path: 'sponsors', 
          name: 'sponsors', 
          component: SponsorsTab
        }, 
        {
          path: 'prizes', 
          name: 'prizes', 
          component: PrizesTab
        }, 
        {
          path: 'about', 
          name: 'about', 
          component: AboutTab
        }
      ]
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
})
