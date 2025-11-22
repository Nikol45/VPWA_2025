import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { authManager } from 'src/services'
import type { User, RegisterData, LoginCredentials } from 'src/contracts'
import type { AxiosError } from 'axios'
import authService from 'src/services/AuthService'
import ValidationError from 'src/errors/ValidationError'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    status: 'success' as 'pending' | 'success' | 'error',
    errors: [] as { message: string; field?: string }[],
  }),

  getters: {
    isAuthenticated: (state) => state.user !== null,
  },

  actions: {
    AUTH_START() {
      this.status = 'pending'
      this.errors = []
    },

    AUTH_SUCCESS(user: User | null) {
      this.status = 'success'
      this.user = user
    },

    AUTH_ERROR(errors: unknown) {
      this.status = 'error'
      if (Array.isArray(errors)) {
        this.errors = errors as { message: string; field?: string }[]
      } else {
        this.errors = [{ message: String(errors) }]
      }
    },

    async check(): Promise<boolean> {
      try {
        this.AUTH_START()
        const res = await api.get('/auth/me')
        this.AUTH_SUCCESS(res.data)
        return true
      } catch (err) {
        this.AUTH_ERROR(err)
        return false
      }
    },

    async register(data: RegisterData) {
      try {
        this.AUTH_START()
        const res = await authService.register(data)
        this.AUTH_SUCCESS(null)
        return res
      } catch (err: unknown) {
        const axiosErr = err as AxiosError<{ errors?: { message: string; field?: string }[] }>

        if (axiosErr.response?.data?.errors) {
          const issues = axiosErr.response.data.errors
          this.AUTH_ERROR(issues)
          throw new ValidationError(issues)
        }

        this.AUTH_ERROR([{ message: String(err) }])
        throw err
      }
    },

    async login(credentials: LoginCredentials) {
      try {
        this.AUTH_START()
        const res = await api.post('/auth/login', credentials)

        if (res.data.error) {
          throw new Error(res.data.error)
        }
        authManager.setToken(res.data.token)

        this.AUTH_SUCCESS(null)
        return res.data
      } catch (err: unknown) {
        const error = err as AxiosError<{ errors?: { message: string }[] }>
        this.AUTH_ERROR(error.response?.data?.errors || error)
        throw error
      }
    },

    async logout() {
      try {
        this.AUTH_START()
        await api.post('/auth/logout')
        authManager.removeToken()
        this.AUTH_SUCCESS(null)
      } catch (err) {
        this.AUTH_ERROR(err)
        throw err
      }
    },
  },
})
