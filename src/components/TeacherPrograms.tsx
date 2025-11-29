import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Badge } from './ui/badge';
import { Plus, Users, Calendar, MapPin, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { programApi, Program } from '../api/TeacherProgramApi';

// 학생 mock 데이터
const studentNames = [
  '김민준','이서연','박지호','최수아','정예준','강하은','조윤서','윤지우','장서준','임채원',
  '한지민','오시우','신유나','권도현','송하린','배준서','홍지안','노아인','황민서','서은우'
];

// 프로그램 색상
const getProgramColor = (programId: number) => {
  const colors = [
    { bg: 'bg-blue-50', border: 'border-blue-200' },
    { bg: 'bg-purple-50', border: 'border-purple-200' },
    { bg: 'bg-green-50', border: 'border-green-200' },
    { bg: 'bg-orange-50', border: 'border-orange-200' },
    { bg: 'bg-pink-50', border: 'border-pink-200' },
    { bg: 'bg-cyan-50', border: 'border-cyan-200' },
  ];
  return colors[programId % colors.length];
};

const getStudentButtonColor = (programId: number) => {
  const colors = [
    'bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-300',
    'bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-300',
    'bg-green-100 hover:bg-green-200 text-green-700 border-green-300',
    'bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-300',
    'bg-pink-100 hover:bg-pink-200 text-pink-700 border-pink-300',
    'bg-cyan-100 hover:bg-cyan-200 text-cyan-700 border-cyan-300',
  ];
  return colors[programId % colors.length];
};

export function TeacherPrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    capacity: 20,
    schedules: [{ dayOfWeek: 'MON', startTime: '', endTime: '' }],
  });

  // 방과후 프로그램 목록 불러오기
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await programApi.getPrograms();
        setPrograms(data);
      } catch (err) {
        toast.error('방과후 프로그램 목록을 가져오는 중 오류가 발생했습니다.');
      }
    };
    fetchPrograms();
  }, []);

  // 프로그램 생성
  const handleCreateProgram = async () => {
    if (!formData.title || !formData.description) {
      toast.error('필수 항목을 모두 입력해주세요.');
      return;
    }

    try {
      const newProgram = await programApi.createProgram({
        classId: Date.now(),
        title: formData.title,
        description: formData.description,
        teacherName: '홍길동',
        classLocation: formData.location,
        capacity: formData.capacity,
        currentCount: 0,
        schedules: formData.schedules.map(s => ({
          dayOfWeek: s.dayOfWeek as 'MON'|'TUE'|'WED'|'THU'|'FRI'|'SAT'|'SUN',
          startTime: s.startTime,
          endTime: s.endTime,
        })),
      });
      setPrograms([...programs, newProgram]);
      toast.success('방과후 프로그램이 생성되었습니다.');
      setIsCreateDialogOpen(false);
      setFormData({ title: '', description: '', location: '', capacity: 20, schedules: [{ dayOfWeek: 'MON', startTime: '', endTime: '' }] });
    } catch (err) {
      toast.error('프로그램 생성 중 오류가 발생했습니다.');
    }
  };

  const handleScheduleChange = (idx: number, field: 'dayOfWeek' | 'startTime' | 'endTime', value: string) => {
    const newSchedules = [...formData.schedules];
    newSchedules[idx][field] = value;
    setFormData({ ...formData, schedules: newSchedules });
  };

  const addScheduleRow = () => {
    setFormData({ ...formData, schedules: [...formData.schedules, { dayOfWeek: 'MON', startTime: '', endTime: '' }] });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2>내 방과후 프로그램</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" /> 프로그램 개설
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>새 프로그램 개설</DialogTitle>
              <DialogDescription>방과후 프로그램 정보를 입력하세요</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">프로그램 이름 *</Label>
                <Input
                  id="title"
                  placeholder="예: 코딩 교실"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">프로그램 설명 *</Label>
                <Textarea
                  id="description"
                  placeholder="프로그램 내용을 자세히 설명해주세요"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">장소</Label>
                <Input
                  id="location"
                  placeholder="예: 컴퓨터실"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">정원</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>수업 일정</Label>
                {formData.schedules.map((s, idx) => (
                  <div key={`schedule-${idx}`} className="flex gap-2">
                    <select value={s.dayOfWeek} onChange={(e) => handleScheduleChange(idx, 'dayOfWeek', e.target.value)}>
                      <option value="MON">월</option>
                      <option value="TUE">화</option>
                      <option value="WED">수</option>
                      <option value="THU">목</option>
                      <option value="FRI">금</option>
                      <option value="SAT">토</option>
                      <option value="SUN">일</option>
                    </select>
                    <Input type="time" value={s.startTime} onChange={(e) => handleScheduleChange(idx, 'startTime', e.target.value)} />
                    <Input type="time" value={s.endTime} onChange={(e) => handleScheduleChange(idx, 'endTime', e.target.value)} />
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addScheduleRow}>일정 추가</Button>
              </div>
              <Button className="w-full" onClick={handleCreateProgram}>프로그램 생성</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {programs.map((program) => (
          <Card key={program.classId}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base mb-1">{program.title}</CardTitle>
                  <Badge variant="outline">
                    <Users className="w-3 h-3 mr-1" />
                    {program.currentCount}/{program.capacity}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:bg-red-50 hover:border-red-300"
                  onClick={() => {
                    if (confirm(`${program.title}을 삭제하시겠습니까?`)) {
                      setPrograms(programs.filter((p) => p.classId !== program.classId));
                      toast.success('프로그램이 삭제되었습니다.');
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-700">{program.description}</p>
              {(program.schedules || []).map((s) => (
                <div key={`${s.dayOfWeek}-${s.startTime}-${s.endTime}`} className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{s.dayOfWeek} {s.startTime}-{s.endTime}</span>
                </div>
              ))}
              {program.classLocation && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{program.classLocation}</span>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                className={`flex-1 ${getStudentButtonColor(program.classId)}`}
                onClick={() => setSelectedProgram(program)}
              >
                <Users className="w-4 h-4 mr-1" /> 수강생 목록
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Student List Dialog */}
      <Dialog open={!!selectedProgram} onOpenChange={() => setSelectedProgram(null)}>
        <DialogContent className="w-full max-w-md h-[65vh] flex flex-col">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-sm">{selectedProgram?.title}</DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              {selectedProgram?.currentCount}/{selectedProgram?.capacity}명
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-1 mt-1">
            {Array.from({ length: selectedProgram?.currentCount || 0 }, (_, i) => {
              const color = selectedProgram ? getProgramColor(selectedProgram.classId) : { bg: "bg-gray-50", border: "border-gray-200" };
              const studentName = studentNames[i % studentNames.length];

              return (
                <div key={`student-${i}-${studentName}`} className={`flex items-center justify-between p-1 rounded border text-xs ${color.bg} ${color.border}`}>
                  <div>
                    <p className="truncate">{studentName}</p>
                    <p className="text-[10px] text-gray-500">2024010{i + 1}</p>
                  </div>
                  <Button variant="outline" size="sm" className="px-1 py-0.5 text-[10px]">출석</Button>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
