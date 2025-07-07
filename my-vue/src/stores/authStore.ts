import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authService } from '@/services/authService'
import { useCartStore } from './cartStore'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const role = ref('')
  const fullname = ref('')


  const initFromStorage = () => {
    const token = localStorage.getItem('token') || ''
    isLoggedIn.value = !!token
    fullname.value = localStorage.getItem('fullname') || ''
    role.value = localStorage.getItem('Role') || ''
  }

  const logout = () => {
    isLoggedIn.value = false
    role.value = ''
    fullname.value = ''

    localStorage.removeItem('token')
    localStorage.removeItem('Role')
    localStorage.removeItem('fullname')
    localStorage.removeItem('address')
    localStorage.removeItem('phone')

    const cartStore = useCartStore()
    cartStore.carts = []
    cartStore.fetchCarts()
  }
  const login = async (username: string, password: string): Promise<void> => {
    try {
      
      const res = await authService.login(username, password)
      const token = res.token
      const userRole = res.Role
      const userFullname = res.FullName
  
      localStorage.setItem('token', token)
      localStorage.setItem('Role', userRole)
      localStorage.setItem('fullname', userFullname)
  
      if (res.Address === null) {
        localStorage.setItem('address', '')
        localStorage.setItem('phone', '')
      } else {
        localStorage.setItem('address', res.Address)
        localStorage.setItem('phone', res.Phone)
      }
  
      isLoggedIn.value = true
      role.value = userRole
      fullname.value = userFullname
    } catch (err) {
      throw err;
    }
   
  }
  const registerAccount = async (FullName: string, Username: string, Password: string, Email: string) => {
    try {
      console.log(FullName, Email);
      return await authService.registerAccount(FullName, Username, Password, Email)

    } catch (err) {
      throw err
    }
  }
  const verifyOtpRegister = async (OTP: string) => {
    try {
      return await authService.verifyOtpRegister(OTP)
    } catch (err) {
      throw err
    }
  }
  const verifyOtpFotgot = async (OTP: string) => {
    try {
      return await authService.verifyOtpFotgot(OTP)
    } catch (err) {
      throw err
    }
  }
  const resetPassword = async (Password: string) => {
    try {
      await authService.resetPassword(Password);
    } catch (err) {
      throw err;
    }
  }
  const sendOtpForgot = async (Email: string) => {
    try {
      await authService.resetPassword(Email);
    } catch (err) {
      throw err;
    }
  }
  return {
    isLoggedIn,
    role,
    fullname,
    initFromStorage,
    login,
    logout,
    registerAccount,
    verifyOtpRegister,
    verifyOtpFotgot, 
    resetPassword,
    sendOtpForgot
  }
})
