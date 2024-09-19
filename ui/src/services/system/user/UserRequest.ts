import { request } from '@umijs/max';

export async function queryUserList(params: {
  [p: string]: any;
  filter: Record<string, (string | number)[] | null>;
  current?: number;
  sorter: Record<string, 'descend' | 'ascend' | null>;
  username?: string;
  phone?: string;
  dept_id?: number;
  pageSize?: number;
  keyword?: string;
}) {
  return request<API_User.Result_PageInfo_UserInfo>('/api/v1/sys/users', {
    method: 'GET',
    params: {
      username: params.username,
      phone: params.phone,
      dept: params.dept_id,
      page: params.current,
      size: params.pageSize,
    },
  });
}

export async function addUser(body?: API_User.UserReq) {
  return request<API_User.Result_UserInfo>('/api/v1/sys/users/add', {
    method: 'POST',
    data: body,
  });
}

export async function getUserInfo(params: { username?: string }) {
  const { username: param0 } = params;
  return request<API_User.Result_UserInfo>(`/api/v1/sys/users/${param0}`, {
    method: 'GET',
  });
}

export async function modifyUser(
  params: {
    username?: string;
  },
  body?: API_User.UserReq,
) {
  const { username: param0 } = params;
  return request<API_User.Result_Resp>(`/api/v1/sys/users/${param0}`, {
    method: 'PUT',
    params: { ...params },
    data: body,
  });
}

export async function modifyUserRole(
  params: {
    username?: string;
  },
  body?: API_User.UserReq,
) {
  const { username: param0 } = params;
  return request<API_User.Result_UserInfo>(`/api/v1/sys/users/${param0}/role`, {
    method: 'PUT',
    params: { ...params },
    data: body,
  });
}

// 从数据库删除
export async function deleteUser(params: { username?: string | number }) {
  const { username: param0 } = params;
  return request<API_User.Result_Resp>(`/api/v1/sys/users/${param0}`, {
    method: 'DELETE',
  });
}
