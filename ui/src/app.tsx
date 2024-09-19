import { BASE_URL } from '@/constants';
import { clearToken, getToken, getUserInfo, isLogin } from '@/utils/authUtil';
import { BulbOutlined, LogoutOutlined } from '@ant-design/icons';
import {
  history,
  RequestConfig,
  RuntimeAntdConfig,
  RunTimeLayoutConfig,
} from '@umijs/max';
import { Dropdown, MenuProps, message, notification, theme } from 'antd';
import React from 'react';
import { toSvg } from "jdenticon";



// 全局初始数据,用于用户信息和权限初始化：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState() {
  if (!isLogin()) {
    history.push('/login');
  }
  return getUserInfo();
}

//运行时基本布局配置
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  //initialState上面登录函数返回的信息
  const DropdownItems: MenuProps['items'] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
    {
      key: 'theam',
      icon: <BulbOutlined />,
      label: '切换主题',
    },
  ];
  const DropdownOnClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      clearToken();
      history.push('/login');
    }
  };

  // 将SVG字符串转换为base64编码的图片
  function svgToBase64(svgString: string): string {
    const svgBase64 = Buffer.from(svgString).toString('base64');
    return `data:image/svg+xml;base64,${svgBase64}`;
  }
  // 使用Jdenticon生成SVG字符串，并将其转换为base64
  const iconValue = initialState?.userInfo.uuid || 'defaultUser';
  const svgString = toSvg(iconValue, 100);
  const avatarBase64 = svgToBase64(svgString);

  return {
    logo: require('@/assets/imgs/logo.jpg'), //左上角Logo
    title: 'GoGoLLM', //左上角Logo后面的名字
    menu: {
      locale: false, //菜单是否国际化
    },
    layout: 'mix', //菜单的方式，有mix,top,side
    siderWidth: 130,
    splitMenus: true, // 这里用了mix才会生效
    avatarProps: {
      src: avatarBase64 || '', // 指定右上角头像 数据
      title: initialState?.userInfo.username || '用户', // 指定右上角名称
      size: 'small',
      render: (props, dom) => {
        return (
          <Dropdown
            menu={{
              items: DropdownItems,
              onClick: DropdownOnClick,
            }}
          >
            {dom}
          </Dropdown>
        );
      },
    },
    // actionsRender: () => [<InfoCircleFilled key="InfoCircleFilled" />],
    token: {
      //菜单的样式配置
      sider: {},
    },
  };
};

// request请求配置
// 与后端约定的响应数据格式
interface ResponseStructure {
  data: any;
  code?: number;
  msg?: string;
  success?: boolean;
}

// 请求配置
export const request: RequestConfig = {
  timeout: 6000,
  // 错误处理。
  errorConfig: {
    // 错误抛出
    errorThrower: (res: ResponseStructure) => {
      const { code, msg, data } = res;
      if (200 !== code) {
        const error: any = new Error(msg);
        error.name = 'Error';
        error.info = { code, msg, data };
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
      if (error.name === 'Error') {
        const errorInfo: ResponseStructure | undefined = error.info;
        if (errorInfo) {
          const { msg, code } = errorInfo;
          notification.open({
            description: msg,
            message: code,
          });
        }
      } else if (error.response) {
        //  请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        if (401 === error.response.data.code) {
          clearToken();
          history.push('/login');
        }
        if (200 !== error.response.data.code) {
          message.error(error.response.data.msg + '  code: ' + error.response.data.code, 3);
        }
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        message.error('未响应，请重试！');

      } else {
        // 发送请求时出了点问题
        message.error('请求错误， 请重试');
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (url: string, options: any) => {
      const completeUrl = BASE_URL + url;
      const accessToken = getToken();
      const headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      };
      return { url: completeUrl, options: { ...options, headers } };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response: any) => {
      // 拦截响应数据，进行个性化处理
      const { data = {} as any } = response;
      if (401 === data.code) {
        clearToken();
        history.push('/login');
      }
      if (403 === data.code) {
        history.push('/403');
      }
      if (200 !== data.code) {
        message.error(data.msg, 3);
      }
      return response;
    },
  ],
};

// antd 主题配置
export const antd: RuntimeAntdConfig = (memo) => {
  // @ts-ignore
  memo.theme ??= {};
  // @ts-ignore
  memo.theme.algorithm = theme.defaultAlgorithm; // 配置 antd5 的预设 dark 算法

  // @ts-ignore
  memo.appConfig = {
    message: {
      // 配置 message 最大显示数，超过限制时，最早的消息会被自动关闭
      maxCount: 5,
    },
  };

  return memo; /*  */
};
