
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'home', path: '', component: () => import('pages/Index.vue') },
      { name: 'firestore', path: 'firestore', component: () => import('pages/Firestore.vue') },
      { name: 'graphql-optimistic', path: 'graphql-optimistic', component: () => import('pages/GraphCache.vue') },
      { name: 'graphql-normal', path: 'graphql-normal', component: () => import('pages/GraphNormal.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
