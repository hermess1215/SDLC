import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { GraduationCap, UserCircle } from 'lucide-react';
import type { User } from '../App';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onShowSignup: () => void;
}

export function LoginPage({ onLogin, onShowSignup }: LoginPageProps) {
  const [studentEmail, setStudentEmail] = useState('');
  const [studentName, setStudentName] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentEmail && studentName) {
      onLogin({
        email: studentEmail,
        name: studentName,
        type: 'student',
      });
    }
  };

  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (teacherEmail && teacherPassword) {
      onLogin({
        email: teacherEmail,
        name: teacherEmail.split('@')[0],
        type: 'teacher',
      });
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmail && adminPassword) {
      onLogin({
        email: adminEmail,
        name: '관리자',
        type: 'admin',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <GraduationCap className="w-16 h-16 mx-auto mb-4 text-white" />
          <h1 className="text-white mb-2">방과후 학습 관리</h1>
          <p className="text-blue-100">학생과 선생님을 위한 통합 플랫폼</p>
        </div>

        <Tabs defaultValue="student" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="student">학생</TabsTrigger>
            <TabsTrigger value="teacher">선생님</TabsTrigger>
            <TabsTrigger value="admin">관리자</TabsTrigger>
          </TabsList>

          <TabsContent value="student">
            <Card>
              <CardHeader>
                <CardTitle>학생 로그인</CardTitle>
                <CardDescription>학생증 정보로 로그인하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleStudentLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentEmail">이메일</Label>
                    <Input
                      id="studentEmail"
                      type="email"
                      placeholder="student@school.com"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="studentName">이름</Label>
                    <Input
                      id="studentName"
                      placeholder="홍길동"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    로그인
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teacher">
            <Card>
              <CardHeader>
                <CardTitle>선생님 로그인</CardTitle>
                <CardDescription>교직원 계정으로 로그인하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTeacherLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="teacherEmail">이메일</Label>
                    <Input
                      id="teacherEmail"
                      type="email"
                      placeholder="teacher@school.com"
                      value={teacherEmail}
                      onChange={(e) => setTeacherEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teacherPassword">비밀번호</Label>
                    <Input
                      id="teacherPassword"
                      type="password"
                      placeholder="••••••••"
                      value={teacherPassword}
                      onChange={(e) => setTeacherPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    로그인
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>관리자 로그인</CardTitle>
                <CardDescription>관리자 계정으로 로그인하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">이메일</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      placeholder="admin@school.com"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminPassword">비밀번호</Label>
                    <Input
                      id="adminPassword"
                      type="password"
                      placeholder="••••••••"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    로그인
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-4">
          <p className="text-white text-sm">
            계정이 없으신가요?{' '}
            <button
              onClick={onShowSignup}
              className="underline hover:text-blue-200 transition-colors"
            >
              회원가입
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
