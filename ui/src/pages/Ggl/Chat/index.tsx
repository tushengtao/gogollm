import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { useLocation } from "@@/exports";

import { Chat } from "@/pages/Ggl/Chat/components/Chat";

export default () => {
    const location = useLocation();
    // @ts-ignore
    const {id, name} = location.state

    return (
        <PageContainer pageHeaderRender={false}
                       token={{
                           paddingBlockPageContainerContent: 0,
                           paddingInlinePageContainerContent: 0,
                       }}
        >

            <Chat appId={id} name={name}></Chat>
        </PageContainer>
    );
};
