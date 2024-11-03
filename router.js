import { createRouter, createWebHistory } from 'vue-router';

import MemberForm from './src/components/MemberForm.vue';
import MembersList from './src/components/MembersList.vue';

const routes = [
  {
    path: '/',
    name: 'Form',
    component: MemberForm
  },
  {
    path: '/edit/:id',
    name: 'Edit',
    component: MemberForm,
    props: true
  },
  {
    path: '/members',
    name: 'Members',
    component: MembersList
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;