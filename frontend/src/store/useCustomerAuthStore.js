import { create } from 'zustand'

export const useCustomerAuthStore = create((set) => ({
  customer: JSON.parse(localStorage.getItem('customer_user')) || null,
  customerToken: localStorage.getItem('customer_token') || null,

  customerLogin: (userData, token) => {
    localStorage.setItem('customer_user', JSON.stringify(userData))
    localStorage.setItem('customer_token', token)
    set({ customer: userData, customerToken: token })
  },

  customerLogout: () => {
    localStorage.removeItem('customer_user')
    localStorage.removeItem('customer_token')
    set({ customer: null, customerToken: null })
  },

  updateCustomer: (data) => {
    set((state) => {
      const updated = { ...state.customer, ...data }
      localStorage.setItem('customer_user', JSON.stringify(updated))
      return { customer: updated }
    })
  }
}))
