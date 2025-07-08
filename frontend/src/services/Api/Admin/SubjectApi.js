import { axiosClient } from "../../../api/axios.js";

const SubjectApi = {
  all: () => axiosClient.get("/admin/subjects"),
  // (optionally add create/update/delete if you need to manage subjects)
};

export default SubjectApi;