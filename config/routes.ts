export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { name: '登录', path: '/user/login', component: './User/Login' },
      { name: '注册', path: '/user/register', component: './User/Register' }
    ],
  },

  { path: '/add_chart', name: '智能分析', icon: 'barChart', component: './AddChart' },
  { path: '/add_chart_async', name: '智能分析(异步)', icon: 'barChart', component: './AddChartAsync' },
  { path: '/chart', name: '我的图表',  icon: 'pieChart', component: './Chart' },
  { path: '/', redirect: '/add_chart' },

  { path: '*', layout: false, component: './404' },
];
