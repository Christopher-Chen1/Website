import { create } from 'zustand';

// 定义 userInfo 的类型
type UserInfo = { [key: string]: string };

// Store 类型定义
interface UserStore {
  userInfo: UserInfo | null;
  setUserInfo: (info: UserInfo) => void;
  clearUserInfo: () => void;
}

// 从 sessionStorage 获取 user_info
const storedUserInfo = sessionStorage.getItem('user_info');
const initialUserInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null;

export const useUserStore = create<UserStore>((set) => ({
  userInfo: initialUserInfo, // 使用初始化值
  setUserInfo: (info: UserInfo) => {
    sessionStorage.setItem('user_info', JSON.stringify(info)); // 存储到 sessionStorage
    set({ userInfo: info });
  },
  clearUserInfo: () => {
    sessionStorage.removeItem('user_info');
    set({ userInfo: null });
  },
}));
