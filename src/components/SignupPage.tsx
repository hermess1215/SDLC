import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { GraduationCap, ArrowLeft, Upload } from 'lucide-react';
import { toast } from 'sonner';
import type { User } from '../App';
import { signupApi } from '../api/SignupApi';

interface SignupPageProps {
  onSignup: (user: User) => void;
  onBackToLogin: () => void;
}

export function SignupPage({ onSignup, onBackToLogin }: SignupPageProps) {
  // Student form
  const [studentData, setStudentData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    grade: '',   // 학년
    classNo: '', // 반
    classNumber: '', // 번호
    password: '',
    confirmPassword: '',
  });

  // Teacher form
  const [teacherData, setTeacherData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    authCode: '',
  });

  // Admin form
  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    authCode: '',
  });

  const handleStudentSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (studentData.password !== studentData.confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다');
      return;
    }

    try {
      const response = await signupApi.studentSignup({
        name: studentData.name,
        email: studentData.email,
        password: studentData.password,
        grade: studentData.grade,
        classNo: studentData.classNo,
        classNumber: studentData.classNumber,
        phoneNumber: studentData.phoneNumber,
      });

      console.log('서버 응답:', response);
      toast.success('회원가입이 완료되었습니다!');
      onSignup({
        email: studentData.email,
        name: studentData.name,
        password: studentData.password,
        confirmPassword: studentData.confirmPassword,
        type: 'student',
        grade: studentData.grade,
        classNo: studentData.classNo,
        classNumber: studentData.classNumber,
      });
    } catch (error: any) {
      console.error('회원가입 실패:', error);
      toast.error('회원가입 중 오류가 발생했습니다.');
    }
  };

  const handleTeacherSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (teacherData.password !== teacherData.confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다');
      return;
    }

    try {
      const response = await signupApi.teacherSignup({
        name: teacherData.name,
        email: teacherData.email,
        password: teacherData.password,
        phoneNumber: teacherData.phoneNumber,
        authCode: teacherData.authCode,
      });

      console.log('서버 응답:', response);
      toast.success('회원가입이 완료되었습니다!');
      onSignup({
        email: teacherData.email,
        name: teacherData.name,
        password: teacherData.password,
        confirmPassword: teacherData.confirmPassword,
        type: 'teacher',
      });
    } catch (error: any) {
      console.error('회원가입 실패:', error);
      toast.error('회원가입 중 오류가 발생했습니다.');
    }
  };

  const handleAdminSignup = async (e: React.FormEvent) => {
  e.preventDefault();

  if (adminData.password !== adminData.confirmPassword) {
    toast.error('비밀번호가 일치하지 않습니다');
    return;
  }

  if (adminData.authCode !== 'ADMIN2025') {
    toast.error('유효하지 않은 초대 코드입니다');
    return;
  }

  try {
    const response = await signupApi.adminSignup({
      name: adminData.name,
      email: adminData.email,
      password: adminData.password,
      authCode: adminData.authCode,
    });

    console.log('서버 응답:', response);
    toast.success('관리자 계정이 생성되었습니다!');
    onSignup({
      email: adminData.email,
      name: adminData.name,
      password: adminData.password,
      confirmPassword: adminData.confirmPassword,
      type: 'admin',
    });
  } catch (error: any) {
    console.error('관리자 회원가입 실패:', error);
    toast.error('회원가입 중 오류가 발생했습니다.');
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={onBackToLogin}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1 text-center">
            <GraduationCap className="w-16 h-16 mx-auto mb-4 text-white" />
            <h1 className="text-white mb-2">회원가입</h1>
            <p className="text-blue-100">방과후 학습 관리 시스템</p>
          </div>
        </div>

        <Tabs defaultValue="student" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="student">학생</TabsTrigger>
            <TabsTrigger value="teacher">선생님</TabsTrigger>
            <TabsTrigger value="admin">관리자</TabsTrigger>
          </TabsList>

          {/* Student Signup */}
          <TabsContent value="student">
            <Card className="max-h-[calc(100vh-250px)] overflow-y-auto">
              <CardHeader>
                <CardTitle>학생 회원가입</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleStudentSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentName">이름 *</Label>
                    <Input
                      id="studentName"
                      placeholder="홍길동"
                      value={studentData.name}
                      onChange={(e) => setStudentData({ ...studentData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="studentGrade">학년 *</Label>
                    <Input
                      id="studentGrade"
                      type="number"
                      min={1}
                      max={6}
                      placeholder="학년 입력"
                      value={studentData.grade}
                      onChange={(e) => setStudentData({ ...studentData, grade: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="studentClassNo">반 *</Label>
                    <Input
                      id="studentClassNo"
                      type="number"
                      min={1}
                      placeholder="반 입력"
                      value={studentData.classNo}
                      onChange={(e) => setStudentData({ ...studentData, classNo: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="classNumber">번호 *</Label>
                    <Input
                      id="classNumber"
                      type="number"
                      min={1}
                      placeholder="번호 입력"
                      value={studentData.classNumber}
                      onChange={(e) => setStudentData({ ...studentData, classNumber: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="studentEmail">이메일 *</Label>
                    <Input
                      id="studentEmail"
                      type="email"
                      placeholder="student@school.com"
                      value={studentData.email}
                      onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="studentPhoneNumber">전화번호 *</Label>
                    <Input
                      id="studentPhoneNumber"
                      type="tel"
                      placeholder="010-1234-5678"
                      value={studentData.phoneNumber}
                      onChange={(e) => setStudentData({ ...studentData, phoneNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="studentPassword">비밀번호 *</Label>
                    <Input
                      id="studentPassword"
                      type="password"
                      placeholder="••••••••"
                      value={studentData.password}
                      onChange={(e) => setStudentData({ ...studentData, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="studentConfirmPassword">비밀번호 확인 *</Label>
                    <Input
                      id="studentConfirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={studentData.confirmPassword}
                      onChange={(e) =>
                        setStudentData({ ...studentData, confirmPassword: e.target.value })
                      }
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    가입하기
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Teacher Signup */}
          <TabsContent value="teacher">
            <Card className="max-h-[calc(100vh-250px)] overflow-y-auto">
              <CardHeader>
                <CardTitle>선생님 회원가입</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTeacherSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="teacherName">이름 *</Label>
                    <Input
                      id="teacherName"
                      placeholder="홍길동"
                      value={teacherData.name}
                      onChange={(e) => setTeacherData({ ...teacherData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teacherEmail">이메일 *</Label>
                    <Input
                      id="teacherEmail"
                      type="email"
                      placeholder="teacher@school.com"
                      value={teacherData.email}
                      onChange={(e) => setTeacherData({ ...teacherData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teacherauthCode">초대 코드 *</Label>
                    <Input
                      id="teacherauthCode"
                      placeholder="초대 코드를 입력하세요"
                      value={teacherData.authCode}
                      onChange={(e) => setTeacherData({ ...teacherData, authCode: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teacherPhoneNumber">전화번호 *</Label>
                    <Input
                      id="teacherPhoneNumber"
                      type="tel"
                      placeholder="010-1234-5678"
                      value={teacherData.phoneNumber}
                      onChange={(e) => setTeacherData({ ...teacherData, phoneNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teacherPassword">비밀번호 *</Label>
                    <Input
                      id="teacherPassword"
                      type="password"
                      placeholder="••••••••"
                      value={teacherData.password}
                      onChange={(e) => setTeacherData({ ...teacherData, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teacherConfirmPassword">비밀번호 확인 *</Label>
                    <Input
                      id="teacherConfirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={teacherData.confirmPassword}
                      onChange={(e) =>
                        setTeacherData({ ...teacherData, confirmPassword: e.target.value })
                      }
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    가입하기
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admin Signup */}
          <TabsContent value="admin">
            <Card className="max-h-[calc(100vh-250px)] overflow-y-auto">
              <CardHeader>
                <CardTitle>관리자 회원가입</CardTitle>
                <CardDescription>초대 코드가 필요합니다</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAdminSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminName">이름 *</Label>
                    <Input
                      id="adminName"
                      placeholder="홍길동"
                      value={adminData.name}
                      onChange={(e) => setAdminData({ ...adminData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">이메일 *</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      placeholder="admin@school.com"
                      value={adminData.email}
                      onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminauthCode">초대 코드 *</Label>
                    <Input
                      id="adminauthCode"
                      placeholder="초대 코드를 입력하세요"
                      value={adminData.authCode}
                      onChange={(e) => setAdminData({ ...adminData, authCode: e.target.value })}
                      required
                    />
                    <p className="text-xs text-gray-600">관리자만 접근할 수 있는 초대 코드가 필요합니다</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminPassword">비밀번호 *</Label>
                    <Input
                      id="adminPassword"
                      type="password"
                      placeholder="••••••••"
                      value={adminData.password}
                      onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminConfirmPassword">비밀번호 확인 *</Label>
                    <Input
                      id="adminConfirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={adminData.confirmPassword}
                      onChange={(e) =>
                        setAdminData({ ...adminData, confirmPassword: e.target.value })
                      }
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    가입하기
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-4">
          <p className="text-white text-sm">
            이미 계정이 있으신가요?{' '}
            <button
              onClick={onBackToLogin}
              className="underline hover:text-blue-200 transition-colors"
            >
              로그인
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
