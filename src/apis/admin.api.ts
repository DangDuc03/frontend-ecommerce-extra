import http from "src/utils/http";


export const adminApi = {
  products: {
    getList: (params: any) => http.get('/admin/products', { params }),
    create: (data: any) => http.post('/admin/products', data),
    update: (id: string, data: any) => http.put(`/admin/products/${id}`, data),
    delete: (id: string) => http.delete(`/admin/products/${id}`),
    uploadImages: (formData: FormData) => http.post('/admin/products/upload-images', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  categories: {
    getList: () => http.get('/admin/categories'),
    create: (data: any) => http.post('/admin/categories', data),
    update: (id: string, data: any) => http.put(`/admin/categories/${id}`, data),
    delete: (id: string) => http.delete(`/admin/categories/${id}`)
  },
  users: {
    getList: (params: any) => http.get('/admin/users', { params }),
    create: (data: any) => http.post('/admin/users', data),
    update: (id: string, data: any) => http.put(`/admin/users/${id}`, data),
    delete: (id: string) => http.delete(`/admin/users/delete/${id}`),
    updateStatus: (id: string, data: { isOnline: boolean; lastActive: string }) =>
      http.put(`/admin/users/${id}/status`, data)
  }
} 