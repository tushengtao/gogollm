import { BASE_URL } from '@/constants';
import { request } from '@umijs/max';
import { message } from 'antd';

export async function login(
  body?: API_Auth.LoginReq,
  options?: { [key: string]: any },
) {
  return request<API_User.Result_Resp>(`/api/v1/auth/login`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function getUserAccess() {
  return request<API_Auth.Result_Resp>(`/api/v1/sys/menus/access`, {
    method: 'GET'
  });
}

// 获取图片验证码
export async function captcha() {
  const response = await fetch(BASE_URL + '/api/v1/auth/captcha');
  const data = await response.json();
  switch (data.code) {
    case 200:
      break;
    case 429:
      message.warning(data.msg || '请求过于频繁，请稍后重试');
      break;
    case 404:
      message.error('404，资源未找到');
      break;
    default:
      message.error(data.msg || '未知错误，请联系工作人员');
      break;
  }
  return data.data.image;
}
