import React, { useEffect } from 'react';
import { Form } from 'antd';
import BailianKnowledgeRetrievalForm from "@/pages/Ggl/Flow/tools/form/BailianKnowledgeRetrievalForm";
import JinaReaderForm from "@/pages/Ggl/Flow/tools/form/JinaReaderForm";
import DuckDuckGoSearchForm from "@/pages/Ggl/Flow/tools/form/DuckDuckGoSearchForm";
import PythonReplForm from "@/pages/Ggl/Flow/tools/form/PythonReplForm";
import ElasticsearchSearchForm from "@/pages/Ggl/Flow/tools/form/ElasticsearchSearchForm";

// @ts-ignore
const ToolForm = ({ editingTool, onValuesChange, setEditingTool }) => {
    const [form] = Form.useForm();

    // 当 `tool` 变化时，更新表单字段的值
    useEffect(() => {
        form.setFieldsValue(editingTool);
    }, [editingTool, form]);

    return (
        <div>
            {editingTool.name === 'jina_reader_tool' && (
                <>
                    <JinaReaderForm editingTool={editingTool} onValuesChange={onValuesChange}></JinaReaderForm>
                </>
            )}
            {editingTool.name === 'duckduckgo_search_tool' && (
                <>
                    <DuckDuckGoSearchForm editingTool={editingTool} onValuesChange={onValuesChange}></DuckDuckGoSearchForm>
                </>
            )}

            {editingTool.name === 'python_repl_tool' && (
                <>
                    <PythonReplForm editingTool={editingTool} onValuesChange={onValuesChange}></PythonReplForm>
                </>
            )}

            {editingTool.name === 'bailian_knowledge_retrieval_tool' && (
                <>
                    <BailianKnowledgeRetrievalForm editingTool={editingTool} onValuesChange={onValuesChange}></BailianKnowledgeRetrievalForm>
                </>
            )}
            {editingTool.name === 'elasticsearch_search_tool' && (
                <>
                    <ElasticsearchSearchForm editingTool={editingTool} onValuesChange={onValuesChange} setEditingTool={setEditingTool}></ElasticsearchSearchForm>
                </>
            )}
        </div>
    );
};

export default ToolForm;
