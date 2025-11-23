import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Plus, Users, Calendar, MapPin, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Program } from './TeacherDashboard';

// 학생 mock 데이터
const studentNames = [
  '김민준', '이서연', '박지호', '최수아', '정예준',
  '강하은', '조윤서', '윤지우', '장서준', '임채원',
  '한지민', '오시우', '신유나', '권도현', '송하린',
  '배준서', '홍지안', '노아인', '황민서', '서은우'
];

// 각 반(프로그램)마다 다른 색상을 반환하는 함수
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

// 수강생 목록 버튼의 색상을 반환하는 함수
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

interface TeacherProgramsProps {
  programs: Program[];
  setPrograms: (programs: Program[]) => void;
}

export function TeacherPrograms({ programs, setPrograms }: TeacherProgramsProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    schedule: '',
    location: '',
    capacity: '',
    category: '',
  });

  const handleCreateProgram = () => {
    if (!formData.name || !formData.description) {
      toast.error('필수 항목을 모두 입력해주세요');
      return;
    }

    const newProgram: Program = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
      schedule: formData.schedule,
      location: formData.location,
      capacity: parseInt(formData.capacity) || 20,
      enrolled: 0,
      category: formData.category,
    };

    setPrograms([...programs, newProgram]);
    toast.success('프로그램이 생성되었습니다');
    setIsCreateDialogOpen(false);
    setFormData({
      name: '',
      description: '',
      schedule: '',
      location: '',
      capacity: '',
      category: '',
    });
  };

  const handleEditProgram = (program: Program) => {
    setEditingProgram(program);
    setFormData({
      name: program.name,
      description: program.description,
      schedule: program.schedule,
      location: program.location,
      capacity: program.capacity.toString(),
      category: program.category,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateProgram = () => {
    if (!formData.name || !formData.description) {
      toast.error('필수 항목을 모두 입력해주세요');
      return;
    }

    if (!editingProgram) return;

    const updatedPrograms = programs.map((program) =>
      program.id === editingProgram.id
        ? {
            ...program,
            name: formData.name,
            description: formData.description,
            schedule: formData.schedule,
            location: formData.location,
            capacity: parseInt(formData.capacity) || 20,
            category: formData.category,
          }
        : program
    );

    setPrograms(updatedPrograms);
    toast.success('프로그램이 수정되었습니다');
    setIsEditDialogOpen(false);
    setEditingProgram(null);
    setFormData({
      name: '',
      description: '',
      schedule: '',
      location: '',
      capacity: '',
      category: '',
    });
  };

  const handleDeleteProgram = (program: Program) => {
    if (confirm(`"${program.name}" 프로그램을 삭제하시겠습니까?`)) {
      const updatedPrograms = programs.filter((p) => p.id !== program.id);
      setPrograms(updatedPrograms);
      toast.success('프로그램이 삭제되었습니다');
    }
  };

  const handleViewStudents = (program: Program) => {
    setSelectedProgram(program);
  };

  const handleOpenCreateDialog = (open: boolean) => {
    setIsCreateDialogOpen(open);
    if (open) {
      // 다이얼로그가 열릴 때 폼 데이터 초기화
      setFormData({
        name: '',
        description: '',
        schedule: '',
        location: '',
        capacity: '',
        category: '',
      });
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2>내 프로그램</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={handleOpenCreateDialog}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              프로그램 개설
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>새 프로그램 개설</DialogTitle>
              <DialogDescription>프로그램 정보를 입력하세요</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">프로그램 이름 *</Label>
                <Input
                  id="name"
                  placeholder="예: 코딩 교실"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">카테고리</Label>
                <Input
                  id="category"
                  placeholder="예: IT, 예술, 체육"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                <Label htmlFor="schedule">수업 일정</Label>
                <Input
                  id="schedule"
                  placeholder="예: 월, 수, 금 15:00-16:30"
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
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
                  placeholder="20"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                />
              </div>
              <Button className="w-full" onClick={handleCreateProgram}>
                프로그램 생성
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {programs.map((program) => (
          <Card key={program.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base mb-1">{program.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge>{program.category}</Badge>
                    <Badge variant="outline">
                      <Users className="w-3 h-3 mr-1" />
                      {program.enrolled}/{program.capacity}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:bg-red-50 hover:border-red-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProgram(program);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-700">{program.description}</p>
              <div className="space-y-1 text-sm text-gray-600">
                {program.schedule && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{program.schedule}</span>
                  </div>
                )}
                {program.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{program.location}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex-1 ${getStudentButtonColor(program.id)}`}
                  onClick={() => handleViewStudents(program)}
                >
                  <Users className="w-4 h-4 mr-1" />
                  수강생 목록
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEditProgram(program)}>
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Program Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>프로그램 수정</DialogTitle>
            <DialogDescription>프로그램 정보를 수정하세요</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">프로그램 이름 *</Label>
              <Input
                id="edit-name"
                placeholder="예: 코딩 교실"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">카테고리</Label>
              <Input
                id="edit-category"
                placeholder="예: IT, 예술, 체육"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">프로그램 설명 *</Label>
              <Textarea
                id="edit-description"
                placeholder="프로그램 내용을 자세히 설명해주세요"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-schedule">수업 일정</Label>
              <Input
                id="edit-schedule"
                placeholder="예: 월, 수, 금 15:00-16:30"
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-location">장소</Label>
              <Input
                id="edit-location"
                placeholder="예: 컴퓨터실"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-capacity">정원</Label>
              <Input
                id="edit-capacity"
                type="number"
                placeholder="20"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              />
            </div>
            <Button className="w-full" onClick={handleUpdateProgram}>
              프로그램 수정
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Student List Dialog */}
      <Dialog open={!!selectedProgram} onOpenChange={() => setSelectedProgram(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedProgram?.name}</DialogTitle>
            <DialogDescription>
              수강생 {selectedProgram?.enrolled}명 / 정원 {selectedProgram?.capacity}명
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {Array.from({ length: selectedProgram?.enrolled || 0 }, (_, i) => {
              const programColor = selectedProgram ? getProgramColor(selectedProgram.id) : { bg: 'bg-gray-50', border: 'border-gray-200' };
              const studentName = studentNames[i % studentNames.length];
              return (
                <div
                  key={i}
                  className={`flex items-center justify-between p-3 rounded-lg border ${programColor.bg} ${programColor.border}`}
                >
                  <div>
                    <p className="text-sm">{studentName}</p>
                    <p className="text-xs text-gray-600">2024010{i + 1}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    출석 체크
                  </Button>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}