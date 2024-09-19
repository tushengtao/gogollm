# -*- coding: utf-8 -*-

import sys

from redis.client import Redis
from redis.exceptions import AuthenticationError, TimeoutError

from backend.common.log import log
from backend.core.conf import settings


class RedisSyncCli(Redis):
    def __init__(self, db=None):
        # 如果 db 参数未提供，使用配置文件中的默认值
        db_index = db if db is not None else settings.REDIS_DATABASE
        super(RedisSyncCli, self).__init__(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            password=settings.REDIS_PASSWORD,
            db=db_index,
            socket_timeout=settings.REDIS_TIMEOUT,
            decode_responses=True,  # 转码 utf-8
        )

    def open(self):
        """
        触发初始化连接

        :return:
        """
        try:
            self.ping()
        except TimeoutError:
            log.error('❌ 数据库 redis 连接超时')
            sys.exit()
        except AuthenticationError:
            log.error('❌ 数据库 redis 连接认证失败')
            sys.exit()
        except Exception as e:
            log.error('❌ 数据库 redis 连接异常 {}', e)
            sys.exit()

    def delete_prefix(self, prefix: str, exclude: str | list = None):
        """
        删除指定前缀的所有key

        :param prefix:
        :param exclude:
        :return:
        """
        keys = []
        for key in self.scan_iter(match=f'{prefix}*'):
            if isinstance(exclude, str):
                if key != exclude:
                    keys.append(key)
            elif isinstance(exclude, list):
                if key not in exclude:
                    keys.append(key)
            else:
                keys.append(key)
        for key in keys:
            self.delete(key)


# 创建同步默认 redis 客户端实例
redis_sync_client = RedisSyncCli()
