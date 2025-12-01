import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Search, Mail, Phone, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

import { usersApi, StudentData, TeacherData } from '../api/AdminUsersApi';

// 전화번호 포맷
function formatPhoneNumber(num: string) {
  if (!num) return '';
  const digits = num.replace(/\D/g, '');

  if (digits.length === 11)
    return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');

  if (digits.length === 10)
    return digits.replace(/(\d{2,3})(\d{3})(\d{4})/, '$1-$2-$3');

  return num;
}

export function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<StudentData[]>([]);
  const [teachers, setTeachers] = useState<TeacherData[]>([]);

  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherData | null>(null);
  const [deleteTargetStudent, setDeleteTargetStudent] = useState<StudentData | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const studentRes = await usersApi.getStudents();
      const teacherRes = await usersApi.getTeachers();

      setStudents(studentRes);
      setTeachers(teacherRes);
    };

    fetchUsers();
  }, []);

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(s.studentId).includes(searchQuery) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 실제 삭제
  const handleDeleteStudent = async () => {
    if (!deleteTargetStudent) return;

    await usersApi.deleteStudent(deleteTargetStudent.studentId);

    setStudents((prev) =>
      prev.filter((s) => s.studentId !== deleteTargetStudent.studentId)
    );

    setDeleteTargetStudent(null);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="sticky top-0 bg-gray-50 pb-2 z-10">
        <h2 className="mb-3">사용자 관리</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="이름, 이메일로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="students" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="students">학생 ({students.length})</TabsTrigger>
          <TabsTrigger value="teachers">선생님 ({teachers.length})</TabsTrigger>
        </TabsList>

        {/* 학생 목록 */}
        <TabsContent value="students" className="space-y-3 mt-4">
          {filteredStudents.map((student) => (
            <Card
              key={student.studentId}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedStudent(student)}
            >
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p>{student.name}</p>
                      <Badge variant="outline" className="text-xs">
                        {student.grade}학년 {student.classNo}반
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">{student.email}</p>

                    <p className="text-sm text-gray-600">
                      번호: {student.classNumber}
                    </p>
                  </div>

                  {/* 학생만 상세 / 삭제 */}
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStudent(student);
                        }}
                      >
                        상세 정보
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStudent(null); // 상세모달 방지
                          setDeleteTargetStudent(student);
                        }}
                      >
                        삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* 교사 목록 */}
        <TabsContent value="teachers" className="space-y-3 mt-4">
          {filteredTeachers.map((teacher) => (
            <Card
              key={teacher.teacherId}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedTeacher(teacher)}
            >
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{teacher.name}</p>
                    <p className="text-sm text-gray-600 mb-1">{teacher.email}</p>

                    <p className="text-sm text-gray-600">
                      연락처: {formatPhoneNumber(teacher.phoneNumber)}
                    </p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTeacher(teacher);
                        }}
                      >
                        상세 정보
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* 학생 상세 */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedStudent?.name}</DialogTitle>
            <DialogDescription>
              {selectedStudent?.grade}학년 {selectedStudent?.classNo}반
            </DialogDescription>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4" />
                  <span>{selectedStudent.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4" />
                  <span>{formatPhoneNumber(selectedStudent.phoneNumber)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 교사 상세 */}
      <Dialog open={!!selectedTeacher} onOpenChange={() => setSelectedTeacher(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedTeacher?.name}</DialogTitle>
          </DialogHeader>

          {selectedTeacher && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4" />
                  <span>{selectedTeacher.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4" />
                  <span>{formatPhoneNumber(selectedTeacher.phoneNumber)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 모달 (삭제만 보여줌) */}
      <Dialog open={!!deleteTargetStudent} onOpenChange={() => setDeleteTargetStudent(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>학생 삭제</DialogTitle>
            <DialogDescription>
              정말로{' '}
              <span className="font-semibold">
                {deleteTargetStudent?.name}
              </span>
              학생 계정을 삭제할까요?
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center gap-2 mt-4">
            <Button
              variant="destructive"
              onClick={handleDeleteStudent}
            >
              삭제
            </Button>
            <Button variant="outline" onClick={() => setDeleteTargetStudent(null)}>
              취소
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
