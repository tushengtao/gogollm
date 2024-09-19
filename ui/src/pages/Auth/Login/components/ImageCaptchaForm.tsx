import services from '@/services/system/auth';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { Flex, Image } from 'antd';
import React, { useEffect, useState } from 'react';

const { captcha } = services.AuthRequest;
const ImageCaptchaForm = () => {
  const [captchaSrc, setCaptchaSrc] = useState('');
  const fetchCaptcha = async () => {
    try {
      const base64Data = await captcha();
      setCaptchaSrc(`data:image/png;base64,${base64Data}`);
    } catch (error) {
      console.error('Failed to fetch captcha:', error);
    }
  };

  useEffect(() => {
    // 组件挂载时获取验证码
    fetchCaptcha().then(() => {
    });
  }, []);

  const handleCaptchaClick = () => {
    fetchCaptcha().then(() => {
    });
  };

  return (
    <Flex gap="middle">
      <ProForm.Item
        name="captcha"
        rules={[{ required: true, message: '请输入验证码' }]}
      >
        <ProFormText
          name="captcha"
          placeholder="请输入验证码"
          fieldProps={{
            style: { height: '38px' },
          }}
        />
      </ProForm.Item>
      <ProForm.Item shouldUpdate>
        {() => (
          <div>
            <Image
              style={{ width: '110px' }}
              src={captchaSrc}
              onClick={handleCaptchaClick}
              preview={false}
            />
          </div>
        )}
      </ProForm.Item>
    </Flex>
  );
};

export default ImageCaptchaForm;
