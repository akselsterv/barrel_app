const routes = [
  {
    path: '/setup',
    component: () => import('@/pages/UserSetupPage.vue')
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('@/pages/HomePage.vue') },
      { path: 'classement', component: () => import('@/pages/ClassementPage.vue') },
      { path: 'profil', component: () => import('@/pages/ProfilPage.vue') },
      { path: 'boissons', component: () => import('@/pages/BoissonsPage.vue') }
    ]
  },
]

export default routes
