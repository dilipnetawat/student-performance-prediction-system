export type Role = 'admin' | 'teacher' | 'student';
export type RiskLevel = 'low' | 'medium' | 'high';
export type NotifType = 'warning' | 'alert' | 'info' | 'success';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  createdAt: string;
}

export interface SubjectMetric {
  name: string;
  score: number;          // 0-100
  attendance: number;     // 0-100
  assignments: number;    // 0-100
  participation: number;  // 1-10
  behavior: number;       // 1-10
}

export interface Student {
  id: string;
  studentId: string;
  name: string;
  email: string;
  grade: string;
  section: string;
  avatar: string;
  subjects: SubjectMetric[];
  overallAttendance: number;
  overallGPA: number;
  riskLevel: RiskLevel;
  enrolledDate: string;
}

export interface Prediction {
  id: string;
  studentId: string;
  predictedScore: number;
  riskLevel: RiskLevel;
  confidence: number;
  weakAreas: string[];
  recommendations: string[];
  factors: {
    attendanceImpact: number;
    assignmentImpact: number;
    participationImpact: number;
    behaviorImpact: number;
  };
  generatedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotifType;
  studentId?: string;
  isRead: boolean;
  createdAt: string;
}
