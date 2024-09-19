import { request, useQuery } from '@umijs/max';

export async function getDepts(params: {
  [p: string]: any;
  filter: Record<string, (string | number)[] | null>;
  current?: number;
  sorter: Record<string, 'descend' | 'ascend' | null>;
  name?: string;
  phone?: string;
  status?: number;
  leader?: string;
}) {
  return request<API_Dept.Result_Resp>('/api/v1/sys/depts', {
    method: 'GET',
    params: {
      phone: params.phone,
      name: params.name,
      status: params.status,
      leader: params.leader,
    },
  });
}

export const fetchDepts = async (): Promise<API_Dept.Result_Resp> => {
  return await request(`/api/v1/sys/depts`, {
    method: 'GET',
  });
};
export const useDepts = () => {
  return useQuery<API_Dept.Result_Resp>(['/api/v1/sys/depts'], fetchDepts, {
    staleTime: 5 * 60 * 1000, // 设置数据过期的持续时间（例如，5分钟）
  });
};

export async function modifyDept(
  params: {
    id: number;
  },
  body?: API_Dept.DeptInfo,
) {
  const { id: param0 } = params;
  return request<API_Dept.Result_Resp>(`/api/v1/sys/depts/${param0}`, {
    method: 'PUT',
    params: { ...params },
    data: body,
  });
}

export async function addDept(body?: API_Dept.DeptReq) {
  return request<API_Dept.Result_DeptInfo>('/api/v1/sys/depts', {
    method: 'POST',
    data: body,
  });
}

// 从数据库删除
export async function deleteDept(params: { id?: number }) {
  const { id: param0 } = params;
  return request<API_Dept.Result_Resp>(`/api/v1/sys/depts/${param0}`, {
    method: 'DELETE',
  });
}
