import React, {FC, useState, useEffect} from 'react';
import {Drawer, Button, Modal} from 'antd';
import {CloseOutlined} from '@ant-design/icons';
import {ProList} from '@ant-design/pro-components';
import ToolForm from "@/pages/Ggl/Flow/tools/ToolForm";
import ElasticSearchIcon from "@/components/Icon/ElasticSearchIcon";
import BailianKnowledgeIcon from "@/components/Icon/BailianKnowledgeIcon";
import PythonReplIcon from "@/components/Icon/PythonReplIcon";
import DuckDuckGoIcon from "@/components/Icon/DuckDuckGoIcon";
import JinaReaderIcon from "@/components/Icon/JinaReaderIcon";

const ToolSelectDrawer: FC<{
    nodeData: any,
    setNodeData: any,
    visible: boolean,
    onClose: () => void,
}> = ({nodeData, setNodeData, visible, onClose}) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [editingTool, setEditingTool] = useState<any | null>(null);

    const all_tool_list = [
        {
            name: 'jina_reader_tool',
            description: '从给定的HTTP/HTTPS网址获取网页的详细内容。 此工具适用于从网页中提取信息。',
            type: 'builtin',
            return_direct: false,
            icon: "JinaReaderIcon",
        },
        {
            name: 'duckduckgo_search_tool',
            description: 'DuckDuckGo是一款浏览器搜索引擎。基于DuckDuckGo搜索引擎的搜索工具。 从网络上获取百科信息、实时或当前信息，如新闻、天气、体育比分等。',
            type: 'builtin',
            return_direct: false,
            max_results:6,
            icon: "DuckDuckGoIcon",
        },
        {
            name: 'python_repl_tool',
            description: '执行Python代码。能够进行计算，生成图表，处理文件，以及进行数据分析。支持多种库，包括NumPy、Pandas、Matplotlib等等常用库。适用于解决数学问题、数据处理、可视化展示等多种场景。',
            type: 'builtin',
            return_direct: false,
            icon: "PythonReplIcon",
        },
        {
            name: 'bailian_knowledge_retrieval_tool',
            description: '百炼知识库检索工具',
            type: 'builtin',
            return_direct: false,
            workspaceId: '',
            indexId: '',
            model_name: "gte-rerank-hybrid",
            rerank_min_score: 0.3,
            save_retriever_history: false,
            icon: "BailianKnowledgeIcon",
        },
        {
            name: 'elasticsearch_search_tool',
            description: 'elasticsearch搜索工具',
            type: 'builtin',
            return_direct: false,
            search_tool_description: '',
            structured_retrieval_table_name: '',
            elasticsearch_index_name: '',
            structuredFieldRetrievalConfig: [],
            elasticsearch_result_deal_code: '',
            icon:  "ElasticSearchIcon",
        }
    ];

    useEffect(() => {
        if (nodeData.tools_list) {
            const initialSelectedKeys = nodeData.tools_list.map((tool: any) => tool.name);
            setSelectedRowKeys(initialSelectedKeys);

            // Update all_tool_list with persisted data from nodeData
            nodeData.tools_list.forEach((tool: any) => {
                const toolIndex = all_tool_list.findIndex((t) => t.name === tool.name);
                if (toolIndex !== -1) {
                    all_tool_list[toolIndex] = {...all_tool_list[toolIndex], ...tool};
                }
            });
        }
    }, [nodeData.tools_list]);
    // @ts-ignore
    const mergeToolLists = (defaultList, userList) => {
        // @ts-ignore
        const defaultMap = new Map(defaultList.map(tool => [tool.name, tool]));
        // @ts-ignore
        userList.forEach(userTool => {
            if (defaultMap.has(userTool.name)) {
                // @ts-ignore
                defaultMap.set(userTool.name, {...defaultMap.get(userTool.name), ...userTool});
            } else {
                defaultMap.set(userTool.name, userTool);
            }
        });

        return Array.from(defaultMap.values());
    };

    const mergedToolList = mergeToolLists(all_tool_list, nodeData.tools_list || []);

    const handleToolSelect = (selectedKeys: React.Key[]) => {
        // @ts-ignore
        const newToolsList = selectedKeys.map(key => mergedToolList.find(tool => tool.name === key)).filter(Boolean);
        setNodeData({
            ...nodeData,
            tools_list: newToolsList,
        });
        setSelectedRowKeys(selectedKeys);
    };

    const handleEditTool = (tool: any) => {
        setEditingTool(tool);
    };

    const handleSaveTool = () => {
        if (editingTool) {
            const updatedToolsList = nodeData.tools_list.map((t: any) =>
                t.name === editingTool.name ? editingTool : t
            );

            setNodeData({
                ...nodeData,
                tools_list: updatedToolsList,
            });

            setEditingTool(null);  // Close the modal after saving
        }
    };

    const getIconComponent = (iconName: string) => {
        switch (iconName) {
            case 'JinaReaderIcon':
                return <JinaReaderIcon />;
            case 'DuckDuckGoIcon':
                return <DuckDuckGoIcon />;
            case 'PythonReplIcon':
                return <PythonReplIcon />;
            case 'BailianKnowledgeIcon':
                return <BailianKnowledgeIcon />;
            case 'ElasticSearchIcon':
                return <ElasticSearchIcon />;
            default:
                return null;
        }
    };

    return (
        <Drawer
            title="选择工具"
            placement="right"
            onClose={() => {
                setNodeData(nodeData);
                onClose();
            }}
            open={visible}
            width="600px"
            closeIcon={<CloseOutlined/>}
            footer={
                <div style={{textAlign: 'right'}}>
                    <Button type="primary" onClick={() => {
                        setNodeData(nodeData);
                        onClose();
                    }}>
                        确定
                    </Button>
                </div>
            }
        >
            <ProList
                rowKey="name"
                // @ts-ignore
                dataSource={mergedToolList}
                metas={{
                    title: {
                        dataIndex: 'name',
                    },
                    avatar: {
                        dataIndex: 'icon',
                        render: (text,record) => getIconComponent(record.icon),
                        editable: false
                    },
                    description: {
                        dataIndex: 'description',
                    },
                    actions: {
                        render: (text, record) => [
                            <a key="edit" onClick={() => handleEditTool(record)}>
                                编辑
                            </a>,
                        ],
                    },
                }}
                rowSelection={{
                    selectedRowKeys,
                    onChange: handleToolSelect,
                }}
                cardBordered
            />

            <Modal
                title="编辑工具"
                open={!!editingTool}
                onCancel={() => setEditingTool(null)}
                onOk={handleSaveTool}  // Call handleSaveTool to save changes
            >
                {editingTool && (
                    <ToolForm
                        editingTool={editingTool}
                        // @ts-ignore
                        onValuesChange={(changedValues, allValues) => {
                            setEditingTool({...editingTool, ...allValues});
                        }}
                        setEditingTool={setEditingTool}
                    />
                )}
            </Modal>
        </Drawer>
    );
};

export default ToolSelectDrawer;
