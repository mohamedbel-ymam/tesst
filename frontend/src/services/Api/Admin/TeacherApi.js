import { axiosClient } from "../../../api/axios.js";

const TeacherApi = {
  create: (payload) => axiosClient.post('/admin/teachers', payload),
  update: (id, payload) => axiosClient.put(`/admin/teachers/${id}`, {...payload, id}),
  delete: (id) => axiosClient.delete(`/admin/teachers/${id}`),
  all: () => axiosClient.get('/admin/teachers'),
};

export default TeacherApi;
