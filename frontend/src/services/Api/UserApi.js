import axios from "axios";
import { axiosClient, ensureCsrf } from "../../api/axios";


// Change this to your Laravel backend URL and port!
const API_ROOT = "http://localhost:8000/api/admin/users";

const UserApi = {
  all:      ()         => axiosClient.get("/admin/users"),
  students: ()         => axiosClient.get("/admin/users?role=student"),
  parents:  ()         => axiosClient.get("/admin/users?role=parent"),
  teachers: ()         => axiosClient.get("/admin/users?role=teacher"),
  admins:   ()         => axiosClient.get("/admin/users?role=admin"),

  create:   async (data) => {
    await ensureCsrf();
    return axiosClient.post("/admin/users", data);
  },
  update:   async (id, data) => {
    await ensureCsrf();
    return axiosClient.put(`/admin/users/${id}`, data);
  },
  delete:   async (id) => {
    await ensureCsrf();
    return axiosClient.delete(`/admin/users/${id}`);
  },
  get: (id) => axiosClient.get(`/admin/users/${id}`),
};

export default UserApi;