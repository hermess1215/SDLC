import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { StudentDashboard } from './components/StudentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AdminDashboard } from './components/AdminDashboard';

export type UserType = 'student' | 'teacher' | 'admin' | null;

export interface User {
  email: string;
  name?: string;
  password: string;
  confirmPassword?: string;
  grade?: string;
  classNo?: string;
  classNumber?: string;
  type: UserType;
}

export interface EnrolledProgram {
  id: number;
  name: string;
  teacher: string;
  schedule: string;
  location: string;
  day: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showSignup, setShowSignup] = useState(false);
  const [enrolledPrograms, setEnrolledPrograms] = useState<EnrolledProgram[]>([
    { id: 1, name: '코딩 교실', teacher: '김선생님', schedule: '월, 수, 금 15:00-16:30', location: '컴퓨터실', day: '월, 수, 금' },
    { id: 2, name: '미술 동아리', teacher: '이선생님', schedule: '월, 목 16:00-17:30', location: '미술실', day: '월, 목' },
    { id: 3, name: '영어 회화', teacher: '박선생님', schedule: '화, 목 15:30-17:00', location: '영어교실', day: '화, 목' },
  ]);

  const handleLogout = () => {
    setUser(null);
  };

  const handleEnrollProgram = (program: EnrolledProgram) => {
    // 이미 신청한 프로그램인지 확인
    const isAlreadyEnrolled = enrolledPrograms.some(p => p.id === program.id);
    if (!isAlreadyEnrolled) {
      setEnrolledPrograms([...enrolledPrograms, program]);
    }
  };

  if (!user) {
    if (showSignup) {
      return <SignupPage onSignup={setUser} onBackToLogin={() => setShowSignup(false)} />;
    }
    return <LoginPage onLogin={setUser} onShowSignup={() => setShowSignup(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user.type === 'student' ? (
        <StudentDashboard 
          user={user} 
          onLogout={handleLogout}
          enrolledPrograms={enrolledPrograms}
          onEnrollProgram={handleEnrollProgram}
        />
      ) : user.type === 'teacher' ? (
        <TeacherDashboard user={user} onLogout={handleLogout} />
      ) : (
        <AdminDashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
