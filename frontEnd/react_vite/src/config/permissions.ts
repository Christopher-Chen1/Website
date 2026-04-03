// src/config/permissions.ts

// 定义授权用户的邮箱列表，统一使用小写
export const authorizedUsers = ['christopher.Chen1@DELL.com', 
                                'Larry.Xu@Dell.com', 
                                'Jenny.Zhuang@dell.com',
                                'Jercky.Peng@DELL.com',
                              'Peter.Abendschein@dell.com',
                              'Zulkhairi.Zakaria@dell.com',
                              'Brian.Ahern@dell.com',
                              'Frank.Sarsfield@dell.com',
                              'Jared.Horne@Dell.com',
                              'Jose.Rodriguez@dell.com',
                              'Robin.Murphy@dell.com',
                              'Weiming.Li@dellteam.com',
                              'Bean_Zhao@Dell.com',
                              'Gim.Theng.Yeoh@dell.com',
                              'Fintan_Hynes@dell.com',
                              'Robert.T.Ramirez@dell.com',
                              'Hoay_Cheen_Teoh@dell.com',
                              'Dillon.Sigler@dell.com',
                              'Nor.Farhana.Ahmad@dell.com'];  // 小写格式

// 示例：根据角色管理权限
export const roles = {
  admin: ['admin@example.com'],
  user: ['christopher.chen1@dell.com'],
  guest: ['guest@example.com'],
};

// 函数：检查用户名是否属于某个角色，忽略大小写
export const hasRole = (username: string, role: keyof typeof roles): boolean => {
  return roles[role].some((roleEmail) => roleEmail.toLowerCase() === username.toLowerCase());
};
