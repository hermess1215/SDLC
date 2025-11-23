import { api } from "./client";

export const getAnnouncements = async () => {
  const res = await api.get("/notice/list"); // <-- 백엔드 엔드포인트에 맞게 수정
  return res.data;
};
