import { request } from '@umijs/max';
import {useQuery} from "@@/exports";

export async function queryRoles(params: {
  [p: string]: any;
  filter: Record<string, (string | number)[] | null>;
  current?: number;
  sorter: Record<string, 'descend' | 'ascend' | null>;
  name?: string;
  keyword?: string;
  status?: number;
}) {
  return request<API_Role.Result_PageInfo_RoleInfo>(`/api/v1/sys/roles`, {
    method: 'GET',
    params : {
      name: params.name,
      page: params.current,
      size: params.pageSize,
      status: params.status
    }
  });
}
export function fetchRoles() {
  return request<API_Role.Result_Resp>(`/api/v1/sys/roles/all`, {
    method: 'GET'
  });
}

export const useRoles = () => {
  return useQuery<API_Role.Result_Resp>(['/api/v1/sys/roles/all'], fetchRoles, {
    staleTime: 5 * 60 * 1000, // 设置数据过期的持续时间（例如，5分钟）
  });
};

export async function addRole(body?: API_Role.RoleReq) {
  return request<API_Role.Result_Resp>('/api/v1/sys/roles', {
    method: 'POST',
    data: body,
  });
}

export async function modifyRole(
    params: {
      id: number;
    },
    body?: API_Role.RoleInfo,
) {
  const { id: param0 } = params;
  return request<API_Role.Result_Resp>(`/api/v1/sys/roles/${param0}`, {
    method: 'PUT',
    params: { ...params },
    data: body,
  });
}

export async function batchDeleteRoles(params: { ids: (number | undefined)[] }) {
  return request<API_Role.Result_Resp>(`/api/v1/sys/roles`, {
    method: 'DELETE',
    data: params.ids
  });
}

export async function getRoleMenus(params: { id: number }) {
  const { id: param0 } = params;
  return request<API_Menu.Result_Resp>(`/api/v1/sys/roles/${param0}/menus`, {
    method: 'GET',
  });
}

export async function modifyRoleMenus(
    params: {
      id?: number;
    },
    body?: API_Role.RoleMenusReq,
) {
  const { id: param0 } = params;
  return request<API_Role.Result_Resp>(`/api/v1/sys/roles/${param0}/menu`, {
    method: 'PUT',
    params: { ...params },
    data: body,
  });
}
