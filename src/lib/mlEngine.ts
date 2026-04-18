import type { Student, Prediction, RiskLevel } from './types';

const WEIGHTS = {
  attendance: 0.25,
  assignments: 0.30,
  participation: 0.20,
  behavior: 0.25,
};

export function computePerformance(student: Student) {
  const subs = student.subjects;
  if (!subs.length) return { score: 0, factors: { attendanceImpact: 0, assignmentImpact: 0, participationImpact: 0, behaviorImpact: 0 } };

  const avg = (key: keyof typeof subs[0]) =>
    subs.reduce((s, x) => s + (x[key] as number), 0) / subs.length;

  const attendance = avg('attendance');           // 0-100
  const assignments = avg('assignments');         // 0-100
  const participation = avg('participation') * 10; // 1-10 -> 0-100
  const behavior = avg('behavior') * 10;          // 1-10 -> 0-100

  const score =
    attendance * WEIGHTS.attendance +
    assignments * WEIGHTS.assignments +
    participation * WEIGHTS.participation +
    behavior * WEIGHTS.behavior;

  return {
    score: Math.round(score * 10) / 10,
    factors: {
      attendanceImpact: Math.round(attendance * WEIGHTS.attendance * 10) / 10,
      assignmentImpact: Math.round(assignments * WEIGHTS.assignments * 10) / 10,
      participationImpact: Math.round(participation * WEIGHTS.participation * 10) / 10,
      behaviorImpact: Math.round(behavior * WEIGHTS.behavior * 10) / 10,
    },
  };
}

export function deriveRisk(score: number): RiskLevel {
  if (score < 50) return 'high';
  if (score < 70) return 'medium';
  return 'low';
}

export function findWeakAreas(student: Student): string[] {
  const weak: string[] = [];
  for (const s of student.subjects) {
    if (s.score < 60) weak.push(`${s.name} (Score: ${s.score})`);
    if (s.attendance < 75) weak.push(`${s.name} attendance (${s.attendance}%)`);
    if (s.assignments < 60) weak.push(`${s.name} assignments`);
    if (s.participation < 5) weak.push(`${s.name} participation`);
    if (s.behavior < 5) weak.push(`${s.name} behavior`);
  }
  return weak.slice(0, 6);
}

export function generateRecommendations(student: Student, weak: string[]): string[] {
  const recs: string[] = [];
  const subs = student.subjects;
  const lowAtt = subs.find(s => s.attendance < 75);
  const lowAsg = subs.find(s => s.assignments < 60);
  const lowPart = subs.find(s => s.participation < 5);
  const lowBeh = subs.find(s => s.behavior < 5);
  const lowScore = subs.find(s => s.score < 60);

  if (lowAtt) recs.push(`Schedule a parent meeting to address declining attendance in ${lowAtt.name}.`);
  if (lowAsg) recs.push(`Provide structured assignment support and weekly check-ins for ${lowAsg.name}.`);
  if (lowPart) recs.push(`Engage ${student.name.split(' ')[0]} with collaborative group work to boost participation.`);
  if (lowBeh) recs.push(`Implement positive behavior reinforcement plan with the school counselor.`);
  if (lowScore) recs.push(`Enroll in tutoring sessions for ${lowScore.name} — focus on foundational concepts.`);

  if (!recs.length) {
    recs.push('Maintain current pace — student is performing on or above target.');
    recs.push('Consider enrichment activities or advanced topics for sustained growth.');
  }

  // Add a couple of universal nudges
  if (weak.length > 2) {
    recs.push('Set up bi-weekly progress reviews with measurable academic goals.');
  }
  return recs.slice(0, 5);
}

export function runPrediction(student: Student): Prediction {
  const { score, factors } = computePerformance(student);
  const risk = deriveRisk(score);
  const weak = findWeakAreas(student);
  const recs = generateRecommendations(student, weak);
  // Confidence = how much data we have (subjects) + variance proxy
  const confidence = Math.min(98, 70 + student.subjects.length * 4 + (risk === 'low' ? 8 : 0));

  return {
    id: 'pred_' + Math.random().toString(36).slice(2, 10),
    studentId: student.id,
    predictedScore: score,
    riskLevel: risk,
    confidence,
    weakAreas: weak,
    recommendations: recs,
    factors,
    generatedAt: new Date().toISOString(),
  };
}
