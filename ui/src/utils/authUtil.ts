import logo from '@/assets/icon/logo.png';
import { TOKEN_KEY, USERINFO_KEY } from '@/constants';

const isLogin = () => {
  return !!localStorage.getItem(TOKEN_KEY);
};

const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERINFO_KEY);
};

const getUserInfo = () => {
  const userInfoStr = localStorage.getItem(USERINFO_KEY);
  const user = {
    userInfo: {
      username: 'GOGOLLM',
      avatar: logo,
    },
    access: {},
  };
  return userInfoStr ? JSON.parse(userInfoStr) : user;
};

const setUerInfo = (userinfo: any) => {
  localStorage.setItem(USERINFO_KEY, JSON.stringify(userinfo));
};

export { isLogin, getToken, setToken, clearToken, setUerInfo, getUserInfo };
