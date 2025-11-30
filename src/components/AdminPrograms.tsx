// AdminPrograms.tsx

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Search, Users, Calendar, MapPin, Eye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { programApi, ProgramData, StudentData } from '../api/AdminProgramApi';

export function AdminPrograms() {
  const [programsList, setProgramsList] = useState<ProgramData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<ProgramData | null>(null);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [showStudentList, setShowStudentList] = useState(false);

  // 컴포넌트 마운트 시 프로그램 목록 불러오기
  useEffect(() => {
    programApi.getPrograms()
      .then(setProgramsList)
      .catch((err) => {
        console.error(err);
        toast.error('프로그램 목록을 가져오는 데 실패했습니다.');
      });
  }, []);

  // 실제 삭제 처리 함수
  const handleDeleteProgram = async (program: ProgramData) => {
    // 확인 대화상자
    const confirmed = window.confirm(`'${program.title}' 프로그램을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`);
    if (!confirmed) return;

    try {
      await programApi.deleteProgram(program.classId);

      // UI에서 리스트 제거
      setProgramsList((prev) => prev.filter((p) => p.classId !== program.classId));

      // 현재 보고 있는 상세/수강생 모달이 삭제된 프로그램이면 닫기
      if (selectedProgram?.classId === program.classId) {
        setSelectedProgram(null);
      }
      if (showStudentList && selectedProgram?.classId === program.classId) {
        setShowStudentList(false);
        setStudents([]);
      }

      toast.success('프로그램이 삭제되었습니다.');
    } catch (error) {
      console.error(error);
      toast.error('삭제 중 문제가 발생했습니다.');
    }
  };

  const handleViewStudents = async (program: ProgramData) => {
    setSelectedProgram(program);
    try {
      const studentList = await programApi.getProgramStudents(program.classId);
      setStudents(studentList);
      setShowStudentList(true);
    } catch (error) {
      console.error(error);
      toast.error('수강생 목록을 가져오는 데 실패했습니다.');
    }
  };

  const filteredPrograms = programsList.filter(
    (program) =>
      program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.teacherName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4">
      {/* 검색창 */}
      <div className="sticky top-0 bg-gray-50 pb-2 z-10">
        <h2 className="mb-3">프로그램 관리</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="프로그램, 선생님 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* 프로그램 카드 리스트 */}
      <div className="space-y-3">
        {filteredPrograms.map((program) => {
          return (
            <Card key={program.classId} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 flex justify-between items-start">
                <div className="flex-1 cursor-pointer" onClick={() => setSelectedProgram(program)}>
                  <CardTitle>{program.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{program.teacherName}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:bg-red-50 hover:border-red-300"
                  onClick={(e) => { e.stopPropagation(); handleDeleteProgram(program); }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent
                className={'space-y-2 cursor-pointer'}
                onClick={() => setSelectedProgram(program)}
              >
                <p className="text-sm text-gray-700">{program.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{program.currentCount}/{program.capacity}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{program.schedules[0]?.dayOfWeek}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 프로그램 상세 모달 */}
      <Dialog open={!!selectedProgram} onOpenChange={() => setSelectedProgram(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedProgram?.title}</DialogTitle>
            <DialogDescription>{selectedProgram?.teacherName}</DialogDescription>
          </DialogHeader>

          {selectedProgram && (
            <div className="space-y-4">
              <p className="text-sm text-gray-700">{selectedProgram.description}</p>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span>
                    {selectedProgram.schedules.map((s) => `${s.dayOfWeek} ${s.startTime}-${s.endTime}`).join(', ')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <span>{selectedProgram.classLocation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-600" />
                  <span>{selectedProgram.currentCount}/{selectedProgram.capacity}명 수강 중</span>
                </div>
              </div>

              <Button
                className="w-full bg-blue-500 hover:bg-blue-600 mt-2"
                onClick={() => handleViewStudents(selectedProgram)}
              >
                <Eye className="w-4 h-4 mr-1" />
                수강생 목록 보기
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 수강생 목록 모달 */}
      <Dialog open={showStudentList} onOpenChange={setShowStudentList}>
        <DialogContent className="w-full max-w-md h-[65vh] flex flex-col">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-sm">{selectedProgram?.title}</DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              수강생 {students.length}명 / 정원 {selectedProgram?.capacity}명
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-1 mt-1">
            {students.length > 0 ? (
              students.map((student) => (
                <div
                  key={student.studentId}
                  className="flex items-center justify-between p-1 rounded border text-xs"
                >
                  <div>
                    <p className="truncate">{student.name}</p>
                    <p className="text-[10px] text-gray-500">{student.email}</p>
                  </div>
                  <Badge variant="outline" className="bg-white text-[11px] px-2 py-0.5">
                    {student.grade}학년
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-500">
                <Users className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">아직 수강생이 없습니다</p>
              </div>
            )}
          </div>

          <div className="p-4 pt-2 shrink-0">
            <Button
              variant="outline"
              className="w-full text-red-500 border-red-500 hover:bg-red-50 text-sm"
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
