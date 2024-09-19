import { request } from '@umijs/max';
import { useQuery } from '@@/exports';

// 获取所有菜单树
export async function getMenus(params: {
  [p: string]: any;
  filter: Record<string, (string | number)[] | null>;
  current?: number;
  sorter: Record<string, 'descend' | 'ascend' | null>;
  title?: string;
  status?: number;
}) {
  return request<API_Menu.Result_Resp>(`/api/v1/sys/menus`, {
    method: 'GET',
    params: {
      title: params.title,
      status: params.status,
    },
  });
}

export async function fetchMenus() {
  return request<API_Menu.Result_Resp>(`/api/v1/sys/menus`, {
    method: 'GET',
  });
}
// 获取所有菜单树 缓存接口
export const useMenus = () => {
  return useQuery<API_Menu.Result_Resp>(['/api/v1/sys/menus'], fetchMenus, {
    staleTime: 5 * 60 * 1000, // 设置数据过期的持续时间（例如，5分钟）
  });
};

export async function modifyMenu(
  params: {
    id: number;
  },
  body?: API_Menu.MenuInfo,
) {
  const { id: param0 } = params;
  return request<API_Menu.Result_Resp>(`/api/v1/sys/menus/${param0}`, {
    method: 'PUT',
    params: { ...params },
    data: body,
  });
}

export async function addMenu(body?: API_Menu.MenuReq) {
  return request<API_Menu.Result_Resp>('/api/v1/sys/menus', {
    method: 'POST',
    data: body,
  });
}

export async function deleteMenu(params: { id?: number }) {
  const { id: param0 } = params;
  return request<API_Menu.Result_Resp>(`/api/v1/sys/menus/${param0}`, {
    method: 'DELETE',
  });
}
