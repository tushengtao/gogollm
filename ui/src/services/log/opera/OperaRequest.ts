import { request } from '@umijs/max';

export async function queryOperaLogList(params: {
  [p: string]: any;
  filter: Record<string, (string | number)[] | null>;
  current?: number;
  sorter: Record<string, 'descend' | 'ascend' | null>;
  username?: string;
  status?: number;
  pageSize?: number;
  keyword?: string;
}) {
  return request<API_Opera.Result_PageInfo_OperaInfo>('/api/v1/logs/opera', {
    method: 'GET',
    params: {
      username: params.username,
      status: params.status,
      page: params.current,
      size: params.pageSize,
    },
  });
}


export async function deleteOperaLog(params: { ids: (number | undefined)[] }) {
  return request<API_Role.Result_Resp>(`/api/v1/logs/opera`, {
    method: 'DELETE',
    data: params.ids
  });
}

export async function deleteAllOperaLog() {
  return request<API_Role.Result_Resp>(`/api/v1/logs/opera/all`, {
    method: 'DELETE',
  });
}
