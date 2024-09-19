import React from 'react';
import {Input, Space} from 'antd';
import DynamicInputVariable from "@/pages/Ggl/Flow/components/DynamicInputVariable";
import DynamicOutputVariable from "@/pages/Ggl/Flow/components/DynamicOutputVariable";
import CodeEditorModal from "@/pages/Ggl/Flow/components/CodeEditorModal";
import GoGoLLMSelect from '@/pages/Ggl/Flow/components/GoGoLLMSelect';

export const HttpNodeForm: React.FC<{
    nodeId: string;
    editor: any;
    nodeData: any;
    setNodeData: any;
}> = ({nodeData, setNodeData}) => {
    return (
        <Space direction="vertical" style={{width: '100%', position: 'relative',}}>
            <Space>
                <div style={{width: '100px', textAlign: 'center', fontSize: '15px'}}>
                    <label>Method</label>
                    <GoGoLLMSelect
                        width={120}
                        isMultifun={false}
                        options={[{label: 'GET', value: 'GET'}, {label: 'POST', value: 'POST'}]}
                        placeholder="请求方法"
                        defaultValue={nodeData.method || 'GET'}
                        onChange={(label:any, value: any) => {
                            setNodeData({
                                ...nodeData,
                                method: value,
                            });
                        }}
                    />
                </div>
                <div style={{textAlign: 'center', fontSize: '15px', position: 'absolute', top: '0px', right: '0px'}}>
                    <label>Headers</label>
                    <CodeEditorModal
                        modalWidth={'50%'}
                        value={nodeData.headers}
                        language='json'
                        onChange={(codeValue: any) =>
                            setNodeData({
                                ...nodeData,
                                headers: codeValue,
                            })
                        }
                    />
                </div>
            </Space>

            <div style={{textAlign: 'center', fontSize: '15px', marginBottom: '15px'}}>
                <label>Base URL</label>
                <Input value={nodeData.base_url} placeholder="请输入base_url" onChange={(e) => {
                    setNodeData({
                        ...nodeData,
                        base_url: e.target.value,
                    });
                }}/>
            </div>

            <div>
                <DynamicInputVariable nodeData={nodeData} setNodeData={setNodeData} buttonName="添加输入变量"/>
            </div>

            <div>
                <label>请求参数 &nbsp;(GET: query、&nbsp;&nbsp;POST: body)</label>
                <CodeEditorModal
                    modalWidth={'50%'}
                    value={nodeData.requestParams}
                    language='json'
                    onChange={(codeValue: any) =>
                        setNodeData({
                            ...nodeData,
                            requestParams: codeValue,
                        })
                    }
                /></div>


            <DynamicOutputVariable nodeData={nodeData} setNodeData={setNodeData} buttonName="添加输出变量和解析"/>
        </Space>
    );
};
