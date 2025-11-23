import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Plus, AlertCircle, Calendar, Info } from 'lucide-react';
import { toast } from 'sonner';
import type { Program } from './TeacherDashboard';

interface Announcement {
  id: number;
  type: 'cancellation' | 'change' | 'info';
  program: string;
  title: string;
  message: string;
  date: string;
}

interface TeacherAnnouncementsProps {
  programs: Program[];
}

export function TeacherAnnouncements({ programs }: TeacherAnnouncementsProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: 1,
      type: 'cancellation',
      program: '과학 실험반',
      title: '휴강 안내',
      message: '10월 16일(목) 수업이 선생님 개인 사정으로 휴강됩니다.',
      date: '2025-10-15',
    },
    {
      id: 2,
      type: 'info',
      program: '코딩 교실',
      title: '공지사항',
      message: '다음 주부터 새로운 프로젝트를 시작합니다. 노트북을 꼭 가져오세요.',
      date: '2025-10-14',
    },
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'info' as 'cancellation' | 'change' | 'info',
    program: '',
    title: '',
    message: '',
  });

  const handleCreateAnnouncement = () => {
    if (!formData.program || !formData.title || !formData.message) {
      toast.error('모든 항목을 입력해주세요');
      return;
    }

    const newAnnouncement: Announcement = {
      id: Date.now(),
      type: formData.type,
      program: formData.program,
      title: formData.title,
      message: formData.message,
      date: new Date().toISOString().split('T')[0],
    };

    setAnnouncements([newAnnouncement, ...announcements]);
    toast.success('공지사항이 등록되었습니다');
    setIsCreateDialogOpen(false);
    setFormData({
      type: 'info',
      program: '',
      title: '',
      message: '',
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'cancellation':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'change':
        return <Calendar className="w-5 h-5 text-orange-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'cancellation':
        return <Badge variant="destructive">휴강</Badge>;
      case 'change':
        return <Badge className="bg-orange-500">일정변경</Badge>;
      default:
        return <Badge variant="outline">공지</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'cancellation':
        return '휴강 안내';
      case 'change':
        return '일정 변경';
      default:
        return '일반 공지';
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2>공지사항 관리</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              공지 작성
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>새 공지사항 작성</DialogTitle>
              <DialogDescription>학생들에게 전달할 내용을 작성하세요</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">공지 유형 *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'cancellation' | 'change' | 'info') =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">일반 공지</SelectItem>
                    <SelectItem value="cancellation">휴강 안내</SelectItem>
                    <SelectItem value="change">일정 변경</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="program">프로그램 *</Label>
                <Select
                  value={formData.program}
                  onValueChange={(value) => setFormData({ ...formData, program: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="프로그램 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {programs.length === 0 ? (
                      <div className="p-2 text-sm text-gray-500 text-center">
                        개설된 프로그램이 없습니다
                      </div>
                    ) : (
                      programs.map((program) => (
                        <SelectItem key={program.id} value={program.name}>
                          {program.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">제목 *</Label>
                <Input
                  id="title"
                  placeholder="공지사항 제목"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">내용 *</Label>
                <Textarea
                  id="message"
                  placeholder="공지사항 내용을 입력하세요"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
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

      <div className="space-y-3">
        {announcements.map((announcement) => (
          <Card key={announcement.id}>
            <CardContent className="pt-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-1">{getIcon(announcement.type)}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p>{announcement.title}</p>
                        {getTypeBadge(announcement.type)}
                      </div>
                      <p className="text-sm text-gray-600">{announcement.program}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{announcement.message}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      {new Date(announcement.date).toLocaleDateString('ko-KR', {
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <Button variant="ghost" size="sm" className="text-xs h-7">
                      삭제
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}