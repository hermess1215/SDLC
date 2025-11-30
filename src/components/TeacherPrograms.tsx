// TeacherPrograms.tsx
import { useState } from 'react';
import { createProgram } from '../api/createProgram';
import { deleteProgram } from '../api/deleteProgram';
import { updateProgram } from '../api/updateProgramApi';
import type { Program } from '../api/TeacherProgramApi';
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

const DAY_OPTIONS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

interface TeacherProgramsProps {
  programs: Program[];
  setPrograms: React.Dispatch<React.SetStateAction<Program[]>>;
  fetchPrograms: () => Promise<void>;
}

export function TeacherPrograms({ programs, setPrograms, fetchPrograms }: TeacherProgramsProps) {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [openEdit, setOpenEdit] = useState(false);

  const [newProgram, setNewProgram] = useState({
    title: '',
    description: '',
    classLocation: '',
    capacity: 15,
    schedules: [{ dayOfWeek: 'MON', startTime: '15:00', endTime: '16:00' }],
  });

  const [students, setStudents] = useState<any[]>([]);

  // ===========================
  // ⭐ 학생 목록 조회
  // ===========================
  const handleViewStudents = async (program: Program) => {
    try {
      const { getStudentsByProgram } = await import('../api/getProgram');
      const list = await getStudentsByProgram(program.classId);
      setStudents(list);
      setSelectedProgram(program);
    } catch (err) {
      console.error(err);
      toast.error('수강생 목록을 불러오지 못했습니다.');
    }
  };

  // ===========================
  // ⭐ 프로그램 생성
  // ===========================
  const handleCreateProgram = async () => {
    try {
      const payload = {
        title: newProgram.title,
        description: newProgram.description,
        capacity: Number(newProgram.capacity),
        classLocation: newProgram.classLocation,
        schedules: newProgram.schedules,
      };

      const created = await createProgram({
        ...payload,
        schedules: payload.schedules.map(s => ({
          ...s,
          dayOfWeek: s.dayOfWeek as
            | "MON"
            | "TUE"
            | "WED"
            | "THU"
            | "FRI"
            | "SAT"
            | "SUN",
        })),
      });

      toast('프로그램이 생성되었습니다.');

      await fetchPrograms();
      setOpenCreate(false);
    } catch (err) {
      console.error(err);
      toast.error('프로그램 생성에 실패했습니다.');
    }
  };

  // ===========================
  // ⭐ 프로그램 삭제
  // ===========================
  const handleDeleteProgram = async (classId: number) => {
    try {
      await deleteProgram(classId);
      toast('프로그램이 삭제되었습니다.');
      await fetchPrograms();
    } catch (err) {
      console.error(err);
      toast.error('프로그램 삭제에 실패했습니다.');
    }
  };

  // ===========================
  // ⭐ 프로그램 수정
  // ===========================
  const handleEditProgram = (program: Program) => {
    setEditingProgram({
      ...program,
      schedules: [...(program.schedules ?? [])], // 안전 처리
    });
    setOpenEdit(true);
  };

  const handleUpdateProgram = async () => {
    if (!editingProgram) return;

    try {
      const payload = {
        title: editingProgram.title,
        description: editingProgram.description,
        capacity: Number(editingProgram.capacity),
        classLocation: editingProgram.classLocation,
        schedules: editingProgram.schedules ?? [],
      };

      const updated = await updateProgram(editingProgram.classId, payload);

      toast('프로그램이 수정되었습니다.');

      await fetchPrograms();
      setOpenEdit(false);
    } catch (err) {
      console.error(err);
      toast.error('프로그램 수정에 실패했습니다.');
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2>내 프로그램</h2>

      {/* 신규 생성 버튼 */}
      <div className="flex justify-end">
        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus className="w-4 h-4" /> 프로그램 개설
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>프로그램 개설</DialogTitle>
              <DialogDescription>새로운 프로그램을 만들어주세요.</DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div>
                <Label>제목</Label>
                <Input
                  value={newProgram.title}
                  onChange={(e) =>
                    setNewProgram({ ...newProgram, title: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>설명</Label>
                <Textarea
                  rows={3}
                  value={newProgram.description}
                  onChange={(e) =>
                    setNewProgram({ ...newProgram, description: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>장소</Label>
                <Input
                  value={newProgram.classLocation}
                  onChange={(e) =>
                    setNewProgram({ ...newProgram, classLocation: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>정원</Label>
                <Input
                  type="number"
                  value={newProgram.capacity}
                  onChange={(e) =>
                    setNewProgram({ ...newProgram, capacity: Number(e.target.value) })
                  }
                />
              </div>

              <div>
                <Label>요일</Label>
                <select
                  className="border rounded p-2 w-full"
                  value={newProgram.schedules[0].dayOfWeek}
                  onChange={(e) =>
                    setNewProgram({
                      ...newProgram,
                      schedules: [{ ...newProgram.schedules[0], dayOfWeek: e.target.value as any }],
                    })
                  }
                >
                  {DAY_OPTIONS.map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <Label>시작 시간</Label>
                  <Input
                    type="time"
                    value={newProgram.schedules[0].startTime}
                    onChange={(e) =>
                      setNewProgram({
                        ...newProgram,
                        schedules: [{ ...newProgram.schedules[0], startTime: e.target.value }],
                      })
                    }
                  />
                </div>

                <div className="flex-1">
                  <Label>종료 시간</Label>
                  <Input
                    type="time"
                    value={newProgram.schedules[0].endTime}
                    onChange={(e) =>
                      setNewProgram({
                        ...newProgram,
                        schedules: [{ ...newProgram.schedules[0], endTime: e.target.value }],
                      })
                    }
                  />
                </div>
              </div>

              <Button className="w-full" onClick={handleCreateProgram}>
                프로그램 생성
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 프로그램 카드 */}
      <div className="space-y-3">
        {programs.map((program) => (
          <Card key={program.classId}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle>{program.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline">
                      <Users className="w-3 h-3 mr-1" />
                      {program.currentCount}/{program.capacity}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditProgram(program)}
                  >
                    수정
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:bg-red-50 hover:border-red-300"
                    onClick={() => handleDeleteProgram(program.classId)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-2">
              <p className="text-sm text-gray-700">{program.description}</p>

              <div className="flex flex-col gap-1 text-sm text-gray-600">
                {(program.schedules ?? []).map((s, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{`${s.dayOfWeek} ${s.startTime}-${s.endTime}`}</span>
                  </div>
                ))}

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{program.classLocation}</span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="mt-2 flex items-center gap-1"
                onClick={() => handleViewStudents(program)}
              >
                <Users className="w-4 h-4" /> 수강생 목록
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 수강생 모달 */}
      <Dialog open={!!selectedProgram} onOpenChange={() => setSelectedProgram(null)}>
        <DialogContent className="w-full max-w-md h-[65vh] flex flex-col">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-sm">{selectedProgram?.title}</DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              수강생 {students.length}명 / 정원 {selectedProgram?.capacity}명
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-1 mt-1">
            {students.map((student) => (
              <div
                key={student.studentId}
                className="flex items-center justify-between p-1 rounded border text-xs bg-gray-50 border-gray-200"
              >
                <div>
                  <p className="truncate">{student.name}</p>
                  <p className="text-[10px] text-gray-500">{student.email}</p>
                </div>
                <Button variant="outline" size="sm" className="px-1 py-0.5 text-[10px]">
                  출석
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* 수정 모달 */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>프로그램 수정</DialogTitle>
            <DialogDescription>프로그램 정보를 수정하세요.</DialogDescription>
          </DialogHeader>

          {editingProgram && (
            <div className="space-y-3">
              <div>
                <Label>제목</Label>
                <Input
                  value={editingProgram.title}
                  onChange={(e) =>
                    setEditingProgram({ ...editingProgram, title: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>설명</Label>
                <Textarea
                  rows={3}
                  value={editingProgram.description}
                  onChange={(e) =>
                    setEditingProgram({ ...editingProgram, description: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>장소</Label>
                <Input
                  value={editingProgram.classLocation}
                  onChange={(e) =>
                    setEditingProgram({ ...editingProgram, classLocation: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>정원</Label>
                <Input
                  type="number"
                  value={editingProgram.capacity}
                  onChange={(e) =>
                    setEditingProgram({ ...editingProgram, capacity: Number(e.target.value) })
                  }
                />
              </div>

              <div>
                <Label>요일</Label>
                <select
                  className="border rounded p-2 w-full"
                  value={editingProgram.schedules[0].dayOfWeek}
                  onChange={(e) =>
                    setEditingProgram({
                      ...editingProgram,
                      schedules: [{ ...editingProgram.schedules[0], dayOfWeek: e.target.value as any }],
                    })
                  }
                >
                  {DAY_OPTIONS.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <Label>시작 시간</Label>
                  <Input
                    type="time"
                    value={editingProgram.schedules[0].startTime}
                    onChange={(e) =>
                      setEditingProgram({
                        ...editingProgram,
                        schedules: [{ ...editingProgram.schedules[0], startTime: e.target.value }],
                      })
                    }
                  />
                </div>

                <div className="flex-1">
                  <Label>종료 시간</Label>
                  <Input
                    type="time"
                    value={editingProgram.schedules[0].endTime}
                    onChange={(e) =>
                      setEditingProgram({
                        ...editingProgram,
                        schedules: [{ ...editingProgram.schedules[0], endTime: e.target.value }],
                      })
                    }
                  />
                </div>
              </div>

              <Button className="w-full" onClick={handleUpdateProgram}>
                수정 완료
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
