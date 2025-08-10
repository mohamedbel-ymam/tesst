import { axiosClient } from "../../api/axios";
export const TimetableViewApi = {
  student: () => axiosClient.get("/student/timetable"),
  teacher: () => axiosClient.get("/teacher/timetable"),
};