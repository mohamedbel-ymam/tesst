import { axiosClient } from "../../../api/axios";

const TimetableApi = {
  list:     (params)                 => axiosClient.get("/admin/timetables", { params }),
  get:      (id)                     => axiosClient.get(`/admin/timetables/${id}`),
  create:   (data)                   => axiosClient.post("/admin/timetables", data),
  update:   (id, data)               => axiosClient.put(`/admin/timetables/${id}`, data),
  delete:   (id)                     => axiosClient.delete(`/admin/timetables/${id}`),
  lessons:  (timetableId)            => axiosClient.get(`/admin/timetables/${timetableId}/lessons`),
  addLesson:(timetableId, data)      => axiosClient.post(`/admin/timetables/${timetableId}/lessons`, data),
  updLesson:(lessonId, data)         => axiosClient.put(`/lessons/${lessonId}`, data),
  delLesson:(lessonId)               => axiosClient.delete(`/lessons/${lessonId}`),
};
export default TimetableApi;