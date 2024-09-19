declare namespace API_Menu {
  interface Result_Resp {
    success?: boolean;
    msg?: string;
    data: MenuInfo[];
    code?: number;
  }

  interface Result_MenuInfo {
    success?: boolean;
    msg?: string;
    data: MenuInfo;
    code?: number;
  }

  interface MenuInfo {
    id: number;
    title: string;
    name: string;
    level: number;
    sort: number;
    icon: string;
    path: string;
    menu_type: number;
    component?: string | null;
    perms?: string | null;
    status: number;
    show: number;
    cache: number;
    remark?: string | null;
    parent_id?: number | null;
    children?: MenuInfo[];
  }

  interface MenuReq {
    title: string;
    name: string;
    sort: number;
    icon: string;
    path: string;
    menu_type: number;
    component?: string | null;
    perms?: string | null;
    status: number;
    show: number;
    cache: number;
    remark?: string | null;
    parent_id?: number | null;
  }
}
