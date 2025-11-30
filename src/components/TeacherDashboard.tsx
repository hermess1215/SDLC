// TeacherDashboard.tsx
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Home, BookOpen, Bell, LogOut } from 'lucide-react';
import { TeacherHome } from './TeacherHome';
import { TeacherPrograms } from './TeacherPrograms';
import { TeacherAnnouncements } from './TeacherAnnouncements';
import { programApi, Program } from '../api/TeacherProgramApi';

interface TeacherDashboardProps {
  onLogout: () => void;
}

type TeacherTab = 'home' | 'programs' | 'announcements';

export function TeacherDashboard({ onLogout }: TeacherDashboardProps) {
  const [activeTab, setActiveTab] = useState<TeacherTab>('home');
  const [teacherPrograms, setTeacherPrograms] = useState<Program[]>([]);

  // 프로그램 API 호출
  const fetchPrograms = async () => {
    try {
      const data = await programApi.getPrograms();
      setTeacherPrograms(data);
    } catch (err) {
      console.error('프로그램 불러오기 실패', err);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">교직원 대시보드</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onLogout}>
          <LogOut className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto pb-20">
        {activeTab === 'home' && <TeacherHome />}
        {activeTab === 'programs' && (
          <TeacherPrograms
            programs={teacherPrograms}
            setPrograms={setTeacherPrograms}
            fetchPrograms={fetchPrograms}
          />
        )}
        {activeTab === 'announcements' && (
          <TeacherAnnouncements programs={teacherPrograms} />
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="flex items-center justify-around px-4 py-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 px-4 py-2 ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-600'}`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">홈</span>
          </button>
          <button
            onClick={() => setActiveTab('programs')}
            className={`flex flex-col items-center gap-1 px-4 py-2 ${activeTab === 'programs' ? 'text-blue-600' : 'text-gray-600'}`}
          >
            <BookOpen className="w-6 h-6" />
            <span className="text-xs">프로그램 관리</span>
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`flex flex-col items-center gap-1 px-4 py-2 ${activeTab === 'announcements' ? 'text-blue-600' : 'text-gray-600'}`}
          >
            <Bell className="w-6 h-6" />
            <span className="text-xs">공지 관리</span>
          </button>
        </div>
      </div>
    </div>
  );
}
