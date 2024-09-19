declare namespace API_Auth {
  interface LoginReq {
    username: string;
    password: string;
    captcha: string;
  }
  interface Result_Resp {
    success?: boolean;
    msg?: string;
    data: UserAccess;
    code?: number;
  }
  interface UserAccess {
    [key: string]: boolean;
  }
}


