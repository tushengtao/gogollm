/* eslint-disable */
// 该文件由 OneAPI 自动生成，请勿手动修改！

declare namespace API_User {
  interface PageInfo_UserInfo {
    current?: number;
    pageSize?: number;
    total?: number;
    items?: Array<UserInfo>;
  }

  interface Result_PageInfo_UserInfo {
    success?: boolean;
    msg?: string;
    data?: PageInfo_UserInfo;
  }

  interface Result_UserInfo {
    success?: boolean;
    msg?: string;
    data?: UserInfo;
  }

  interface Result_LoginResp {
    access_token: string;
    access_token_expire_time?: string;
    access_token_type?: string;
    user: UserInfo;
  }

  interface Result_Resp {
    success?: boolean;
    msg?: string;
    data: Result_LoginResp;
    code?: number;
  }
  // 更新和添加的表单需要用
  interface UserInfo {
    id?: number;
    username?: string;
    nickname?: string;
    email?: string;
    avatar?: string;
    phone?: string;
    uuid?: string;
    dept_id?: number;
    status?: number;
    is_superuser?: boolean;
    is_staff?: boolean;
    is_multi_login?: boolean;
    join_time?: string;
    last_login_time?: string;
    dept?: {
      id?: number;
      name?: string;
    };
    roles?: {
      name?: string;
      status?: number;
      remark?: string;
      id?: number;
    }[];
  }
  // 发起请求传入body的查询参数
  interface UserReq {
    username?: string;
    nickname?: string;
    email?: string;
    dept_id?: number;
    roles?: number[];
    password?: string;
    phone?: string;
  }
}
