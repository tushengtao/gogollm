import React from 'react';
import {Avatar, Card, Flex} from "antd";
import {Handle, Position, useFlowEditor} from '@ant-design/pro-flow';
import {CloseOutlined, CopyOutlined} from "@ant-design/icons";
import logo from '@/assets/imgs/ChatEntryNode.png';
import {uuid} from "@ant-design/pro-flow/es/FlowEditor/utils/uuid";
import SpeedDial from "@/pages/Ggl/Flow/components/SpeedDial";

export const ChatEntryNode: React.FC = (node: any) => {
    const editor = useFlowEditor();
    const {id, data, selected} = node;
    const speedDialActions = [
        {
            icon: <CopyOutlined style={{fontSize: 'large', color: '#1677ff'}}/>,
            name: 'Copy',
            onClick: () => {
                editor.selectElement(id);
                editor.copySelection().then(() => {
                    editor.paste().then(() => {
                        editor.deselectElement(id);
                    });
                });
            },
            angle: 90 // 指定角度
        },
        {
            icon: <CloseOutlined style={{fontSize: 'medium', color: 'red'}}/>,
            name: 'Delete',
            onClick: ()=> editor.deleteNode(id) ,
            angle: 140 // 指定角度
        }
    ];
    const {Meta} = Card;
    return (
        <div>
            <Card title={
                <Meta
                    avatar={<Avatar src={logo}/>}
                    title={
                        < Flex vertical>
                            <span style={{color: "black"}}>问题入口</span>
                            <SpeedDial actions={speedDialActions}></SpeedDial>
                        </Flex>
                    }/>
            }
                  style={{width: 220, height: 55, border: "1px solid #1677ff", borderRadius: "10px"}}
            >
            </Card>

            <Handle
                key={uuid()}
                id={id}
                type={'source'}
                position={Position.Right}
            />
        </div>
    );
};
