// StudentSchedule.tsx
import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Calendar } from './ui/calendar';
import { Badge } from './ui/badge';
import { takingApi, TakingClassData } from '../api/TakingApi';

interface ScheduleEvent {
  date: string;
  programs: {
    name: string;
    time: string;
    location: string;
    status?: 'normal' | 'cancelled' | 'changed';
  }[];
}

export function StudentSchedule() {
  const [date, setDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [takingClasses, setTakingClasses] = useState<TakingClassData[]>([]);
  const [loading, setLoading] = useState(true);

  const dayMap: Record<string, string> = {
    MON: '월',
    TUE: '화',
    WED: '수',
    THU: '목',
    FRI: '금',
    SAT: '토',
    SUN: '일',
  };

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const data = await takingApi.getMyClasses();
        setTakingClasses(data);
      } catch (err) {
        console.error('수강 중인 클래스 불러오기 실패', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  // 한 달 동안의 스케줄 이벤트 생성
  const scheduleEvents: ScheduleEvent[] = useMemo(() => {
    const events: ScheduleEvent[] = [];
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysOfWeekEnglish = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const dateString = currentDate.toISOString().split('T')[0];
      const currentDayEnglish = daysOfWeekEnglish[currentDate.getDay()];

      const dayPrograms = takingClasses
        .filter(cls => cls.schedules.some(s => s.dayOfWeek === currentDayEnglish))
        .map(cls => {
          const schedule = cls.schedules.find(s => s.dayOfWeek === currentDayEnglish)!;
          return {
            name: cls.title,
            time: `${schedule.startTime} ~ ${schedule.endTime}`,
            location: cls.classLocation,
            status: 'normal' as const,
          };
        });

      if (dayPrograms.length > 0) {
        events.push({ date: dateString, programs: dayPrograms });
      }
    }
    return events;
  }, [takingClasses, date]);

  const getTodaySchedule = () => {
    const dateString = date.toISOString().split('T')[0];
    return scheduleEvents.find(e => e.date === dateString);
  };

  const todaySchedule = getTodaySchedule();

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'cancelled':
        return <Badge variant="destructive">휴강</Badge>;
      case 'changed':
        return <Badge className="bg-orange-500">일정변경</Badge>;
      default:
        return null;
    }
  };

  if (loading)
    return <p className="text-center p-6 text-gray-500">스케줄 불러오는 중...</p>;

  // 파란 배경 표시용 Date 배열 (방과후가 있는 날만)
  const eventDates: Date[] = scheduleEvents
    .filter(e =>
      e.programs.some(program => program.name.includes('방과후')) // 프로그램 이름에 '방과후' 포함 여부 체크
    )
    .map(e => {
      const parts = e.date.split('-');
      return new Date(
        parseInt(parts[0], 10),
        parseInt(parts[1], 10) - 1,
        parseInt(parts[2], 10)
      );
    });


  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2>내 일정</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1 rounded text-sm ${viewMode === 'calendar' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
          >
            달력
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 rounded text-sm ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
          >
            목록
          </button>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <>
          <Card>
            <CardContent className="pt-6">
              <Calendar
                mode="single"
                selected={date}
                onSelect={day => day && setDate(day)}
                className="rounded-md border-0"
                modifiers={{
                  hasEvent: eventDates,
                }}
                modifiersStyles={{
                  hasEvent: { backgroundColor: '#dbeafe', fontWeight: 'bold' },
                }}
              />
            </CardContent>
          </Card>

          {todaySchedule ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })} 일정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {todaySchedule.programs.map((program, idx) => (
                  <div key={idx} className="p-3 rounded-lg border bg-gray-50">
                    <div className="flex justify-between mb-1">
                      <p>{program.name}</p>
                      {getStatusBadge(program.status)}
                    </div>
                    <p className="text-sm text-gray-600">
                      {program.time} · {program.location}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                <p className="text-sm">오늘은 신청한 프로그램이 없습니다</p>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <div className="space-y-4">
          {scheduleEvents.length > 0 ? (
            scheduleEvents.map((event, idx) => (
              <Card key={idx}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    {new Date(event.date).toLocaleDateString('ko-KR', {
                      month: 'long',
                      day: 'numeric',
                      weekday: 'short',
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {event.programs.map((program, pIdx) => (
                    <div key={pIdx} className="p-3 rounded-lg border bg-gray-50">
                      <div className="flex justify-between mb-1">
                        <p className="text-sm">{program.name}</p>
                        {getStatusBadge(program.status)}
                      </div>
                      <p className="text-xs text-gray-600">
                        {program.time} · {program.location}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                <p className="text-sm">신청한 프로그램이 없습니다</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
