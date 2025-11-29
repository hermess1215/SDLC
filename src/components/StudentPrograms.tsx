// StudentPrograms.tsx
import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Search, Users, Calendar, MapPin, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import type { EnrolledProgram } from '../App';
import { programApi, ProgramApiData } from '../api/StudentProgramApi';
import { toast } from 'sonner';

// API 응답 구조를 기반으로 컴포넌트에서 사용할 Program 타입 정의
interface Program {
  classId: number;
  title: string;
  description: string;
  teacherName: string;
  classLocation: string;
  capacity: number;
  currentCount: number;
  schedules: {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  }[];
}

interface StudentProgramsProps {
  onEnrollProgram: (program: EnrolledProgram) => void;
  enrolledPrograms: EnrolledProgram[];
}

// 스케줄 데이터를 보기 좋은 문자열로 변환하는 헬퍼 함수
const formatSchedule = (schedules: Program['schedules']): { day: string; full: string } => {
  if (!schedules || schedules.length === 0) return { day: '미정', full: '일정 미정' };

  const days = Array.from(new Set(schedules.map(s => s.dayOfWeek)))
    .map(day => {
      switch (day) {
        case 'MON': return '월';
        case 'TUE': return '화';
        case 'WED': return '수';
        case 'THU': return '목';
        case 'FRI': return '금';
        case 'SAT': return '토';
        case 'SUN': return '일';
        default: return '';
      }
    })
    .join(', ');

  const firstSchedule = schedules[0];
  const time = `${firstSchedule.startTime}~${firstSchedule.endTime}`;
  return { day: days, full: `${days} ${time}` };
};

export function StudentPrograms({ onEnrollProgram, enrolledPrograms }: StudentProgramsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [programList, setProgramList] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  console.log('StudentPrograms 토큰 확인:', localStorage.getItem('accessToken'));

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      setError(null);
      try {
        // API에서 받아온 데이터를 그대로 사용
        const data: Program[] = await programApi.getPrograms();
        setProgramList(data);
      } catch (err) {
        console.error('프로그램 목록 로딩 실패:', err);
        toast.error('프로그램 목록을 불러오는 데 실패했습니다. 로그인이 필요할 수 있습니다.');
        setError('프로그램 데이터를 불러올 수 없습니다. 다시 시도해 주세요.');
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  const filteredPrograms = useMemo(
    () =>
      programList.filter(
        p =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.teacherName.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [programList, searchQuery]
  );

  const handleApply = async (program: Program) => {
    setSelectedProgram(null);

    // 이미 신청했거나 정원이 꽉 찬 경우
    const isAlreadyEnrolled = enrolledPrograms.some(p => p.id === program.classId);
    if (isAlreadyEnrolled || program.currentCount >= program.capacity) {
      setResultDialog({ isOpen: true, isSuccess: false, program });
      return;
    }

    try {
      // 백엔드 실제 신청 요청
      await programApi.enroll(program.classId);

      // UI 성공 팝업만 표시 (프론트 로컬 상태 업데이트 제거)
      setResultDialog({ isOpen: true, isSuccess: true, program });

    } catch (err: any) {
      console.error('신청 실패:', err);
      toast.error('신청에 실패했습니다.');
      setResultDialog({ isOpen: true, isSuccess: false, program });
    }
  };



  const handleCloseResultDialog = () => setResultDialog({ isOpen: false, isSuccess: false, program: null });

  return (
    <div className="p-4 space-y-4">
      <div className="sticky top-0 bg-white pb-2 z-10 border-b border-gray-100">
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

      {loading && (
        <div className="flex flex-col items-center justify-center p-8 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin mb-3" />
          <p>프로그램 목록을 불러오는 중...</p>
        </div>
      )}

      {error && (
        <div className="p-8 text-center text-red-600 bg-red-50 border border-red-200 rounded-lg">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && filteredPrograms.length === 0 && (
        <div className="p-8 text-center text-gray-500 bg-gray-50 border border-gray-200 rounded-lg">
          <p>검색 결과가 없습니다.</p>
        </div>
      )}

      <div className="space-y-3">
        {filteredPrograms.map(program => (
          <Card
            key={program.classId}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedProgram(program)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{program.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{program.teacherName}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-700">{program.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatSchedule(program.schedules).day}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{program.currentCount}/{program.capacity}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedProgram} onOpenChange={() => setSelectedProgram(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedProgram?.title}</DialogTitle>
            <DialogDescription>{selectedProgram?.teacherName}</DialogDescription>
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
                  <span>{formatSchedule(selectedProgram.schedules).full}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <span>{selectedProgram.classLocation}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-gray-600" />
                  <span>{selectedProgram.currentCount}/{selectedProgram.capacity}명 수강 중</span>
                </div>
              </div>

              {selectedProgram.currentCount >= selectedProgram.capacity || enrolledPrograms.some(p => p.id === selectedProgram.classId) ? (
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                    {enrolledPrograms.some(p => p.id === selectedProgram.classId) ? (
                      <p className="text-sm text-red-800">❌ 이미 신청한 프로그램입니다</p>
                    ) : (
                      <p className="text-sm text-red-800">❌ 정원이 마감되었습니다</p>
                    )}
                    <p className="text-xs text-red-600 mt-1">
                      현재 {selectedProgram.currentCount}/{selectedProgram.capacity}명 수강 중
                    </p>
                  </div>
                  <Button className="w-full" disabled variant="secondary">
                    신청 불가
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      신청 가능 ({selectedProgram.capacity - selectedProgram.currentCount}자리 남음)
                    </p>
                  </div>
                  <Button className="w-full" onClick={() => handleApply(selectedProgram)}>
                    신청하기
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={resultDialog.isOpen} onOpenChange={handleCloseResultDialog}>
        <AlertDialogContent className="max-w-md">
          {resultDialog.isSuccess ? (
            <>
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <AlertDialogTitle className="text-center text-xl">신청 완료!</AlertDialogTitle>
              </div>
              <div className="text-center space-y-3">
                <AlertDialogDescription className="text-base">
                  <span className="text-gray-900">{resultDialog.program?.title}</span>에 성공적으로 신청되었습니다.
                </AlertDialogDescription>
                <div className="p-3 bg-gray-50 rounded-lg text-sm space-y-1 text-left">
                  <div className="text-gray-700">
                    <strong>선생님:</strong> {resultDialog.program?.teacherName}
                  </div>
                  <div className="text-gray-700">
                    <strong>일정:</strong> {formatSchedule(resultDialog.program!.schedules).full}
                  </div>
                  <div className="text-gray-700">
                    <strong>장소:</strong> {resultDialog.program?.classLocation}
                  </div>
                </div>
              </div>
              <AlertDialogFooter>
                <Button onClick={handleCloseResultDialog} className="w-full">확인</Button>
              </AlertDialogFooter>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-10 h-10 text-red-600" />
                </div>
                <AlertDialogTitle className="text-center text-xl">신청 실패</AlertDialogTitle>
              </div>
              <div className="text-center space-y-3">
                <AlertDialogDescription className="text-base">
                  {resultDialog.program ? (
                    enrolledPrograms.some(p => p.id === resultDialog.program!.classId) ? (
                      <>
                        <span className="text-gray-900">{resultDialog.program.title}</span>은(는) 정원이 마감되었습니다.
                      </>
                    ) : (
                      <>
                        <span className="text-gray-900">{resultDialog.program.title}</span>은(는) 이미 신청한 프로그램입니다.
                      </>
                    )
                  ) : (
                    <span>프로그램 신청에 실패했습니다. (정보 없음)</span>
                  )}
                </AlertDialogDescription>
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
                  <div className="text-red-800">
                    현재 <strong>{resultDialog.program?.currentCount}/{resultDialog.program?.capacity}명</strong> 수강 중
                  </div>
                </div>
                <div className="text-sm text-gray-600">다른 프로그램을 선택해주세요.</div>
              </div>
              <AlertDialogFooter>
                <Button onClick={handleCloseResultDialog} variant="outline" className="w-full">확인</Button>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
