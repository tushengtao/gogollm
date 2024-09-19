const routes = [
    {
        path: '/login',
        component: './Auth/Login',
        layout: false,
    },
    {
        path: '/403',
        component: './Exception/403',
        layout: false,
    },
    {
        path: '/500',
        component: './Exception/500',
        layout: false,
    },
    {
        path: '/401',
        component: './Exception/401',
        layout: false,
    },
    {
        path: '/',
        exact: true,
        redirect: '/home',
    },
    {
        name: '首页',
        path: '/home',
        access: 'dashboard',
        component: './Home', // TODO 修改路径名称
    },
    {
        name: 'LLM应用',
        path: '/app',
        access: 'app',
        routes: [
            {
                path: '/app',
                redirect: '/app/center',
            },
            {
                name: '应用中心',
                path: '/app/center',
                component: './Ggl/AppCenter',
                access: 'app:center'
            },
            {
                name: '数据集',
                path: '/app/dataset',
                component: './Ggl/DataSet',
                access: 'app:dataset'
            }
        ],
    },
    {
        name: '应用流程编排',
        path: '/app/flow',
        component: './Ggl/Flow',
        access: 'app:flow',
        layout: false
    },
    {
        name: '应用Chat',
        path: '/app/chat',
        component: './Ggl/Chat',
        access: 'app:chat',
        layout: false
    },
    {
        name: '系统管理',
        path: '/sys',
        access: 'sys',
        routes: [
            {
                path: '/sys',
                redirect: '/sys/user',
            },
            {
                name: '用户管理',
                path: '/sys/user',
                access: 'sys:user',
                component: './System/User'
            },
            {
                name: '部门管理',
                path: '/sys/dept',
                access: 'sys:dept',
                component: './System/Dept'
            },
            {
                name: '菜单管理',
                path: '/sys/menu',
                access: 'sys:menu',
                component: './System/Menu'
            },
            {
                name: '角色管理',
                path: '/sys/role',
                access: 'sys:role',
                component: './System/Role'
            }
        ],
    },
    {
        name: '日志管理',
        path: '/log',
        access: 'log',
        routes: [
            {
                path: '/log',
                redirect: '/log/opera',
            },
            {
                name: '操作日志',
                path: '/log/opera',
                access: 'log:opera',
                component: './Log/Opera',
            }
        ]
    },
];
export default routes;
