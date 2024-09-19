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
            status="500"
            title="500"
            subTitle="抱歉，服务端出了点问题。"
            extra={
                <Button type="primary" onClick={goBack}>
                    返回
                </Button>
            }
        />
    );
};

export default NoPermissionPage;
