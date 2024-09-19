#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# from pbox import CodeSandBox
import aiohttp
import requests
from backend.common.log import log
from backend.app.ggl.conf import gogollm_settings


def is_local_execute():
    execute_type = gogollm_settings.PBOX_EXECUTE_TYPE.lower()
    # 判断是否为本地执行
    return execute_type == 'local'


def local_execute(code):
    #     code_sandbox = CodeSandBox()
    #     result = code_sandbox.execute_code(code).json()
    #     code_sandbox.close()
    #     return result
    return {"error": "local execute not support"}


def create_remote_sandbox():
    headers = {
        'API-KEY': gogollm_settings.PBOX_REMOTE_API_KEY
    }
    url = '/'.join([gogollm_settings.PBOX_REMOTE_URL, 'create'])
    try:
        resp = requests.get(url, headers=headers)
        if 200 == resp.status_code:
            result = resp.json()
            return result['kernel_id']
        else:
            log.exception(f'create_remote_sandbox failed:{resp.text}')
    except Exception as e:
        log.exception(f'create_remote_sandbox failed: {e}')
        raise e


async def async_close_remote_sandbox(kernel_id):
    headers = {
        'API-KEY': gogollm_settings.PBOX_REMOTE_API_KEY,
        'KERNEL-ID': kernel_id
    }
    url = '/'.join([gogollm_settings.PBOX_REMOTE_URL, 'close'])
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(url, headers=headers) as resp:
                if resp.status == 200:
                    log.info('PBOX remote sandbox close success.')
                else:
                    log.error(f'PBOX remote sandbox close failed: {resp.status}, {await resp.text()}')
        except Exception as e:
            log.exception(f'async_close_remote_sandbox failed: {e}')
            raise e


def close_remote_sandbox(kernel_id):
    headers = {
        'API-KEY': gogollm_settings.PBOX_REMOTE_API_KEY,
        'KERNEL-ID': kernel_id
    }
    url = '/'.join([gogollm_settings.PBOX_REMOTE_URL, 'close'])
    try:
        resp = requests.get(url, headers=headers)
        if 200 == resp.status_code:
            log.info('PBOX remote sandbox close success.')
        else:
            log.exception(f'PBOX remote sandbox close failed: {resp.status_code}, {resp.text}')
    except Exception as e:
        log.exception(f'close_remote_sandbox failed: {e}')
        raise e


def remote_execute(kernel_id, code):
    url = '/'.join([gogollm_settings.PBOX_REMOTE_URL, 'execute'])

    headers = {
        'API-KEY': gogollm_settings.PBOX_REMOTE_API_KEY,
        'Content-Type': 'application/json; charset=utf-8',
        'KERNEL-ID': kernel_id
    }
    data = {
        'code': code
    }
    try:
        resp = requests.post(url, headers=headers, json=data, timeout=600)
        if 200 == resp.status_code:
            return resp.json()
        else:
            log.exception(f'PBOX remote sandbox execute failed: {resp.status_code}, {resp.text}')
            return None
    except Exception as e:
        log.exception(f'remote_execute failed: {e}')
        raise e


def execute(kernel_id, code):
    if is_local_execute():
        return local_execute(code)
    else:
        return remote_execute(kernel_id, code)
