import React from 'react';
import {useLocation} from '@umijs/max';
import {PageContainer} from '@ant-design/pro-components';
import {FlowEditorProvider} from '@ant-design/pro-flow';
import AppFlow from './AppFlow'

const FlowPage: React.FC = () => {
    const location = useLocation();
    const id: any = location.state;
    return (
        <div style={{height: '100vh', width: '100vw', padding: 0, margin: 0}}>
            <FlowEditorProvider>
                <AppFlow appId={id}/>
            </FlowEditorProvider>
        </div>

    );
};
export default () => {
    return (
        <PageContainer pageHeaderRender={false}
                       token={{
                           paddingBlockPageContainerContent: 0,
                           paddingInlinePageContainerContent: 0,
                       }}
        >
            <FlowPage/>
        </PageContainer>
    );
};
