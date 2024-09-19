#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import threading
from typing import Any, Type
from pydantic import BaseModel, Field
from langchain_core.tools import BaseTool
from backend.common.exception import errors
from backend.app.ggl.flow.code_executor.pbox.executor import execute as execute_code, create_remote_sandbox, \
    close_remote_sandbox


class PythonReplInput(BaseModel):
    code: str = Field(description="Python code to be executed")


class PythonReplTool(BaseTool):
    name = "python_repl_tool"
    description = """
    Executing Python code allows for calculations, chart generation, file processing, and data analysis.
    It supports a variety of libraries including NumPy, Pandas, Matplotlib, and other commonly used ones.
    This is suitable for solving mathematical problems, handling data, and visualizing presentations in various scenarios.
    """
    args_schema: Type[BaseModel] = PythonReplInput
    return_direct = False
    extra_node_data: Any = None

    def _run(
            self,
            code: str
    ) -> str:
        try:
            kernel_id = create_remote_sandbox()
            resp = execute_code(kernel_id, code)
            threading.Thread(target=close_remote_sandbox, args=(kernel_id,)).start()
            del resp['API_KEY']
            if resp['error']:
                raise errors.RequestError(msg=f'代码解释器执行失败，错误信息：{resp["error"]}')
            else:
                del resp['error']
                del resp['logs']['stderr']
            if len(resp['results']) == 0:
                del resp['results']
                del resp['logs']['stderr']
                return str(resp['logs'])
            else:
                del resp['logs']
                return str(resp['results'])
        except Exception as e:
            raise errors.RequestError(msg=f'代码解释器执行失败，错误信息：{str(e)}')

    def bind(self, **kwargs: Any):
        self.extra_node_data = kwargs
        tools_list = self.extra_node_data["tools_list"]
        for tool in tools_list:
            if tool["name"] == self.name:
                self.return_direct = tool['return_direct']
                self.description = tool['description']
