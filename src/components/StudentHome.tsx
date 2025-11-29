// src/components/StudentHome.tsx
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Clock, BookOpen } from 'lucide-react';
import { takingApi, TakingClassData } from '../api/TakingApi';

export function StudentHome() {
  const [myClasses, setMyClasses] = useState<TakingClassData[]>([]);
  const [loading, setLoading] = useState(true);

  // 영어 요일 → 한국어 요일 매핑
  const dayMap: Record<string, string> = {
    MON: '월',
    TUE: '화',
    WED: '수',
    THU: '목',
    FRI: '금',
    SAT: '토',
    SUN: '일',
  };

  const today = new Date();
  const todayKorean = ['일', '월', '화', '수', '목', '금', '토'][today.getDay()];

  useEffect(() => {
    async function fetchClasses() {
      try {
        const data = await takingApi.getMyClasses();
        setMyClasses(data);
      } finally {
        setLoading(false);
      }
    }
    fetchClasses();
  }, []);

  // 오늘 수업 필터링
  const todayClasses = myClasses
    .map(cls => {
      const todaySchedule = cls.schedules.find(s => dayMap[s.dayOfWeek] === todayKorean);
      if (!todaySchedule) return null;

      return {
        id: cls.classId,
        name: cls.title,
        location: cls.classLocation,
        time: `${todaySchedule.startTime} ~ ${todaySchedule.endTime}`,
      };
    })
    .filter(Boolean) as {
      id: number;
      name: string;
      location: string;
      time: string;
    }[];

  return (
    <div className="p-4 space-y-4">
      {/* 오늘 수업 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            오늘의 수업
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <p className="text-gray-500 text-sm">로딩 중...</p>
          ) : todayClasses.length > 0 ? (
            todayClasses.map(classItem => (
              <div
                key={classItem.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p>{classItem.name}</p>
                  <p className="text-sm text-gray-600">{classItem.location}</p>
                </div>
                <div className="text-right text-sm">{classItem.time}</div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">오늘은 수업이 없습니다.</p>
          )}
        </CardContent>
      </Card>

      {/* 수강 중인 프로그램 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            수강 중인 프로그램
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <p className="text-gray-500 text-sm">로딩 중...</p>
          ) : myClasses.length > 0 ? (
            myClasses.map(cls => (
              <div
                key={cls.classId}
                className="p-3 border rounded-lg hover:border-blue-500 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <p>{cls.title}</p>
                  <div className="flex gap-1">
                    {cls.schedules.map((s, idx) => (
                      <Badge key={idx} variant="outline">
                        {dayMap[s.dayOfWeek]}
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{cls.teacherName}</p>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">아직 신청한 프로그램이 없습니다</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
