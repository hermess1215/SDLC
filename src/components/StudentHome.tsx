import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Clock, BookOpen, Calendar } from 'lucide-react';
import type { User, EnrolledProgram } from '../App';

interface StudentHomeProps {
  user: User;
  enrolledPrograms: EnrolledProgram[];
}

export function StudentHome({ user, enrolledPrograms }: StudentHomeProps) {
  // 오늘의 요일 가져오기
  const today = new Date();
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  const todayKorean = daysOfWeek[today.getDay()];

  // 오늘 수업 필터링
  const todayClasses = enrolledPrograms
    .filter(program => program.day.includes(todayKorean))
    .map(program => ({
      id: program.id,
      name: program.name,
      time: program.schedule.split(' ').slice(1).join(' '),
      location: program.location,
    }));

  return (
    <div className="p-4 space-y-4">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
        <CardContent className="pt-6">
          <h2 className="mb-2">안녕하세요, {user.name}님!</h2>
          <p className="text-blue-100">오늘도 즐거운 방과후 활동 되세요</p>
        </CardContent>
      </Card>

      {/* Today's Classes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            오늘의 수업
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {todayClasses.map((classItem) => (
            <div
              key={classItem.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p>{classItem.name}</p>
                <p className="text-sm text-gray-600">{classItem.location}</p>
              </div>
              <div className="text-right">
                <p className="text-sm">{classItem.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* My Programs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            수강 중인 프로그램
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {enrolledPrograms.length > 0 ? (
            enrolledPrograms.map((program) => (
              <div
                key={program.id}
                className="p-3 border rounded-lg hover:border-blue-500 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <p>{program.name}</p>
                  <Badge variant="outline">{program.day}</Badge>
                </div>
                <p className="text-sm text-gray-600">{program.teacher}</p>
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
