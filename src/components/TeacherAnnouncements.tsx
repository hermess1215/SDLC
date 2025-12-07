import { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, AlertCircle, Calendar, Info } from 'lucide-react';
import { toast } from 'sonner';
import { getAnnouncements, createAnnouncement, deleteAnnouncement, NoticeType, Announcement } from '../api/TeacherAnnouncementApi';
import { Program } from '../api/TeacherProgramApi';

interface TeacherAnnouncementsProps {
  programs: Program[];
}

type AnnouncementWithClassId = Announcement & { classId?: number };

export function TeacherAnnouncements({ programs }: TeacherAnnouncementsProps) {
  const [announcements, setAnnouncements] = useState<AnnouncementWithClassId[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [formData, setFormData] = useState<{
    type: NoticeType;
    classId?: number;
    title: string;
    content: string;
  }>({
    type: 'COMMON',
    classId: programs[0]?.classId,
    title: '',
    content: '',
  });

  // 🔹 공지 불러오기
  const fetchAnnouncements = async () => {
    try {
      const data: Announcement[] = await getAnnouncements();

      const mapped = data.map(a => {
        const program = programs.find(p => p.title === a.classTitle);
        return {
          ...a,
          classId: program?.classId,
        };
      });

      setAnnouncements(mapped);
    } catch (err) {
      console.error(err);
      toast.error('공지사항을 불러오지 못했습니다.');
    }
  };

  useEffect(() => {
    if (programs.length > 0) fetchAnnouncements();
  }, [programs]);

  // 🔹 공지 생성
  const handleCreateAnnouncement = async () => {
    if (!formData.classId || !formData.title || !formData.content) {
      toast.error('모든 항목을 입력해주세요');
      return;
    }

    try {
      await createAnnouncement(formData.classId, {
        title: formData.title,
        content: formData.content,
        noticeType: formData.type,
      });

      toast.success('공지사항이 등록되었습니다.');

      // 🔥 서버에서 최신 공지 다시 불러오기
      await fetchAnnouncements();

      // 모달 닫기
      setIsCreateDialogOpen(false);

      // 입력값 초기화
      setFormData({
        type: 'COMMON',
        classId: programs[0]?.classId,
        title: '',
        content: '',
      });
    } catch (err) {
      console.error(err);
      toast.error('공지사항 등록에 실패했습니다.');
    }
  };

  // 🔹 공지 삭제
  const handleDeleteAnnouncement = async (noticeId: number) => {
    try {
      await deleteAnnouncement(noticeId);
      setAnnouncements(prev => prev.filter(a => a.noticeId !== noticeId));
      toast.success('공지사항이 삭제되었습니다');
    } catch (err) {
      console.error(err);
      toast.error('공지사항 삭제에 실패했습니다.');
    }
  };

  const getIcon = (type: NoticeType) => {
    switch (type) {
      case 'CANCELED': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'CHANGE': return <Calendar className="w-5 h-5 text-orange-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTypeBadge = (type: NoticeType) => {
    switch (type) {
      case 'CANCELED': return <Badge variant="destructive">휴강</Badge>;
      case 'CHANGE': return <Badge className="bg-orange-500">일정변경</Badge>;
      default: return <Badge variant="outline">공지</Badge>;
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* 상단 버튼 */}
      <div className="flex items-center justify-between">
        <h2>공지사항 관리</h2>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" /> 공지 작성
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md" onInteractOutside={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle>새 공지사항 작성</DialogTitle>
              <DialogDescription>학생들에게 전달할 내용을 작성하세요</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>공지 유형 *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: NoticeType) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COMMON">일반 공지</SelectItem>
                    <SelectItem value="CANCELED">휴강 안내</SelectItem>
                    <SelectItem value="CHANGE">일정 변경</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>대상 프로그램 *</Label>
                {programs.length > 0 ? (
                  <select
                    className="w-full min-h-[40px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm appearance-none"
                    value={formData.classId || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, classId: parseInt(e.target.value) })
                    }
                  >
                    {programs.map((p, idx) => (
                      <option key={`${p.classId}-${idx}`} value={p.classId}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-red-500">프로그램을 먼저 개설해주세요.</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>제목 *</Label>
                <Input
                  placeholder="공지 제목"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>내용 *</Label>
                <Textarea
                  placeholder="공지 내용을 입력하세요"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={4}
                />
              </div>

              <Button className="w-full" onClick={handleCreateAnnouncement}>
                공지사항 등록
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 공지 리스트 */}
      <div className="space-y-3">
        {announcements.length === 0 ? (
          <p className="text-sm text-gray-500">등록된 공지사항이 없습니다.</p>
        ) : (
          announcements.map((a, idx) => (
            <Card key={`${a.noticeId}-${idx}`}>
              <CardContent className="pt-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">{getIcon(a.noticeType)}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p>{a.title}</p>
                          {getTypeBadge(a.noticeType)}
                        </div>
                        <p className="text-sm text-gray-600">
                          {programs.find((p) => p.classId === a.classId)?.title ||
                            a.classTitle}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-2">{a.content}</p>

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        {new Date(a.createdAt).toLocaleDateString('ko-KR', {
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => handleDeleteAnnouncement(a.noticeId)}
                      >
                        삭제
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
