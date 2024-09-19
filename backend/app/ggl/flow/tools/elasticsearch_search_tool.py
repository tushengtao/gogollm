import time
from typing import Any
import concurrent.futures
from langchain_core.tools import BaseTool
from langfuse.callback import CallbackHandler
from backend.common.log import log
from backend.app.ggl.flow.tools.help.elasticsearch_agent_tool_helper import es_search, strip_quotes, \
    retrieval_field_custom_local_deal, genertate_field_dsl_deal, es_search_result_deal
from backend.app.ggl.flow.retrieve.retrieve import vector_retrieve


class ElasticSearchSearchTool(BaseTool):
    name = "elasticsearch_search_tool"
    description = ""
    # 调用工具之后是否直接返回 True 如果继续执行Agent的流程 False
    return_direct = False
    # tool 绑定的额外参数
    extra_node_data: Any = None

    def _run(
            self,
            user_query: str
    ) -> str:
        structured_field_retrieval_config_list = self.extra_node_data["structuredFieldRetrievalConfig"]
        question = user_query
        log.info(f"es agent 传递的查询问题：{question}")
        session_id = self.extra_node_data["session_id"]
        user_id = self.extra_node_data["user_id"]
        app_id = self.extra_node_data["app_id"]
        app_name = self.extra_node_data["app_name"]
        elasticsearch_result_deal_code = self.extra_node_data["elasticsearch_result_deal_code"]

        start_time = time.time()
        # 1. 检索字段代码预处理 获取检索字段的关键词
        retrieval_field_custom_deal_results = {}
        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            futures = []
            for field_item in structured_field_retrieval_config_list:
                field_name = field_item['name']
                field_preprocess_code = field_item['field_preprocess_code']
                variables = {
                    "question": question,
                    "field_name": field_name
                }
                future = executor.submit(retrieval_field_custom_local_deal, field_preprocess_code, variables)
                futures.append(future)
            for future in concurrent.futures.as_completed(futures):
                result = future.result()
                retrieval_field_custom_deal_results[result['field_name']] = result['result']
                log.info(f"检索字段-自定义代码前置处理结果 : {result['field_name']}: {result['result']}")

        end_time = time.time()
        elapsed_time = end_time - start_time
        log.info(f"1.检索字段-自定义代码处理代码耗时: {elapsed_time} 秒")
        # 每个字段根据自定义代码处理后 query 根据配置的检索表和检索方式去检索召回相似性列表
        retrieval_table_name = self.extra_node_data["structured_retrieval_table_name"]
        elasticsearch_index_name = self.extra_node_data["elasticsearch_index_name"]

        start_time = time.time()
        # 2. 检索字段-检索的相似性结果列表
        retrieve_field_similarity_result = {}
        with concurrent.futures.ThreadPoolExecutor() as executor:
            futures = []
            for item in structured_field_retrieval_config_list:
                field_name = item['name']
                retrieval_count = item['retrieval_count']
                deal_field_value = retrieval_field_custom_deal_results[field_name]
                options = {
                    'select_table': retrieval_table_name,
                    'content': deal_field_value,
                    'retrieval_count': retrieval_count,
                    'field_name': field_name,
                    'elasticsearch_index_name': elasticsearch_index_name
                }
                if deal_field_value not in [None, '']:
                    f = executor.submit(vector_retrieve, options, item['retrieval_method'])
                    futures.append(f)
            for future in concurrent.futures.as_completed(futures):
                retrieve_field_similarity_result[future.result()['field_name']] = future.result()['data']
                log.info(f"检索字段-检索相似性结果 : {future.result()['field_name']}: {future.result()['data']}")
        end_time = time.time()
        elapsed_time = end_time - start_time
        log.info(f"2.检索字段-检索相似性 代码耗时: {elapsed_time} 秒")

        for key in retrieval_field_custom_deal_results:
            if key not in retrieve_field_similarity_result:
                retrieve_field_similarity_result[key] = []

        for field_name in retrieve_field_similarity_result:
            item_list = retrieve_field_similarity_result[field_name]
            new_list = []
            similarity_threshold_min = 0.05
            for item in structured_field_retrieval_config_list:
                retrieval_config_field_name = item['name']
                if retrieval_config_field_name == field_name:
                    similarity_threshold_min = item['similarity_threshold_min']
            for item in item_list:
                if item.get('score') >= similarity_threshold_min:
                    new_list.append(item.get('content'))
            retrieve_field_similarity_result[field_name] = new_list

        # 3. 生成每个字段查询的dsl 最后组合生成dsl
        start_time = time.time()
        query_dsl = {
            "query": {
                "bool": {
                    "must": []
                }
            },
            "size": 3  # TODO 前台可配置
        }
        retrieve_field_dsl_result = {}  # key:字段名  value: [dsl]
        with concurrent.futures.ThreadPoolExecutor() as executor:
            futures = []
            for item in structured_field_retrieval_config_list:
                field_name = item['name']
                retrieve_field_similarity_list = retrieve_field_similarity_result[field_name]
                log.info(f"检索字段-根据相似性阈值分数过滤后的列表: {field_name}: {retrieve_field_similarity_list}")
                if len(retrieve_field_similarity_list) > 0:
                    genertate_field_dsl_code = item['genertate_field_dsl_code']

                    langfuse_handler = CallbackHandler(session_id=session_id,
                                                       user_id=user_id,
                                                       trace_name=str(app_id) + '_' +
                                                                  app_name + '_' +
                                                                  'field_dsl_generate' + '_' + field_name,
                                                       timeout=6)
                    chain_config = {
                        "callbacks": [langfuse_handler],
                        "configurable": {"session_id": session_id},
                        "app_type": 0  # 智能体
                    }
                    variables = {
                        "question": question,
                        "field_name": field_name,
                        "retrieve_field_similarity_list": retrieve_field_similarity_list,
                        "chain_config": chain_config
                    }
                    future = executor.submit(genertate_field_dsl_deal, genertate_field_dsl_code, variables)
                    futures.append(future)

            for future in concurrent.futures.as_completed(futures):
                result = future.result()
                retrieve_field_dsl_result[result['field_name']] = result['result']
        # 组合各个字段dsl
        for field_name, dsl_list in retrieve_field_dsl_result.items():
            query_dsl["query"]["bool"]["must"].extend(dsl_list)
        end_time = time.time()
        elapsed_time = end_time - start_time
        log.info(f"3. 生成每个字段查询的dsl 代码耗时: {elapsed_time} 秒")

        log.info("合并的检索DSL ：" + str(query_dsl))

        # 4. 进行es检索 并且处理结果
        if len(query_dsl["query"]["bool"]["must"]) > 0:
            es_search_result = es_search(elasticsearch_index_name, query_dsl)
            if len(es_search_result) < 1:
                # TODO 告诉用户 智能搜索理解到的查询意图 将top one的各个字段的检索召回结果返回给用户 进一步说明
                # TODO 说明目前意图解析出的查询条件
                return "抱歉我未检索到，我完全理解您的搜索意图，但是目前无法检索到，可以尝试减少搜索条件、换个搜索词试试？"
            else:
                with concurrent.futures.ThreadPoolExecutor() as executor:
                    future = executor.submit(es_search_result_deal, es_search_result, elasticsearch_result_deal_code)
                    exec_result = future.result()
                    deal_result = exec_result['result']
                    result = strip_quotes(deal_result)
                    return result.replace("\\n", "\n")
        else:
            return "很抱歉，我目前在此领域还在学习中...... 某些别称和黑话不太明白，我未检索到，请尽量输入符合行业规范的词语描述您的搜索需求，我一定尽力满足您的需求，再试一次吧！"

    def bind(self, **kwargs: Any):
        self.extra_node_data = kwargs
        if self.extra_node_data.get("search_tool_description", None) is None:
            tools_list = self.extra_node_data.get("tools_list", [])
            for tool in tools_list:
                if tool["name"] == "elasticsearch_search_tool":
                    self.return_direct = tool.get("return_direct", False)
                    self.description = tool.get("search_tool_description")
                    self.extra_node_data["elasticsearch_index_name"] = tool.get("elasticsearch_index_name")
                    self.extra_node_data["structured_retrieval_table_name"] = tool.get("structured_retrieval_table_name", '')
                    self.extra_node_data["structuredFieldRetrievalConfig"] = tool.get("structuredFieldRetrievalConfig", [])
                    self.extra_node_data["elasticsearch_result_deal_code"] = tool.get("elasticsearch_result_deal_code", '')
                    break
        else:
            self.return_direct = self.extra_node_data.get("return_direct", False)
            self.description = self.extra_node_data["search_tool_description"]
