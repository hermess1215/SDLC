import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Search, Users, Calendar, MapPin, CheckCircle, XCircle } from 'lucide-react';
import type { EnrolledProgram } from '../App';

interface Program {
  id: number;
  name: string;
  teacher: string;
  description: string;
  schedule: string;
  location: string;
  capacity: number;
  enrolled: number;
}

interface StudentProgramsProps {
  onEnrollProgram: (program: EnrolledProgram) => void;
  enrolledPrograms: EnrolledProgram[];
}

export function StudentPrograms({ onEnrollProgram, enrolledPrograms }: StudentProgramsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [resultDialog, setResultDialog] = useState<{
    isOpen: boolean;
    isSuccess: boolean;
    program: Program | null;
  }>({
    isOpen: false,
    isSuccess: false,
    program: null,
  });

  const programs: Program[] = [
    {
      id: 1,
      name: '코딩 교실',
      teacher: '김선생님',
      description: '파이썬 기초부터 프로젝트까지 배우는 코딩 수업입니다.',
      schedule: '월, 수, 금 15:00-16:30',
      location: '컴퓨터실',
      capacity: 20,
      enrolled: 15,
    },
    {
      id: 2,
      name: '미술 동아리',
      teacher: '이선생님',
      description: '다양한 미술 기법을 배우고 작품을 만들어봅니다.',
      schedule: '월, 목 16:00-17:30',
      location: '미술실',
      capacity: 15,
      enrolled: 12,
    },
    {
      id: 3,
      name: '영어 회화',
      teacher: '박선생님',
      description: '원어민과 함께하는 실전 영어 회화 수업입니다.',
      schedule: '화, 목 15:30-17:00',
      location: '영어교실',
      capacity: 12,
      enrolled: 10,
    },
    {
      id: 4,
      name: '축구 교실',
      teacher: '최선생님',
      description: '기본기부터 팀워크까지 배우는 축구 수업입니다.',
      schedule: '수, 금 16:00-17:30',
      location: '운동장',
      capacity: 25,
      enrolled: 20,
    },
    {
      id: 5,
      name: '과학 실험반',
      teacher: '정선생님',
      description: '재미있는 과학 실험을 직접 해보는 수업입니다.',
      schedule: '화, 목 15:00-16:30',
      location: '과학실',
      capacity: 18,
      enrolled: 14,
    },
  ];

  const filteredPrograms = programs.filter((program) =>
    program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    program.teacher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApply = (program: Program) => {
    setSelectedProgram(null);
    
    // 이미 신청한 프로그램인지 확인
    const isAlreadyEnrolled = enrolledPrograms.some(p => p.id === program.id);
    if (isAlreadyEnrolled) {
      setResultDialog({
        isOpen: true,
        isSuccess: false,
        program: program,
      });
      return;
    }
    
    // 정원이 가득 찬 경우 - 실패 다이얼로그
    if (program.enrolled >= program.capacity) {
      setResultDialog({
        isOpen: true,
        isSuccess: false,
        program: program,
      });
      return;
    }

    // 프로그램 신청 - 스케줄에서 요일 추출
    const enrolledProgram: EnrolledProgram = {
      id: program.id,
      name: program.name,
      teacher: program.teacher,
      schedule: program.schedule,
      location: program.location,
      day: program.schedule.split(' ')[0], // "월, 수, 금" 부분만 추출
    };
    
    onEnrollProgram(enrolledProgram);

    // 신청 성공 다이얼로그
    setResultDialog({
      isOpen: true,
      isSuccess: true,
      program: program,
    });
  };

  const handleCloseResultDialog = () => {
    setResultDialog({
      isOpen: false,
      isSuccess: false,
      program: null,
    });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="sticky top-0 bg-gray-50 pb-2 z-10">
        <h2 className="mb-3">프로그램 찾기</h2>
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
        {filteredPrograms.map((program) => (
          <Card
            key={program.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedProgram(program)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{program.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{program.teacher}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-700">{program.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{program.schedule.split(' ')[0]}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>
                    {program.enrolled}/{program.capacity}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Program Detail Dialog */}
      <Dialog open={!!selectedProgram} onOpenChange={() => setSelectedProgram(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedProgram?.name}</DialogTitle>
            <DialogDescription>{selectedProgram?.teacher}</DialogDescription>
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
              {selectedProgram.enrolled >= selectedProgram.capacity ? (
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                    <p className="text-sm text-red-800">❌ 정원이 마감되었습니다</p>
                    <p className="text-xs text-red-600 mt-1">
                      현재 {selectedProgram.enrolled}/{selectedProgram.capacity}명 수강 중
                    </p>
                  </div>
                  <Button
                    className="w-full"
                    disabled
                    variant="secondary"
                  >
                    신청 불가
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      신청 가능 ({selectedProgram.capacity - selectedProgram.enrolled}자리 남음)
                    </p>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleApply(selectedProgram)}
                  >
                    신청하기
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Success/Failure Alert Dialog */}
      <AlertDialog open={resultDialog.isOpen} onOpenChange={handleCloseResultDialog}>
        <AlertDialogContent className="max-w-md">
          {resultDialog.isSuccess ? (
            <>
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <AlertDialogTitle className="text-center text-xl">
                  신청 완료!
                </AlertDialogTitle>
              </div>
              <div className="text-center space-y-3">
                <AlertDialogDescription className="text-base">
                  <span className="text-gray-900">{resultDialog.program?.name}</span>에 성공적으로 신청되었습니다.
                </AlertDialogDescription>
                <div className="p-3 bg-gray-50 rounded-lg text-sm space-y-1 text-left">
                  <div className="text-gray-700">
                    <strong>선생님:</strong> {resultDialog.program?.teacher}
                  </div>
                  <div className="text-gray-700">
                    <strong>일정:</strong> {resultDialog.program?.schedule}
                  </div>
                  <div className="text-gray-700">
                    <strong>장소:</strong> {resultDialog.program?.location}
                  </div>
                </div>
              </div>
              <AlertDialogFooter>
                <Button onClick={handleCloseResultDialog} className="w-full">
                  확인
                </Button>
              </AlertDialogFooter>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-10 h-10 text-red-600" />
                </div>
                <AlertDialogTitle className="text-center text-xl">
                  신청 실패
                </AlertDialogTitle>
              </div>
              <div className="text-center space-y-3">
                <AlertDialogDescription className="text-base">
                  <span className="text-gray-900">{resultDialog.program?.name}</span>은(는) 정원이 마감되었습니다.
                </AlertDialogDescription>
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
                  <div className="text-red-800">
                    현재 <strong>{resultDialog.program?.enrolled}/{resultDialog.program?.capacity}명</strong> 수강 중
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  다른 프로그램을 선택해주세요.
                </div>
              </div>
              <AlertDialogFooter>
                <Button onClick={handleCloseResultDialog} variant="outline" className="w-full">
                  확인
                </Button>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
