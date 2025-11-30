// types.ts
export interface Program {
  classId: number;
  title: string;
  description: string;
  teacherName: string;
  classLocation: string;
  capacity: number;
  currentCount: number;
  schedules: {
    dayOfWeek: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
    startTime: string;
    endTime: string;
  }[];
}

export interface CreateProgramRequest {
  title: string;
  description: string;
  classLocation: string;
  capacity: number;
  schedules: {
    dayOfWeek: "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
    startTime: string;
    endTime: string;
  }[];
}



export interface Student {
  studentId: number;
  name: string;
  grade: number; 
  classNumber: number;
  studentNumber: number;
}


export interface CreateProgramResponse extends Program {}
