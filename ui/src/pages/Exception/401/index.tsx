import React from 'react';
import { Result, Button } from 'antd';
import { history } from '@umijs/max';
import Unauthorized from "antd/es/result/unauthorized";

const NoPermissionPage = () => {
    const goLogin = () => {
        // 去登录
        history.push('/login');
    };

    return (
        <Result
            title="401"
            icon={<Unauthorized />}
            subTitle="抱歉，请登陆后访问。"
            extra={
                <Button type="primary" onClick={goLogin}>
                    去登录
                </Button>
            }
        />
    );
};

export default NoPermissionPage;
