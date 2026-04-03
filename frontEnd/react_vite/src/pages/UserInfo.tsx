import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';  // 导入 Zustand store
import { DisplayUserInfo } from './DisplayUserInfo';

export const UserInfo = () => {
  const navigate = useNavigate();
  const { userInfo } = useUserStore();  // 使用 Zustand store 获取用户信息
  const accessToken = sessionStorage.getItem('access_token');

  useEffect(() => {
    // 如果没有 accessToken，跳转到登录页面
    if (!accessToken) {
      navigate('/login');
      return;
    }

    // 如果没有用户信息且没有从 Zustand 获取到，跳转到加载状态
    if (!userInfo) {
      console.log('');
    }
  }, [accessToken, navigate, userInfo]);

  return (
    <div>
      {userInfo ? <DisplayUserInfo userInfo={userInfo} /> : <h5>Loading user info...</h5>}
    </div>
  );
};
