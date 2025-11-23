import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Search, Mail, Phone, Calendar, BookOpen, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface Student {
  id: string;
  name: string;
  studentId: string;
  grade: string;
  class: string;
  email: string;
  phone: string;
  enrolledPrograms: number;
  status: 'active' | 'inactive';
}

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  programs: number;
  students: number;
  status: 'active' | 'inactive';
}

export function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const students: Student[] = [
    {
      id: '1',
      name: '김민수',
      studentId: '20240101',
      grade: '1',
      class: '3',
      email: 'minsu@student.com',
      phone: '010-1234-5678',
      enrolledPrograms: 3,
      status: 'active',
    },
    {
      id: '2',
      name: '이지은',
      studentId: '20240102',
      grade: '2',
      class: '1',
      email: 'jieun@student.com',
      phone: '010-2345-6789',
      enrolledPrograms: 2,
      status: 'active',
    },
    {
      id: '3',
      name: '박준호',
      studentId: '20240103',
      grade: '1',
      class: '2',
      email: 'junho@student.com',
      phone: '010-3456-7890',
      enrolledPrograms: 4,
      status: 'active',
    },
  ];

  const teachers: Teacher[] = [
    {
      id: '1',
      name: '김선생님',
      email: 'kim@school.com',
      phone: '010-1111-2222',
      subject: 'IT',
      programs: 2,
      students: 35,
      status: 'active',
    },
    {
      id: '2',
      name: '이선생님',
      email: 'lee@school.com',
      phone: '010-3333-4444',
      subject: '예술',
      programs: 1,
      students: 12,
      status: 'active',
    },
    {
      id: '3',
      name: '박선생님',
      email: 'park@school.com',
      phone: '010-5555-6666',
      subject: '언어',
      programs: 1,
      students: 10,
      status: 'active',
    },
  ];

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.includes(searchQuery) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

        <TabsContent value="students" className="space-y-3 mt-4">
          {filteredStudents.map((student) => (
            <Card
              key={student.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedStudent(student)}
            >
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p>{student.name}</p>
                      <Badge variant="outline" className="text-xs">
                        {student.grade}학년 {student.class}반
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{student.studentId}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{student.enrolledPrograms}개 수강</span>
                      </div>
                      <Badge className="bg-green-500">활동중</Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>상세 정보</DropdownMenuItem>
                      <DropdownMenuItem>수강 내역</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">비활성화</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="teachers" className="space-y-3 mt-4">
          {filteredTeachers.map((teacher) => (
            <Card
              key={teacher.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedTeacher(teacher)}
            >
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p>{teacher.name}</p>
                      <Badge variant="outline">{teacher.subject}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{teacher.email}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>프로그램 {teacher.programs}개</span>
                      <span>·</span>
                      <span>학생 {teacher.students}명</span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>상세 정보</DropdownMenuItem>
                      <DropdownMenuItem>프로그램 관리</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">비활성화</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Student Detail Dialog */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedStudent?.name}</DialogTitle>
            <DialogDescription>
              {selectedStudent?.grade}학년 {selectedStudent?.class}반 · {selectedStudent?.studentId}
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-600" />
                  <span>{selectedStudent.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-600" />
                  <span>{selectedStudent.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="w-4 h-4 text-gray-600" />
                  <span>{selectedStudent.enrolledPrograms}개 프로그램 수강 중</span>
                </div>
              </div>
              <div className="pt-2 border-t">
                <h3 className="text-sm mb-2">수강 프로그램</h3>
                <div className="space-y-2">
                  <div className="p-2 bg-gray-50 rounded text-sm">코딩 교실</div>
                  <div className="p-2 bg-gray-50 rounded text-sm">미술 동아리</div>
                  <div className="p-2 bg-gray-50 rounded text-sm">영어 회화</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Teacher Detail Dialog */}
      <Dialog open={!!selectedTeacher} onOpenChange={() => setSelectedTeacher(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedTeacher?.name}</DialogTitle>
            <DialogDescription>{selectedTeacher?.subject} 담당</DialogDescription>
          </DialogHeader>
          {selectedTeacher && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-600" />
                  <span>{selectedTeacher.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-600" />
                  <span>{selectedTeacher.phone}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Card>
                  <CardContent className="pt-4 text-center">
                    <p className="text-2xl mb-1">{selectedTeacher.programs}</p>
                    <p className="text-sm text-gray-600">운영 프로그램</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 text-center">
                    <p className="text-2xl mb-1">{selectedTeacher.students}</p>
                    <p className="text-sm text-gray-600">총 수강생</p>
                  </CardContent>
                </Card>
              </div>
              <div className="pt-2 border-t">
                <h3 className="text-sm mb-2">운영 프로그램</h3>
                <div className="space-y-2">
                  <div className="p-2 bg-gray-50 rounded text-sm">코딩 교실 (15명)</div>
                  <div className="p-2 bg-gray-50 rounded text-sm">과학 실험반 (14명)</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
