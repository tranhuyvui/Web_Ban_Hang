import api from '../services/axios';

export const authService = {
  async login(username: string, password: string): Promise<any> {
    try {
      const res = await api.post('/auth/login', {
        Username: username,
        Password: password
      });
      return res.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Đăng nhập thất bại!!';
      throw new Error(msg)
    }
  },

  async registerAccount(FullName: string, Username: string, Password: string, Email: string) {
    try {
      const res = await api.post('/auth/register', {
        Username,
        FullName,
        Password,
        Email
      });
      return res.data;
    } catch (err: any) {
      throw err.response?.data?.message;
    }
  },

  async verifyOtpRegister(OTP: string) {
    try {
      const res = await api.post('/auth/register/verify', { OTP: OTP });
      return res;
    } catch (err: any) {
      throw err.response?.data?.message;
    }
  },
  async  verifyOtpFotgot(OTP: string) {
    try {
      const res = await api.post('/auth/forgot-password/verify', { OTP });
      return res;
    } catch (err: any) {
      throw err.response?.data?.message;
    }
  },
  async resetPassword(Password: string) {
    try {
      await api.post('/auth/reset-password', {
        Password: Password
      })
    } catch (err : any) {
      const msg = err.response?.data.message || 'Lỗi đặt lại mật khẩu'
      throw new Error(msg);
    }
  },
  async sendOtpForgot(Email: string) {
    try {
      await api.post('/auth/forgot-password', {
        Password: Email
      })
    } catch (err : any) {
      const msg = err.response?.data.message || 'Lỗi đặt lại mật khẩu'
      throw new Error(msg);
    }
  }
};
