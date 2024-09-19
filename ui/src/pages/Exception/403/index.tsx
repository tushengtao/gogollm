import React from 'react';
import { Result, Button } from 'antd';
import { history } from '@umijs/max';

const NoPermissionPage = () => {
    const goBack = () => {
        // 这里可以定义用户点击按钮后的行为，例如返回上一页或者跳转到主页
        history.back();
    };

    return (
        <Result
            status="403"
            title="403"
            subTitle="抱歉，你无权访问该页面。"
            extra={
                <Button type="primary" onClick={goBack}>
                    返回
                </Button>
            }
        />
    );
};

export default NoPermissionPage;
