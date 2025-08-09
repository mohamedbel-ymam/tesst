import { axiosClient } from "../../../api/axios.js";
const DegreeApi = {
  all: async () => axiosClient.get('/admin/degrees'),
};
export default DegreeApi;