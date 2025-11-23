import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Calendar } from './ui/calendar';
import { Badge } from './ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { EnrolledProgram } from '../App';

interface ScheduleEvent {
  date: string;
  programs: {
    name: string;
    time: string;
    location: string;
    status?: 'normal' | 'cancelled' | 'changed';
  }[];
}

interface StudentScheduleProps {
  enrolledPrograms: EnrolledProgram[];
}

export function StudentSchedule({ enrolledPrograms }: StudentScheduleProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  // enrolledPrograms를 기반으로 스케줄 이벤트 생성
  const scheduleEvents: ScheduleEvent[] = useMemo(() => {
    const events: ScheduleEvent[] = [];
    const today = new Date();
    
    // 다음 30일간의 일정 생성
    for (let i = 0; i < 30; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      const dateString = currentDate.toISOString().split('T')[0];
      
      const dayOfWeek = currentDate.getDay();
      const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
      const currentDayKorean = daysOfWeek[dayOfWeek];
      
      // 해당 요일에 맞는 프로그램 찾기
      const dayPrograms = enrolledPrograms
        .filter(program => program.day.includes(currentDayKorean))
        .map(program => ({
          name: program.name,
          time: program.schedule.split(' ').slice(1).join(' '), // 시간 부분만 추출
          location: program.location,
          status: 'normal' as const,
        }));
      
      if (dayPrograms.length > 0) {
        events.push({
          date: dateString,
          programs: dayPrograms,
        });
      }
    }
    
    return events;
  }, [enrolledPrograms]);

  const getTodaySchedule = () => {
    if (!date) return null;
    const dateString = date.toISOString().split('T')[0];
    return scheduleEvents.find((event) => event.date === dateString);
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

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2>내 일정</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1 rounded text-sm ${
              viewMode === 'calendar' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            달력
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 rounded text-sm ${
              viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'
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
                onSelect={setDate}
                className="rounded-md border-0"
                modifiers={{
                  hasEvent: scheduleEvents.map((event) => new Date(event.date)),
                }}
                modifiersStyles={{
                  hasEvent: {
                    backgroundColor: '#dbeafe',
                    fontWeight: 'bold',
                  },
                }}
              />
            </CardContent>
          </Card>

          {todaySchedule ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {date?.toLocaleDateString('ko-KR', {
                    month: 'long',
                    day: 'numeric',
                  })}
                  의 일정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {todaySchedule.programs.map((program, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      program.status === 'cancelled'
                        ? 'bg-red-50 border-red-200'
                        : program.status === 'changed'
                        ? 'bg-orange-50 border-orange-200'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
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
            date && enrolledPrograms.length === 0 && (
              <Card>
                <CardContent className="pt-6 text-center text-gray-500">
                  <p className="text-sm">신청한 프로그램이 없습니다</p>
                </CardContent>
              </Card>
            )
          )}
        </>
      ) : (
        <div className="space-y-4">
          {scheduleEvents.length > 0 ? scheduleEvents.map((event, index) => (
            <Card key={index}>
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
                {event.programs.map((program, pIndex) => (
                  <div
                    key={pIndex}
                    className={`p-3 rounded-lg border ${
                      program.status === 'cancelled'
                        ? 'bg-red-50 border-red-200'
                        : program.status === 'changed'
                        ? 'bg-orange-50 border-orange-200'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
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
          )) : (
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
