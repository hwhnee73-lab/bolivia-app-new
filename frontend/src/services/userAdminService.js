import api from './api';

const userAdminService = {
  async uploadUserBatch(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/admin/users/batch/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async confirmUserBatch(tokenKey) {
    const res = await api.post('/admin/users/batch/confirm', { tokenKey });
    return res.data;
  },
};

export default userAdminService;

