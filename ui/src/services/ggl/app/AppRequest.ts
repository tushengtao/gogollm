import {request} from '@umijs/max';
import {BASE_URL} from "@/constants";
import {getToken} from '@/utils/authUtil';

export async function getUserAllApp() {
  return request<API_App.Result_UserAllApp>('/api/v1/ggl/app/userall', {
    method: 'GET'
  });
}

export async function modifyAppFlowData(
  params: {
    id: number;
  },
  body?: any,
) {
  const { id: param0 } = params;
  return request<API_App.Result_UserAllApp>(`/api/v1/ggl/app/flow/${param0}`, {
    method: 'PUT',
    params: { ...params },
    data: body,
  });
}

export async function modifyAppBasicInfo(
    body?: any,
) {
    return request<API_App.Result_UserAllApp>('/api/v1/ggl/app/update', {
        method: 'PUT',
        data: body,
    });
}

export async function addApp(body?: API_App.AppReq) {
  return request<API_App.Result_UserAllApp>('/api/v1/ggl/app', {
    method: 'POST',
    data: body,
  });
}

export async function deleteApp(params: { id: number }) {
  const { id: param0 } = params;
  return request<API_App.Result_Resp>(`/api/v1/ggl/app/${param0}`, {
    method: 'DELETE',
  });
}
export async function getAppById(params: { id: number }) {
  const { id: param0 } = params;
  return request<API_App.Result_App>(`/api/v1/ggl/app/${param0}`, {
    method: 'GET',
  });
}

export async function homepageStats() {
    return request<API_App.Result>('/api/v1/ggl/app/homepage_stats', {
        method: 'POST',
    });
}

export async function chatTest(messages: any, appId: any, appFlowData: any, messageHistoryCount:number, isStreaming: boolean) {
  return await fetch(BASE_URL + '/api/v1/ggl/app/chat_test',
      {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Accept': 'text/event-stream',
            'Authorization': 'Bearer ' + getToken(),
        },
        body: JSON.stringify({
            messages: messages,
            app_id: appId,
            streaming: isStreaming,
            msg_history_count: messageHistoryCount,
            app_flow_data: appFlowData
        }),
      });
}

export async function chat(messages: any, appId: any, session_id:any) {
    return await fetch(BASE_URL + '/api/v1/ggl/app/chat',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Accept': 'text/event-stream',
                'Authorization': 'Bearer ' + getToken(),
            },
            body: JSON.stringify({
                messages: messages,
                app_id: appId,
                session_id: session_id,
                streaming: true,
                msg_history_count: 10
            }),
        });
}
export async function code_autocomplete(prefix:string, suffix:string, model:string) {
    return request<API_App.Result>('/api/v1/ggl/app/code_autocomplete', {
        method: 'POST',
        data: {
            prefix: prefix,
            suffix:suffix,
            model: model
        }
    });
}

export async function code_node_run_test(code:string) {
    return request<API_App.Result>('/api/v1/ggl/app/code_node_run_test', {
        method: 'POST',
        data: {
            code: code
        }
    });
}

export async function getUserAppSession(body?: API_App.ChatSessionReq) {
    return request<API_App.Result_AppChatSession>('/api/v1/ggl/chat_session/list', {
        method: 'POST',
        data: body,
    });
}


export async function deleteAppSession(params: { session_id: string }) {
    const { session_id: param0 } = params;
    return request<API_App.Result_Resp>(`/api/v1/ggl/chat_session/${param0}`, {
        method: 'DELETE',
    });
}

export async function getUserChathistory(body?: API_App.ChatHistoryReq) {
    return request<API_App.Result_AppChatHistory>('/api/v1/ggl/chat_history/list', {
        method: 'POST',
        data: body,
    });
}
export async function getAppShareDepts(params: { id: any }) {
    const { id: param0 } = params;
    return request<API_App.Result_AppShareDepts>(`/api/v1/ggl/app/depts/${param0}`, {
        method: 'GET',
    });
}
