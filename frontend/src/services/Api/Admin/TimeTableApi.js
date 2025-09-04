import { axiosClient } from "../../../api/axios";

const TimetableApi = {
  adminList: (params)         => axiosClient.get("/admin/timetables", { params }),
  create:    (data)           => axiosClient.post("/admin/timetables", data),
  update:    (id, data)       => axiosClient.put(`/admin/timetables/${id}`, data),
  delete:    (id)             => axiosClient.delete(`/admin/timetables/${id}`),

  // views
  teacher:   (params)         => axiosClient.get("/teacher/timetable", { params }),
  student:   (params)         => axiosClient.get("/student/timetable", { params }),
  parent:    (params)         => axiosClient.get("/parent/timetable",  { params }),

  unwrap:    (r)              => r?.data?.data ?? r?.data ?? [],
};

export default TimetableApi;