declare namespace API_Opera {
  interface PageInfo_OperaInfo {
    current?: number;
    pageSize?: number;
    total?: number;
    items?: Array<OperaInfo>;
  }
  interface Result_PageInfo_OperaInfo {
    success?: boolean;
    msg?: string;
    data?: PageInfo_OperaInfo;
  }

  interface OperaInfo {
    id: number;
    username: string | null;
    method: string;
    title: string;
    path: string;
    ip: string;
    country: string | null;
    region: string | null;
    city: string | null;
    user_agent: string;
    os: string | null;
    browser: string | null;
    device: string | null;
    args: Record<string, any> | null;
    status: StatusType;
    code: string;
    msg: string | null;
    cost_time: number;
    opera_time: string; // 假设后端返回的是 ISO 8601 格式的字符串
  }

  enum StatusType {
    enable = 1,
    disable = 0,
  }
}
