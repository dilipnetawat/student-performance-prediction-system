import type { Student, Notification } from './types';

const NAMES = [
  'Aarav Sharma', 'Priya Patel', 'Liam Johnson', 'Sofia Garcia', 'Noah Kim',
  'Maya Chen', 'Ethan Brown', 'Zara Ahmed', 'Lucas Rivera', 'Aisha Khan',
  'Oliver Smith', 'Yuki Tanaka', 'Arjun Mehta', 'Emma Wilson', 'Diego Lopez',
  'Riya Singh', 'Mason Lee', 'Ananya Reddy', 'Felix Müller', 'Chloe Dupont',
];

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'];
const SECTIONS = ['A', 'B', 'C'];
const GRADES = ['9', '10', '11', '12'];

function rnd(min: number, max: number) {
  return Math.round(min + Math.random() * (max - min));
}

function avatarFor(name: string, seed: number) {
  // deterministic but varied gradient avatars
  const colors = [
    ['#6366f1', '#a855f7'],
    ['#06b6d4', '#3b82f6'],
    ['#10b981', '#06b6d4'],
    ['#f59e0b', '#f43f5e'],
    ['#ec4899', '#8b5cf6'],
    ['#14b8a6', '#22d3ee'],
  ];
  const c = colors[seed % colors.length];
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('');
  return `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'>
      <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='${c[0]}'/><stop offset='1' stop-color='${c[1]}'/>
      </linearGradient></defs>
      <rect width='80' height='80' rx='40' fill='url(#g)'/>
      <text x='50%' y='52%' text-anchor='middle' dominant-baseline='middle' font-family='Inter, sans-serif' font-weight='700' font-size='30' fill='white'>${initials}</text>
    </svg>`
  )}`;
}

export function buildSeedStudents(): Student[] {
  return NAMES.map((name, i) => {
    // Bias some students to be at-risk
    const profile = i % 5 === 0 ? 'high' : i % 3 === 0 ? 'medium' : 'low';
    const range = profile === 'high'
      ? { score: [35, 58], att: [55, 75], asg: [30, 55], part: [2, 5], beh: [3, 6] }
      : profile === 'medium'
      ? { score: [55, 75], att: [70, 88], asg: [55, 75], part: [4, 7], beh: [5, 8] }
      : { score: [75, 96], att: [85, 99], asg: [75, 96], part: [7, 10], beh: [7, 10] };

    const subjects = SUBJECTS.map(name => ({
      name,
      score: rnd(range.score[0], range.score[1]),
      attendance: rnd(range.att[0], range.att[1]),
      assignments: rnd(range.asg[0], range.asg[1]),
      participation: rnd(range.part[0], range.part[1]),
      behavior: rnd(range.beh[0], range.beh[1]),
    }));

    const overallAttendance = Math.round(subjects.reduce((s, x) => s + x.attendance, 0) / subjects.length);
    const avgScore = subjects.reduce((s, x) => s + x.score, 0) / subjects.length;
    const overallGPA = Math.round((avgScore / 25) * 10) / 10; // out of 4

    return {
      id: 'std_' + (1000 + i),
      studentId: `TRK-${2026}-${String(100 + i).padStart(4, '0')}`,
      name,
      email: name.toLowerCase().replace(/\s+/g, '.') + '@tracked.edu',
      grade: GRADES[i % GRADES.length],
      section: SECTIONS[i % SECTIONS.length],
      avatar: avatarFor(name, i),
      subjects,
      overallAttendance,
      overallGPA,
      riskLevel: profile as Student['riskLevel'],
      enrolledDate: new Date(Date.now() - rnd(60, 800) * 86400000).toISOString(),
    };
  });
}

export function buildSeedNotifications(students: Student[]): Notification[] {
  const atRisk = students.filter(s => s.riskLevel === 'high').slice(0, 4);
  const medium = students.filter(s => s.riskLevel === 'medium').slice(0, 3);
  const top = students.filter(s => s.riskLevel === 'low').slice(0, 2);
  const list: Notification[] = [];

  atRisk.forEach((s, i) => list.push({
    id: 'n_' + Math.random().toString(36).slice(2, 8),
    title: 'High Risk Detected',
    message: `${s.name} has been flagged as high risk. Predicted performance score is below 50.`,
    type: 'alert',
    studentId: s.id,
    isRead: i > 1,
    createdAt: new Date(Date.now() - i * 3600000).toISOString(),
  }));

  medium.forEach((s, i) => list.push({
    id: 'n_' + Math.random().toString(36).slice(2, 8),
    title: 'Attendance Warning',
    message: `${s.name}'s attendance has dropped below 80% — consider an early intervention.`,
    type: 'warning',
    studentId: s.id,
    isRead: false,
    createdAt: new Date(Date.now() - (4 + i) * 3600000).toISOString(),
  }));

  top.forEach((s, i) => list.push({
    id: 'n_' + Math.random().toString(36).slice(2, 8),
    title: 'Top Performer',
    message: `${s.name} has consistently scored above 90% — recommended for advanced coursework.`,
    type: 'success',
    studentId: s.id,
    isRead: i > 0,
    createdAt: new Date(Date.now() - (10 + i) * 3600000).toISOString(),
  }));

  list.push({
    id: 'n_' + Math.random().toString(36).slice(2, 8),
    title: 'Weekly Report Ready',
    message: 'Your class performance digest for this week has been generated.',
    type: 'info',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  });

  return list;
}
