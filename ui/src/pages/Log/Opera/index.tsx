import React from 'react';
import OperaLogTable from './OperaLogTable';
import {PageContainer} from "@ant-design/pro-components";
const TableList = () => {
  return (
      <PageContainer
          pageHeaderRender={false}
      >

          <OperaLogTable />
      </PageContainer>
  );
};
export default TableList;
