declare namespace API_Role {
  interface Result_Resp {
    success?: boolean;
    msg?: string;
    data?: RoleInfo[];
    code?: number;
  }

  interface Result_PageInfo_RoleInfo {
    success?: boolean;
    msg?: string;
    data?: PageInfo_RoleInfo;
  }

  interface PageInfo_RoleInfo {
    current?: number;
    pageSize?: number;
    total?: number;
    items?: Array<RoleInfo>;
  }

  interface RoleInfo {
    id: number;
    name?: string;
    data_scope?: number;
    status?: number;
    remark?: string;
  }

  interface RoleReq {
    name?: string;
    data_scope?: number;
    status?: number;
    remark?: string;
  }

  interface RoleMenusReq {
    menus?: Array<number>;
  }

}


