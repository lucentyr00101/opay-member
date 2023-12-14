export default [
  {
    path: '/home',
    routes: [
      {
        name: 'home',
        path: '/home',
        component: './home',
      },
    ],
  },
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/',
    name: 'index',
    icon: 'smile',
    component: './',
  },
  {
    path: '/:merchantNo',
    name: 'merchantNo',
    component: './$merchantNo',
  },
  {
    path: '/payment/amount',
    name: 'payment-amount',
    component: './payment/amount',
  },
  {
    path: '/payment/options',
    name: 'payment/options',
    component: './payment/options',
  },
  {
    path: '/payment/transaction',
    name: 'payment-transaction',
    component: './payment/transaction',
  },
  {
    path: '/payment/transaction/:id',
    name: 'payment-transaction-id',
    component: './payment/transaction/$id',
  },
  {
    path: '/payment/order',
    name: 'payment-order',
    component: './payment/orders',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './TableList',
  },
  {
    path: '/',
    redirect: '/',
  },
  {
    component: './404',
  },
];
