import { axiosClient } from '../../api/axios';

const UserApi = {
  login:    (email,password) => axiosClient.post('/login',{email,password}),
  logout:   ()                => axiosClient.post('/logout'),
  getUser:  ()                => axiosClient.get('/me'),
};

export default UserApi;