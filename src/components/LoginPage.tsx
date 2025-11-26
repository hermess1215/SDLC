// LoginPage.tsx
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import type { User } from '../App';
import { loginApi } from '../api/LoginApi'; // LoginApi 임포트
import axios from 'axios'; // AxiosError 타입 사용을 위해 임포트

interface LoginPageProps {
  onLogin: (user: User) => void;
  onShowSignup: () => void;
}

export function LoginPage({ onLogin, onShowSignup }: LoginPageProps) {
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // 공통 로그인 처리 함수 (비동기 함수)
  const handleLogin = async (
    e: React.FormEvent,
    email: string,
    password: string,
    type: 'student' | 'teacher' | 'admin',
    loginFunction: (data: { email: string; password: string }) => Promise<{ accessToken: string }>,
  ) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      // API 호출
      const { accessToken } = await loginFunction({ email, password });

      // API 호출 성공 시:
      
      // 1. JWT 액세스 토큰을 로컬 스토리지에 저장
      localStorage.setItem('accessToken', accessToken);

      // 2. 로그인 성공 알림
      toast.success(`${type === 'student' ? '학생' : type === 'teacher' ? '선생님' : '관리자'} 로그인에 성공했습니다!`);

      // 3. 다음 페이지로 전환 (성공했을 때만 호출)
      onLogin({
        email,
        password,
        type,
      });

    } catch (error) {
      // API 호출 실패 시:
      console.error('로그인 실패:', error);
      let errorMessage = '로그인 중 오류가 발생했습니다.';
      
      if (axios.isAxiosError(error) && error.response) {
        // 401, 400, 그리고 현재 서버에서 발생하는 403까지 인증 실패로 간주
        if (error.response.status === 401 || 
            error.response.status === 400 || 
            error.response.status === 403 // 🚨 403을 명시적으로 추가
            ) {
          errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.';
        } else {
          errorMessage = `로그인 실패: 서버 오류 (${error.response.status})`;
        }
      }

      // 4. 오류 메시지만 표시하고 페이지 전환은 하지 않음
      toast.error(errorMessage);
    }
  };


  const handleStudentLogin = async (e: React.FormEvent) => {
    await handleLogin(e, studentEmail, studentPassword, 'student', loginApi.studentLogin);
  };

  const handleTeacherLogin = async (e: React.FormEvent) => {
    await handleLogin(e, teacherEmail, teacherPassword, 'teacher', loginApi.teacherLogin);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    await handleLogin(e, adminEmail, adminPassword, 'admin', loginApi.adminLogin);
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
                <CardDescription>학생 정보로 로그인하세요</CardDescription>
              </CardHeader>
              <CardContent>
                {/* onSubmit에 handleStudentLogin 연결 */}
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
                    <Label htmlFor="studentPassword">비밀번호</Label>
                    <Input
                      id="studentPassword"
                      type='password'
                      placeholder="••••••••"
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)}
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
                 {/* onSubmit에 handleTeacherLogin 연결 */}
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
                 {/* onSubmit에 handleAdminLogin 연결 */}
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