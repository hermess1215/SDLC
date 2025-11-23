import { useState } from 'react';
import { Button } from './ui/button';
import { Home, BookOpen, Bell, LogOut, Users } from 'lucide-react';
import { TeacherHome } from './TeacherHome';
import { TeacherPrograms } from './TeacherPrograms';
import { TeacherAnnouncements } from './TeacherAnnouncements';
import type { User } from '../App';

interface TeacherDashboardProps {
  user: User;
  onLogout: () => void;
}

type TeacherTab = 'home' | 'programs' | 'announcements';

export interface Program {
  id: number;
  name: string;
  description: string;
  schedule: string;
  location: string;
  capacity: number;
  enrolled: number;
  category: string;
}

export function TeacherDashboard({ user, onLogout }: TeacherDashboardProps) {
  const [activeTab, setActiveTab] = useState<TeacherTab>('home');
  const [programs, setPrograms] = useState<Program[]>([
    {
      id: 1,
      name: '코딩 교실',
      description: '파이썬 기초부터 프로젝트까지 배우는 코딩 수업입니다.',
      schedule: '월, 수, 금 15:00-16:30',
      location: '컴퓨터실',
      capacity: 20,
      enrolled: 15,
      category: 'IT',
    },
    {
      id: 2,
      name: '과학 실험반',
      description: '재미있는 과학 실험을 직접 해보는 수업입니다.',
      schedule: '화, 목 15:00-16:30',
      location: '과학실',
      capacity: 18,
      enrolled: 14,
      category: '과학',
    },
  ]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">교직원</p>
          <p>{user.name} 선생님</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onLogout}>
          <LogOut className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto pb-20">
        {activeTab === 'home' && <TeacherHome user={user} />}
        {activeTab === 'programs' && <TeacherPrograms programs={programs} setPrograms={setPrograms} />}
        {activeTab === 'announcements' && <TeacherAnnouncements programs={programs} />}
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
            <span className="text-xs">프로그램 관리</span>
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`flex flex-col items-center gap-1 px-4 py-2 ${
              activeTab === 'announcements' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Bell className="w-6 h-6" />
            <span className="text-xs">공지 관리</span>
          </button>
        </div>
      </div>
    </div>
  );
}