import { useState } from 'react';
import { Button } from './ui/button';
import { Home, BookOpen, Users, LogOut } from 'lucide-react';
import { AdminHome } from './AdminHome';
import { AdminPrograms } from './AdminPrograms';
import { AdminUsers } from './AdminUsers';
import type { User } from '../App';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

type AdminTab = 'home' | 'programs' | 'users';

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('home');

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-sm text-purple-100">시스템 관리자</p>
          <p>{user.name}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onLogout} className="text-white hover:bg-white/20">
          <LogOut className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto pb-20">
        {activeTab === 'home' && <AdminHome />}
        {activeTab === 'programs' && <AdminPrograms />}
        {activeTab === 'users' && <AdminUsers />}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="flex items-center justify-around px-4 py-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 px-4 py-2 ${
              activeTab === 'home' ? 'text-purple-600' : 'text-gray-600'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">대시보드</span>
          </button>
          <button
            onClick={() => setActiveTab('programs')}
            className={`flex flex-col items-center gap-1 px-4 py-2 ${
              activeTab === 'programs' ? 'text-purple-600' : 'text-gray-600'
            }`}
          >
            <BookOpen className="w-6 h-6" />
            <span className="text-xs">프로그램</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex flex-col items-center gap-1 px-4 py-2 ${
              activeTab === 'users' ? 'text-purple-600' : 'text-gray-600'
            }`}
          >
            <Users className="w-6 h-6" />
            <span className="text-xs">사용자 관리</span>
          </button>
        </div>
      </div>
    </div>
  );
}
