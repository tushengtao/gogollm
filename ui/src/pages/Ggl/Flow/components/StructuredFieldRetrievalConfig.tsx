import { uuid } from '@ant-design/pro-flow/es/FlowEditor/utils/uuid';
import { Button, Form, Space } from 'antd';
import React from 'react';
import StructuredFieldRetrievalItem from "@/pages/Ggl/Flow/components/StructuredFieldRetrievalItem";

const StructuredFieldRetrievalConfig: React.FC<{
  nodeData: any;
  setNodeData: any;
  buttonName: string;
}> = ({ nodeData, setNodeData, buttonName }) => {
  const { structuredFieldRetrievalConfig } = nodeData;
  const retrieval_methods = [
    { label: '语义', value: 'vector' },
    { label: '语义+重排', value: 'vector+reranker' },
    { label: 'ES', value: 'es' },
    { label: 'ES+重排', value: 'es+reranker' },
    { label: '不检索召回', value: 'none' }
  ];

  const add = () => {
    setNodeData({
      ...nodeData,
      structuredFieldRetrievalConfig: [
        ...structuredFieldRetrievalConfig,
        {
          id: uuid(),
          name: '',
          field_preprocess_code: '',
          genertate_field_dsl_code: '',
          retrieval_method: 'vector',
          retrieval_count: 3,
          similarity_threshold_min: 0.3,
        },
      ],
    });
  };

  const handleInputChange = (cid: string, field: string, event: any) => {
    setNodeData({
      ...nodeData,
      structuredFieldRetrievalConfig: structuredFieldRetrievalConfig.map(
          (variable: { id: string }) =>
              variable.id === cid
                  ? { ...variable, [field]: event.target.value }
                  : variable,
      ),
    });
  };

  const remove = (id: string) => {
    const newConfig = structuredFieldRetrievalConfig.filter(
        (variable: { id: string }) => variable.id !== id,
    );
    setNodeData({
      ...nodeData,
      structuredFieldRetrievalConfig: newConfig,
    });
  };

  return (
      <Form style={{ width: '100%' }}>
        <Space direction="vertical">
          {structuredFieldRetrievalConfig.map(
              (variable: {
                id: string;
                name: string;
                field_preprocess_code: string;
                genertate_field_dsl_code: string;
                retrieval_method: string;
                retrieval_count: number;
                similarity_threshold_min: number;
              }) => (
                  <StructuredFieldRetrievalItem
                      key={variable.id}
                      variable={variable}
                      handleInputChange={handleInputChange}
                      retrieval_methods={retrieval_methods}
                      remove={() => remove(variable.id)}
                  />
              ),
          )}
        </Space>
        <Form.Item>
          <Button type="dashed" onClick={add} style={{ width: '100%' }}>
            {buttonName}
          </Button>
        </Form.Item>
      </Form>
  );
};
export default StructuredFieldRetrievalConfig;
