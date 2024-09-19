import { PageContainer } from '@ant-design/pro-components';
import {useAccess } from '@umijs/max';
import React from 'react';
import {CreateTableForm} from '../DataSet/components/CreateTableForm'
const DataSetPage: React.FC = () => {
    const access = useAccess();
    return (
        <PageContainer
            ghost
            pageHeaderRender={false}
        >
            {/*<Access accessible={access.xxx}>*/}
            {/*  <Button>只有 xxx权限 可以看到这个按钮</Button>*/}
            {/*</Access>*/}

            <CreateTableForm></CreateTableForm>
        </PageContainer>
    );
};

export default DataSetPage;
