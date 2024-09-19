declare namespace API_Dept {
  interface Result_Resp {
    success?: boolean;
    msg?: string;
    data: DeptInfo[];
    code?: number;
  }

  interface Result_DeptInfo {
    success?: boolean;
    msg?: string;
    data: DeptInfo;
    code?: number;
  }

  interface DeptInfo {
    id: number;
    name: string;
    level?: number;
    sort?: number;
    leader?: string;
    phone?: string;
    email?: string;
    status: ?number;
    del_flag: ?boolean;
    parent_id?: number | null;
    children?: DeptInfo[];
  }

  interface DeptReq {
    name: string;
    sort?: number;
    leader?: string;
    phone?: string;
    email?: string;
    status: ?number;
    parent_id?: number | null;
  }
}
