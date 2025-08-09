import axios from "axios";

// Change this to your Laravel backend URL and port!
const API_ROOT = "http://localhost:8000/api/admin/users";

const UserApi = {
  all:           ()         => axios.get(API_ROOT, { withCredentials: true }),
  students:      ()         => axios.get(`${API_ROOT}?role=student`, { withCredentials: true }),
  parents:       ()         => axios.get(`${API_ROOT}?role=parent`, { withCredentials: true }),
  teachers:      ()         => axios.get(`${API_ROOT}?role=teacher`, { withCredentials: true }),
  admins:        ()         => axios.get(`${API_ROOT}?role=admin`, { withCredentials: true }),

  create:        (data)     => axios.post(API_ROOT, data, { withCredentials: true }),
  update:        (id, data) => axios.put(`${API_ROOT}/${id}`, data, { withCredentials: true }),
  delete:        (id)       => axios.delete(`${API_ROOT}/${id}`, { withCredentials: true }),
  get:           (id)       => axios.get(`${API_ROOT}/${id}`, { withCredentials: true }),
};
export default UserApi;
