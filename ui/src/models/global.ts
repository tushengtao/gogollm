// 全局共享数据
import { useState } from 'react';

const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState<API_User.UserInfo>();
  return {
    userInfo,
    setUserInfo,
  };
};
export default useUserInfo ;

