import { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Users, BookOpen, GraduationCap } from 'lucide-react';
import { adminApi } from '../api/AdminHomeApi';

export function AdminHome() {
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [totalPrograms, setTotalPrograms] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const studentsData = await adminApi.getStudentsStats();
        const teachersData = await adminApi.getTeachersStats();
        const programsData = await adminApi.getProgramsStats();

        setTotalStudents(studentsData.length);
        setTotalTeachers(teachersData.length);
        setTotalPrograms(programsData.length);
      } catch (err) {
        console.error('관리자 대시보드 통계 불러오기 실패', err);
      }
    };

    fetchStats();
  }, []);

  const stats = [
    { label: '전체 학생', value: totalStudents, icon: Users, color: 'bg-blue-500' },
    { label: '전체 선생님', value: totalTeachers, icon: GraduationCap, color: 'bg-green-500' },
    { label: '운영 프로그램', value: totalPrograms, icon: BookOpen, color: 'bg-purple-500' },
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
