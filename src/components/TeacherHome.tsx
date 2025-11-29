import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { BookOpen, Users, Calendar, TrendingUp } from 'lucide-react';
import type { User } from '../App';

interface TeacherHomeProps {
  user: User;
}

export function TeacherHome({ user }: TeacherHomeProps) {
  const stats = [
    { label: '운영 중인 프로그램', value: '3', icon: BookOpen, color: 'bg-blue-500' },
    { label: '총 수강생', value: '42', icon: Users, color: 'bg-green-500' },
    { label: '이번 주 수업', value: '9', icon: Calendar, color: 'bg-purple-500' },
  ];

  const todayClasses = [
    {
      id: 1,
      name: '코딩 교실',
      time: '15:00 - 16:30',
      students: 15,
      location: '컴퓨터실',
    },
    {
      id: 2,
      name: '과학 실험반',
      time: '15:00 - 16:30',
      students: 14,
      location: '과학실',
      status: 'cancelled',
    },
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-4 text-center">
              <div
                className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-2`}
              >
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl mb-1">{stat.value}</p>
              <p className="text-xs text-gray-600">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Today's Classes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">오늘의 수업</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {todayClasses.map((classItem) => (
            <div
              key={classItem.id}
              className={`p-3 rounded-lg ${
                classItem.status === 'cancelled' ? 'bg-red-50' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p>{classItem.name}</p>
                  <p className="text-sm text-gray-600">{classItem.time}</p>
                </div>
                {classItem.status === 'cancelled' && (
                  <Badge variant="destructive">휴강</Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{classItem.students}명</span>
                </div>
                <span>· {classItem.location}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
