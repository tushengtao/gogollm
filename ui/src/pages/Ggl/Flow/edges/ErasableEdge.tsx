import React, {useCallback} from 'react';
import {CloseOutlined} from "@ant-design/icons";
import {BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath, useFlowEditor} from '@ant-design/pro-flow';
import styles from './css/ErasableEdge.less';

export default function ErasableEdge({
                                         id,
                                         sourceX,
                                         sourceY,
                                         targetX,
                                         targetY,
                                         sourcePosition,
                                         targetPosition,
                                         style = {},
                                         markerEnd,
                                     }: EdgeProps) {
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });
    const editor = useFlowEditor();
    // 点击边删除事件
    const onEdgeClick = useCallback((event: { stopPropagation: () => void; }, id: string) => {
        editor.deleteEdge(id)
        event.stopPropagation();
    }, [editor]);
    return (
        <>
            <BaseEdge path={edgePath} markerEnd={markerEnd} style={style}/>
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        fontSize: 12,
                        pointerEvents: 'all',
                    }}
                    className="nodrag nopan"
                >
                    <CloseOutlined className={styles.edgebutton}
                                   onClick={(event) => onEdgeClick(event, id)}/>
                </div>
            </EdgeLabelRenderer>
        </>
    );
}
