import React, {useState} from 'react';
import {history, useModel} from '@umijs/max';
import {message, Tabs, theme} from 'antd';
import {LockOutlined, MobileOutlined,UserOutlined} from '@ant-design/icons';
import {LoginFormPage, ProConfigProvider, ProFormCaptcha, ProFormText} from '@ant-design/pro-components';
import ImageCaptchaForm from '@/pages/Auth/Login/components/ImageCaptchaForm';
import {setToken, setUerInfo} from '@/utils/authUtil';
import logo from '@/assets/imgs/logo.jpg';
import background_video from '@/assets/video/background_video.mp4';
import "./css/index.less"
import services from '@/services/system/auth';

const {login, getUserAccess} = services.AuthRequest;

type LoginType = 'account' | 'phone';

const Page = () => {
    const {initialState, setInitialState} = useModel('@@initialState');
    const [loginType, setLoginType] = useState<LoginType>('account');
    const {token} = theme.useToken();
    const items = [
        {label: '账户密码登录', key: 'account'},
        {label: '手机号登录', key: 'phone'},
    ];

    const onSubmit = async (params: any) => {
        const resp = await login({
            username: params.username,
            password: params.password,
            captcha: params.captcha,
        })
        setToken(resp.data.access_token);
        const accessResp = await getUserAccess();
        setInitialState({
            ...initialState,
            userInfo: resp.data.user,
            access: accessResp.data,
        });
        setUerInfo({
            userInfo: resp.data.user,
            access: accessResp.data,
        });
        message.success('登录成功');
        history.push('/');
    };
    return (
        <div
            style={{
                height: '100vh'
            }}
        >
            <LoginFormPage
                initialValues={{
                    username: '',
                    password: '',
                    captcha: '',
                }}
                onFinish={onSubmit}
                logo={logo}
                backgroundVideoUrl={background_video}
                title="GoGoLLM"
                containerStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(8px)',
                }}
                subTitle="开发者优先的面向企业级LLM应用研发平台"
                // activityConfig={{
                //     style: {
                //         boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.2)',
                //         color: token.colorTextHeading,
                //         borderRadius: 8,
                //         backgroundColor: 'rgba(255,255,255,0.25)',
                //         backdropFilter: 'blur(4px)',
                //     },
                //     title: '活动标题，可配置图片',
                //     subTitle: '活动介绍说明文字',
                //     action: (
                //         <Button
                //             size="large"
                //             style={{
                //                 borderRadius: 20,
                //                 background: token.colorBgElevated,
                //                 color: token.colorPrimary,
                //                 width: 120,
                //             }}
                //         >
                //             去看看
                //         </Button>
                //     ),
                // }}
            >
                <Tabs
                    items={items}
                    centered
                    activeKey={loginType}
                    onChange={(activeKey) => setLoginType(activeKey as LoginType)}
                ></Tabs>
                {loginType === 'account' && (
                    <>
                        <ProFormText
                            name="username"
                            fieldProps={{
                                size: 'large',
                                prefix: (
                                    <UserOutlined
                                        style={{
                                            color: token.colorText,
                                        }}
                                        className={'prefixIcon'}
                                    />
                                ),
                            }}
                            placeholder={'请输入用户名'}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入用户名!',
                                },
                            ]}
                        />
                        <ProFormText.Password
                            name="password"
                            fieldProps={{
                                size: 'large',
                                prefix: (
                                    <LockOutlined
                                        style={{
                                            color: token.colorText,
                                        }}
                                        className={'prefixIcon'}
                                    />
                                ),
                            }}
                            placeholder={'请输入密码'}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入密码！',
                                },
                            ]}
                        />
                        <ImageCaptchaForm></ImageCaptchaForm>
                    </>
                )}
                {loginType === 'phone' && (
                    <>
                        <ProFormText
                            fieldProps={{
                                size: 'large',
                                prefix: (
                                    <MobileOutlined
                                        style={{
                                            color: token.colorText,
                                        }}
                                        className={'prefixIcon'}
                                    />
                                ),
                            }}
                            name="mobile"
                            placeholder={'手机号'}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入手机号！',
                                },
                                {
                                    pattern: /^1\d{10}$/,
                                    message: '手机号格式错误！',
                                },
                            ]}
                        />
                        <ProFormCaptcha
                            fieldProps={{
                                size: 'large',
                                prefix: (
                                    <LockOutlined
                                        style={{
                                            color: token.colorText,
                                        }}
                                        className={'prefixIcon'}
                                    />
                                ),
                            }}
                            captchaProps={{
                                size: 'large',
                            }}
                            placeholder={'请输入验证码'}
                            captchaTextRender={(timing, count) => {
                                if (timing) {
                                    return `${count} ${'获取验证码'}`;
                                }
                                return '获取验证码';
                            }}
                            name="captcha"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入验证码！',
                                },
                            ]}
                            onGetCaptcha={async () => {
                            }}
                        />
                    </>
                )}
            </LoginFormPage>
        </div>
    );
};

export default () => {
    return (
        <ProConfigProvider dark>
            <Page/>
        </ProConfigProvider>
    );
};
