import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Home', component: () => import('../views/Home.vue') },
  { path: '/date-picker', name: 'DatePicker', component: () => import('../views/DatePickerDemo.vue') },
  { path: '/ptz', name: 'Ptz', component: () => import('../views/PtzDemo.vue') },
  { path: '/aichat', name: 'AIChat', component: () => import('../views/AIChatDemo.vue') },
  { path: '/talk', name: 'Talk', component: () => import('../views/TalkDemo.vue') },
  { path: '/time-line', name: 'TimeLine', component: () => import('../views/TimeLineDemo.vue') },
  { path: '/zoom', name: 'Zoom', component: () => import('../views/ZoomDemo.vue') },
  { path: '/broadcast', name: 'Broadcast', component: () => import('../views/BroadcastDemo.vue') },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
