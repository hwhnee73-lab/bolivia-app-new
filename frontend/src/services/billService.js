import api from './api';

const billService = {
  async getMyBills(page = 0, size = 10) {
    const response = await api.get('/bills/my', {
      params: { page, size }
    });
    return response.data;
  },

  async getBillDetail(id) {
    const response = await api.get(`/bills/my/${id}`);
    return response.data;
  },

  async getOverdueBills() {
    const response = await api.get('/bills/overdue');
    return response.data;
  },

  async getBillsByMonth(month) {
    const response = await api.get(`/bills/month/${month}`);
    return response.data;
  },

  async uploadBillBatch(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/admin/billing/batch/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async confirmBillBatch(batchId) {
    const response = await api.post(`/admin/billing/batch/confirm/${batchId}`);
    return response.data;
  }
};

export default billService;