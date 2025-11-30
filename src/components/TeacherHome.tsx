// TeacherHome.tsx
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { BookOpen, Users, Calendar } from 'lucide-react';
import { teacherApi, Classes } from '../api/TeacherHomeApi';

interface TodayClass {
  id: number;
  name: string;
  time: string;
  students: number;
  location: string;
  status?: 'active' | 'cancelled';
}

export function TeacherHome() {
  const [programCount, setProgramCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [thisWeekClasses, setThisWeekClasses] = useState(0);
  const [todayClasses, setTodayClasses] = useState<TodayClass[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ 모든 수업 가져오기
        const classes: Classes[] = await teacherApi.getAllClasses();

        // 통계 계산
        setProgramCount(classes.length);
        setStudentCount(classes.reduce((sum, c) => sum + c.currentCount, 0));

        const today = new Date();
        const dayOfWeekStr = ['SUN','MON','TUE','WED','THU','FRI','SAT'][today.getDay()];

        const todayFiltered: TodayClass[] = [];

        classes.forEach((cls) => {
          cls.schedules.forEach((s) => {
            if (s.dayOfWeek === dayOfWeekStr) {
              todayFiltered.push({
                id: cls.classId,
                name: cls.title,
                time: `${s.startTime} - ${s.endTime}`,
                students: cls.currentCount,
                location: cls.classLocation,
                status: 'active'
              });
            }
          });
        });

        setTodayClasses(todayFiltered);

        // 이번 주 수업 수
        setThisWeekClasses(
          classes.reduce((count, cls) => count + cls.schedules.length, 0)
        );

      } catch (err) {
        console.error('대시보드 불러오기 실패', err);
      }
    };

    fetchData();
  }, []);

  const stats = [
    { label: '운영 중인 프로그램', value: programCount, icon: BookOpen, color: 'bg-blue-500' },
    { label: '총 수강생', value: studentCount, icon: Users, color: 'bg-green-500' },
    { label: '이번 주 수업', value: thisWeekClasses, icon: Calendar, color: 'bg-purple-500' },
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

      {/* 오늘의 수업 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">오늘의 수업</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {todayClasses.length === 0 ? (
            <p className="text-gray-500">오늘 수업이 없습니다.</p>
          ) : (
            todayClasses.map((classItem) => (
              <div key={classItem.id} className="p-3 rounded-lg bg-gray-50">
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
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
