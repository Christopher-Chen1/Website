import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserStore } from './store/userStore';
import { authorizedUsers } from './config/permissions';

interface PrivateRouteProps {
  element: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const { userInfo } = useUserStore();
  const accessToken = sessionStorage.getItem('access_token');

  if (!accessToken) {
    // console.log('🔴 No access token, redirecting to /login');
    return <Navigate to="/login" />;
  }

  if (!userInfo) {
    // console.log('🟡 No userInfo yet, showing loading...');
    return <h5></h5>;
  }

  const normalizedUsername = userInfo.username?.toLowerCase();
  const normalizedAuthList = authorizedUsers.map(u => u.toLowerCase());

  // console.log('🔵 Normalized username:', normalizedUsername);
  // console.log('🟣 Normalized authorized users:', normalizedAuthList);
  // console.log('🔵 Zustand store userInfo:', useUserStore.getState().userInfo);

  if (!normalizedAuthList.includes(normalizedUsername)) {
    // console.log('🚫 User is not authorized, redirecting to /noaccess');
    return <Navigate to="/noaccess" />;
  }

  // console.log('✅ User authorized, rendering page');
  return element;
};

export default PrivateRoute;
