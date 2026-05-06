export default [
	{
	  path: '/user',
	  layout: false,
	  routes: [
		{
		  path: '/user/login',
		  layout: false,
		  name: 'login',
		  component: './user/Login',
		},
		{
		  path: '/user',
		  redirect: '/user/login',
		},
	  ],
	},
  
	///////////////////////////////////
	// DEFAULT MENU
  
	{
	  path: '/dashboard',
	  name: 'Dashboard',
	  icon: 'HomeOutlined',
	  component: './TrangChu',
	},
  
	{
	  path: '/gioi-thieu',
	  name: 'About',
	  component: './TienIch/GioiThieu',
	  hideInMenu: true,
	},
  
	{
	  path: '/random-user',
	  name: 'RandomUser',
	  icon: 'ArrowsAltOutlined',
	  component: './RandomUser',
	},
  
	{
	  path: '/todo-list',
	  name: 'TodoList',
	  icon: 'OrderedListOutlined',
	  component: './TodoList',
	},
  
	// ✅ KANBAN
	{
	  path: '/kanban',
	  name: 'Kanban',
	  icon: 'AppstoreOutlined',
	  component: './KanbanBoard',
	},
  
	///////////////////////////////////
	// NOTIFICATION (fix path)
  
	{
	  path: '/notification',
	  layout: false,
	  hideInMenu: true,
	  routes: [
		{
		  path: '/notification/subscribe',
		  exact: true,
		  component: './ThongBao/Subscribe',
		},
		{
		  path: '/notification/check',
		  exact: true,
		  component: './ThongBao/Check',
		},
		{
		  path: '/notification',
		  exact: true,
		  component: './ThongBao/NotifOneSignal',
		},
	  ],
	},
  
	///////////////////////////////////
	// OTHER
  
	{
	  path: '/',
	  redirect: '/dashboard',
	},
  
	{
	  path: '/403',
	  component: './exception/403/403Page',
	  layout: false,
	},
  
	{
	  path: '/hold-on',
	  component: './exception/DangCapNhat',
	  layout: false,
	},
  
	{
	  component: './exception/404',
	},
  ];