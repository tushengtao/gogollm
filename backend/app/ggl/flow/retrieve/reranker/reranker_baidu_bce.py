#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import requests
from backend.database.db_sync_redis import RedisSyncCli
from backend.app.ggl.conf import gogollm_settings
from backend.common.exception import errors


REDIS_KEY = "gogollm_baidu_access_token"


def get_access_token(api_key, secret_key):
    redis_client = RedisSyncCli(db=gogollm_settings.REDIS_BAIDU_API_TOKEN_DATABASE)
    token = redis_client.get(name=REDIS_KEY)
    token = token.decode('utf-8')
    if token is not None:
        return token
    else:
        """
        使用 API Key，Secret Key 获取access_token，替换下列示例中的应用API Key、应用Secret Key
        """
        url = "https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=" + \
              api_key + "&client_secret=" + secret_key
        payload = ""
        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        response = requests.request("POST", url, headers=headers, data=payload)
        token = response.json().get("access_token")
        expires_in = response.json().get("expires_in")
        redis_client.set(name="baidu_access_token", value=token, ex=expires_in - 3600)
        return token


def reranker(query, documents, top_n):
    api_key = gogollm_settings.BAIDU_QIANFAN_API_KEY
    secret_key = gogollm_settings.BAIDU_QIANFAN_SECRET_KEY
    access_token = get_access_token(api_key, secret_key)
    url = "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/reranker/bce_reranker_base?access_token=" \
          + access_token
    # 目前百度的api 不能超过 64
    top_n = min(top_n, 63)
    payload = {
        "query": query,
        "documents": documents[:63],
        "top_n": top_n
    }
    headers = {
        'Content-Type': 'application/json'
    }
    response = requests.request("POST", url, headers=headers, json=payload)
    resp_text = response.text
    try:
        resp_josn = json.loads(resp_text)
        return resp_josn.get("results")
    except requests.exceptions.InvalidJSONError:
        raise errors.HTTPError(code=response.status_code, msg="baidu-api-bce_reranker_base: " + resp_text)
