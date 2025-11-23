import { useState } from 'react';
import { Button } from './ui/button';
import { Home, Calendar, LogOut, BookOpen } from 'lucide-react';
import { StudentHome } from './StudentHome';
import { StudentPrograms } from './StudentPrograms';
import { StudentSchedule } from './StudentSchedule';
import type { User, EnrolledProgram } from '../App';

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
  enrolledPrograms: EnrolledProgram[];
  onEnrollProgram: (program: EnrolledProgram) => void;
}

type StudentTab = 'home' | 'programs' | 'schedule';

export function StudentDashboard({ user, onLogout, enrolledPrograms, onEnrollProgram }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState<StudentTab>('home');

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{user.studentId}</p>
          <p>{user.name} 학생</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onLogout}>
          <LogOut className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto pb-20">
        {activeTab === 'home' && <StudentHome user={user} enrolledPrograms={enrolledPrograms} />}
        {activeTab === 'programs' && <StudentPrograms onEnrollProgram={onEnrollProgram} enrolledPrograms={enrolledPrograms} />}
        {activeTab === 'schedule' && <StudentSchedule enrolledPrograms={enrolledPrograms} />}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="flex items-center justify-around px-4 py-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 px-4 py-2 ${
              activeTab === 'home' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">홈</span>
          </button>
          <button
            onClick={() => setActiveTab('programs')}
            className={`flex flex-col items-center gap-1 px-4 py-2 ${
              activeTab === 'programs' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <BookOpen className="w-6 h-6" />
            <span className="text-xs">프로그램</span>
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex flex-col items-center gap-1 px-4 py-2 ${
              activeTab === 'schedule' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Calendar className="w-6 h-6" />
            <span className="text-xs">일정</span>
          </button>
        </div>
      </div>
    </div>
  );
}
