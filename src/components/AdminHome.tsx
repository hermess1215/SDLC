import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Users, BookOpen, GraduationCap } from 'lucide-react';

export function AdminHome() {
  const stats = [
    { label: '전체 학생', value: '1,234', icon: Users, color: 'bg-blue-500' },
    { label: '전체 선생님', value: '45', icon: GraduationCap, color: 'bg-green-500' },
    { label: '운영 프로그램', value: '28', icon: BookOpen, color: 'bg-purple-500' },
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
        <CardContent className="pt-6">
          <h2 className="mb-2">시스템 관리 대시보드</h2>
          <p className="text-purple-100">전체 시스템 현황을 한눈에 확인하세요</p>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}
                >
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-2xl mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
