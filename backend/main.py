#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import uvicorn
from path import Path
from backend.common.log import log
from backend.core.conf import settings
from backend.core.registrar import register_app
from dotenv import load_dotenv
from langchain.globals import set_debug


# 加载 .env 文件中的环境变量
load_dotenv()
langchain_debug = os.getenv("LANGCHAIN_DEBUG", "False") == "True"
# 开启langchain debug
set_debug(langchain_debug)

app = register_app()

if __name__ == '__main__':
    try:
        log.info(
            """\n

   _____        _____       _      _      __  __ 
  / ____|      / ____|     | |    | |    |  \/  |
 | |  __  ___ | |  __  ___ | |    | |    | \  / |
 | | |_ |/ _ \| | |_ |/ _ \| |    | |    | |\/| |
 | |__| | (_) | |__| | (_) | |____| |____| |  | |
  \_____|\___/ \_____|\___/|______|______|_|  |_|
    
    Doc_URL: http://127.0.0.1:9116/api/v1/docs
            """
        )
        uvicorn.run(
            app=f'{Path(__file__).stem}:app',
            host=settings.UVICORN_HOST,
            port=settings.UVICORN_PORT,
            reload=settings.UVICORN_RELOAD,
        )
    except Exception as e:
        log.error(f'❌ FastAPI start filed: {e}')
