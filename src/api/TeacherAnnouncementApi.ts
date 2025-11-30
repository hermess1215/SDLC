// src/api/AnnouncementApi.ts
import { api } from './client';

export type NoticeType = 'COMMON' | 'CANCELED' | 'CHANGE';

export interface Announcement {
  noticeId: number;
  classTitle: string;
  teacherName: string;
  title: string;
  content: string;
  noticeType: NoticeType;
  createdAt: string;
}


// 전체 공지사항 조회
export const getAnnouncements = async (): Promise<Announcement[]> => {
  const res = await api.get('/api/teachers/me/notices');
  return res.data;
};

// 새 공지사항 생성
export const createAnnouncement = async (
  classId: number,
  payload: { title: string; content: string; noticeType: NoticeType }
): Promise<Announcement> => {
  const res = await api.post(`/api/classes/${classId}/notices`, payload);
  return res.data;
};

// 공지사항 삭제
export const deleteAnnouncement = async (noticeId: number) => {
  await api.delete(`/api/notices/${noticeId}`);
};

// 🔹 공지사항 수정
// TeacherAnnouncementApi.ts
export const updateAnnouncement = async (noticeId: number, data: { title: string; content: string; noticeType: NoticeType }) => {
  const response = await api.put(`/api/notices/${noticeId}`, data);
  return response.data;
};


