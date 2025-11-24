import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Search, Users, Calendar, MapPin, CheckCircle, XCircle, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

interface Program {
  id: number;
  name: string;
  teacher: string;
  description: string;
  schedule: string;
  location: string;
  capacity: number;
  enrolled: number;
  status: 'active' | 'pending' | 'inactive';
}

// 학생 mock 데이터
const studentNames = [
  '김민준', '이서연', '박지호', '최수아', '정예준',
  '강하은', '조윤서', '윤지우', '장서준', '임채원',
  '한지민', '오시우', '신유나', '권도현', '송하린',
  '배준서', '홍지안', '노아인', '황민서', '서은우'
];

// 각 프로그램마다 다른 색상을 반환하는 함수
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

export function AdminPrograms() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [showStudentList, setShowStudentList] = useState(false);
  const [programsList, setProgramsList] = useState<Program[]>([
    {
      id: 1,
      name: '코딩 교실',
      teacher: '김선생님',
      description: '파이썬 기초부터 프로젝트까지 배우는 코딩 수업입니다.',
      schedule: '월, 수, 금 15:00-16:30',
      location: '컴퓨터실',
      capacity: 20,
      enrolled: 15,
      status: 'active',
    },
    {
      id: 2,
      name: '드론 조종 교실',
      teacher: '정선생님',
      description: '드론의 원리를 배우고 직접 조종해보는 수업입니다.',
      schedule: '화, 목 16:00-17:30',
      location: '운동장',
      capacity: 15,
      enrolled: 0,
      status: 'pending',
    },
    {
      id: 3,
      name: '미술 동아리',
      teacher: '이선생님',
      description: '다양한 미술 기법을 배우고 작품을 만들어봅니다.',
      schedule: '월, 목 16:00-17:30',
      location: '미술실',
      capacity: 15,
      enrolled: 12,
      status: 'active',
    },
    {
      id: 4,
      name: '영어 회화',
      teacher: '박선생님',
      description: '원어민과 함께하는 실전 영어 회화 수업입니다.',
      schedule: '화, 목 15:30-17:00',
      location: '영어교실',
      capacity: 12,
      enrolled: 10,
      status: 'active',
    },
    {
      id: 5,
      name: '3D 프린팅',
      teacher: '한선생님',
      description: '3D 모델링과 프린팅을 배우는 수업입니다.',
      schedule: '수, 금 16:00-17:30',
      location: 'STEAM실',
      capacity: 12,
      enrolled: 0,
      status: 'pending',
    },
  ]);

  const activePrograms = programsList.filter((p) => p.status === 'active');
  const pendingPrograms = programsList.filter((p) => p.status === 'pending');

  const filteredPrograms = (list: Program[]) =>
    list.filter(
      (program) =>
        program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.teacher.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleApprove = (program: Program) => {
    const updatedPrograms = programsList.map((p) =>
      p.id === program.id ? { ...p, status: 'active' as const } : p
    );
    setProgramsList(updatedPrograms);
    toast.success(`${program.name} 프로그램이 승인되었습니다`);
    setSelectedProgram(null);
  };

  const handleReject = (program: Program) => {
    if (confirm(`"${program.name}" 프로그램을 반려하시겠습니까?`)) {
      const updatedPrograms = programsList.filter((p) => p.id !== program.id);
      setProgramsList(updatedPrograms);
      toast.error(`${program.name} 프로그램이 반려되었습니다`);
      setSelectedProgram(null);
    }
  };

  const handleDeleteProgram = (program: Program) => {
    if (confirm(`"${program.name}" 프로그램을 삭제하시겠습니까?\n삭제 후 복구할 수 없습니다.`)) {
      const updatedPrograms = programsList.filter((p) => p.id !== program.id);
      setProgramsList(updatedPrograms);
      toast.success('프로그램이 삭제되었습니다');
      setSelectedProgram(null);
      setShowStudentList(false);
    }
  };

  const handleViewStudents = (program: Program) => {
    setShowStudentList(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">운영중</Badge>;
      case 'pending':
        return <Badge className="bg-orange-500">승인대기</Badge>;
      default:
        return <Badge variant="outline">비활성</Badge>;
    }
  };

  const renderProgramCard = (program: Program) => (
    <Card
      key={program.id}
      className="hover:shadow-md transition-shadow"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 cursor-pointer" onClick={() => setSelectedProgram(program)}>
            <CardTitle className="text-base">{program.name}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{program.teacher}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end gap-1">
              {getStatusBadge(program.status)}
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
        </div>
      </CardHeader>
      <CardContent className="space-y-2 cursor-pointer" onClick={() => setSelectedProgram(program)}>
        <p className="text-sm text-gray-700">{program.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>
              {program.enrolled}/{program.capacity}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{program.schedule.split(' ')[0]}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 space-y-4">
      <div className="sticky top-0 bg-gray-50 pb-2 z-10">
        <h2 className="mb-3">프로그램 관리</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="프로그램, 선생님, 카테고리 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredPrograms(activePrograms).map(renderProgramCard)}
      </div>

      {/* Program Detail Dialog */}
      <Dialog open={!!selectedProgram} onOpenChange={() => setSelectedProgram(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedProgram?.name}</DialogTitle>
            <DialogDescription>
              {selectedProgram?.teacher} · {getStatusBadge(selectedProgram?.status || 'active')}
            </DialogDescription>
          </DialogHeader>
          {selectedProgram && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm mb-1">프로그램 설명</h3>
                <p className="text-sm text-gray-700">{selectedProgram.description}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span>{selectedProgram.schedule}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <span>{selectedProgram.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-gray-600" />
                  <span>
                    {selectedProgram.enrolled}/{selectedProgram.capacity}명 수강 중
                  </span>
                </div>
              </div>

              {selectedProgram.status === 'pending' ? (
                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-green-500 hover:bg-green-600"
                    onClick={() => handleApprove(selectedProgram)}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    승인
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-red-500 border-red-500 hover:bg-red-50"
                    onClick={() => handleReject(selectedProgram)}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    반려
                  </Button>
                </div>
              ) : (
                <Button 
                  className="w-full bg-blue-500 hover:bg-blue-600"
                  onClick={() => handleViewStudents(selectedProgram)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  수강생 목록 보기
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Student List Dialog */}
      <Dialog open={showStudentList} onOpenChange={setShowStudentList}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedProgram?.name}</DialogTitle>
            <DialogDescription>
              수강생 {selectedProgram?.enrolled}명 / 정원 {selectedProgram?.capacity}명
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
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
                    <Badge variant="outline" className="bg-white">
                      {selectedProgram?.name.includes('코딩') ? '1학년' : 
                       selectedProgram?.name.includes('미술') ? '2학년' : 
                       selectedProgram?.name.includes('영어') ? '3학년' : '1학년'}
                    </Badge>
                  </div>
                );
              })}
              {selectedProgram?.enrolled === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">아직 수강생이 없습니다</p>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              className="w-full text-red-500 border-red-500 hover:bg-red-50"
              onClick={() => selectedProgram && handleDeleteProgram(selectedProgram)}
            >
              프로그램 삭제
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}