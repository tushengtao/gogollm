import React, {useState} from 'react';
import {Input, Avatar, Card, Flex} from 'antd';
import {CloseOutlined, CopyOutlined, EditOutlined} from '@ant-design/icons';
import './css/NodeBodyCard.less';
import SpeedDial from "@/pages/Ggl/Flow/components/SpeedDial";

const NodeBodyCard: React.FC<any> = ({logo, nodeId, nodeData, setNodeData, editor, children}) => {
    const {Meta} = Card;
    const speedDialActions = [
        {
            icon: <CopyOutlined style={{fontSize: 'large', color: '#1677ff'}}/>,
            name: 'Copy',
            onClick: () => {
                editor.selectElement(nodeId);
                editor.copySelection().then(() => {
                    editor.paste().then(() => {
                        editor.deselectElement(nodeId);
                    });
                });
            },
            angle: 100 // 指定角度
        },
        {
            icon: <CloseOutlined style={{fontSize: 'medium', color: 'red'}}/>,
            name: 'Delete',
            onClick: ()=> editor.deleteNode(nodeId) ,
            angle: 160 // 指定角度
        }
    ];
    const [isEditingNodeName, setIsEditingNodeName] = useState(false);
    return (<Card
            title={
                <Meta
                    style={{height:32}}
                    avatar={<Avatar src={logo}/>}
                    title={
                        <Flex vertical>
                            {isEditingNodeName ? (
                                <Input placeholder="按回车键完成修改" defaultValue={nodeData.nodeName} width={200} variant="outlined"
                                       onMouseLeave={() => {
                                           setIsEditingNodeName(false);
                                       }}
                                       onPressEnter={(e) => {
                                           // @ts-ignore
                                           const nodeName = e.target.value;
                                           const newNodeData = {
                                               ...nodeData,
                                               nodeName: nodeName,
                                           };
                                           setNodeData(newNodeData);
                                           setIsEditingNodeName(false);
                                       }}/>

                            ) : (
                                <span style={{color: 'black', cursor: 'pointer'}}
                                      onClick={() => {
                                          setIsEditingNodeName(true)
                                      }}>
                                     {nodeData.nodeName} <EditOutlined/>
                                    </span>
                            )
                            }
                            <SpeedDial actions={speedDialActions}></SpeedDial>

                        </Flex>
                    }
                />
            }>
            {/*自定义节点表单*/}
            {children}
        </Card>
    );
};

export default NodeBodyCard;
