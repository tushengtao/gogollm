declare namespace API_App {
  interface Result {
    success?: boolean;
    msg?: string;
    data: any;
    code?: number;
  }
  interface Result_Resp {
    success?: boolean;
    msg?: string;
    data: App[];
    code?: number;
  }
  interface Result_App {
    success?: boolean;
    msg?: string;
    data: App;
    code?: number;
  }
  interface Result_UserAllApp {
    success?: boolean;
    msg?: string;
    code?: number;
    data: UserAllApp;
  }
  interface UserAllApp {
    owner_apps: App[];
    share_apps: App[];
  }

  interface App {
    id: number;
    owner_id: number;
    name: string;
    flow_data: any;
    desc: string;
    type: number;
    del_flag: boolean;
    created_time: string;
    owner: API_User.UserInfo,
    share_depts: API_Dept.DeptInfo[];
  }

  interface AppReq {
    name: string;
    desc: string;
    flow_data: object;
    type: number; // 应用类型: 0 固定编排 1 流程编排 2 其他
  }

  interface ChatSession {
    session_name: string;
    created_time: string;
    session_id: string;
  }

  interface ChatHistory {
    content: string,
    createAt: number,
    id:string,
    role: string,
    updateAt: number,
  }
  interface ChatSessionReq {
    app_id: number;
    user_id: string;
  }
  interface ChatHistoryReq {
    app_id: number;
    user_id: string;
    session_id: string;
  }

  interface Result_AppChatSession {
    success?: boolean;
    msg?: string;
    code?: number;
    data: ChatSession[];
  }

  interface Result_AppChatHistory {
    success?: boolean;
    msg?: string;
    code?: number;
    data: ChatHistory[];
  }

  interface Result_AppShareDepts {
    success?: boolean;
    msg?: string;
    code?: number;
    data: API_Dept.DeptInfo[];
  }



}
