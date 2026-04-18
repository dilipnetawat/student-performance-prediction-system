import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import {
  ArrowLeft, Mail, Calendar, GraduationCap, Sparkles, Brain, Activity, AlertTriangle, Lightbulb,
} from 'lucide-react';
import { useStore } from '../lib/store';
import { Button } from '../components/ui/Button';
import { RiskBadge, Chip } from '../components/ui/Badge';
import { runPrediction } from '../lib/mlEngine';

export function StudentProfilePage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { user, students, predictions, predict } = useStore();
  const student = students.find(s => s.id === id);

  const livePrediction = useMemo(() => student ? runPrediction(student) : null, [student]);
  const history = predictions.filter(p => p.studentId === id).slice(0, 5);

  if (!student) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="font-medium text-gray-900">Student not found</p>
        <Button onClick={() => navigate('/app/students')} className="mt-4" icon={<ArrowLeft size={14} />}>Back to Students</Button>
      </div>
    );
  }

  const radarData = student.subjects.map(sb => ({
    subject: sb.name.slice(0, 4),
    score: sb.score,
    attendance: sb.attendance,
    assignments: sb.assignments,
  }));

  const subjectBars = student.subjects.map(sb => ({ name: sb.name, score: sb.score }));

  return (
    <div className="space-y-6">
      <Link to="/app/students" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition">
        <ArrowLeft size={14} /> All students
      </Link>

      {/* Hero header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-gray-200">
              <img src={student.avatar} alt={student.name} className="w-full h-full" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
              <RiskBadge level={student.riskLevel} />
            </div>
            <p className="text-gray-500 text-sm flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1.5"><Mail size={13} /> {student.email}</span>
              <span className="flex items-center gap-1.5"><GraduationCap size={13} /> Grade {student.grade} • Section {student.section}</span>
              <span className="flex items-center gap-1.5"><Calendar size={13} /> Enrolled {new Date(student.enrolledDate).toLocaleDateString()}</span>
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Chip color="violet">{student.studentId}</Chip>
              <Chip color="cyan">{student.subjects.length} subjects</Chip>
              <Chip color="emerald">GPA {student.overallGPA}</Chip>
            </div>
          </div>
          {user?.role !== 'student' && (
            <Button icon={<Sparkles size={16} />} onClick={() => predict(student.id)}>Run Prediction</Button>
          )}
        </div>

        {/* Big stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          <BigStat label="Predicted Score" value={livePrediction?.predictedScore || 0} color="blue" />
          <BigStat label="Attendance" value={`${student.overallAttendance}%`} color="cyan" />
          <BigStat label="GPA" value={student.overallGPA} color="green" />
          <BigStat label="Confidence" value={`${livePrediction?.confidence || 0}%`} color="amber" />
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-1">Performance Radar</h3>
          <p className="text-xs text-gray-400 mb-2">Score • Attendance • Assignments per subject</p>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 10 }} />
              <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
              <Radar name="Attendance" dataKey="attendance" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.15} />
              <Radar name="Assignments" dataKey="assignments" stroke="#22c55e" fill="#22c55e" fillOpacity={0.1} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-1">Subject Scores</h3>
          <p className="text-xs text-gray-400 mb-2">Current scores by subject</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectBars} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis type="number" stroke="#9ca3af" tick={{ fontSize: 11 }} domain={[0, 100]} />
              <YAxis type="category" dataKey="name" stroke="#9ca3af" tick={{ fontSize: 11 }} width={90} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8 }} />
              <Bar dataKey="score" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subjects table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 pb-3">
          <h3 className="font-semibold text-gray-900">Subject Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left p-4">Subject</th>
                <th className="text-left p-4">Score</th>
                <th className="text-left p-4">Attendance</th>
                <th className="text-left p-4">Assignments</th>
                <th className="text-left p-4">Participation</th>
                <th className="text-left p-4">Behavior</th>
              </tr>
            </thead>
            <tbody>
              {student.subjects.map(sb => (
                <tr key={sb.name} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{sb.name}</td>
                  <td className="p-4"><Cell value={sb.score} /></td>
                  <td className="p-4"><Cell value={sb.attendance} suffix="%" /></td>
                  <td className="p-4"><Cell value={sb.assignments} /></td>
                  <td className="p-4"><Cell value={sb.participation} max={10} /></td>
                  <td className="p-4"><Cell value={sb.behavior} max={10} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prediction details + recommendations */}
      {livePrediction && (
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
              <Brain size={18} className="text-blue-600" /> ML Factor Analysis
            </h3>
            <p className="text-xs text-gray-400 mb-4">How each weighted factor contributes to the final score</p>
            <div className="space-y-3">
              {[
                { label: 'Attendance Impact', value: livePrediction.factors.attendanceImpact, max: 25, color: '#06b6d4' },
                { label: 'Assignments Impact', value: livePrediction.factors.assignmentImpact, max: 30, color: '#8b5cf6' },
                { label: 'Participation Impact', value: livePrediction.factors.participationImpact, max: 20, color: '#22c55e' },
                { label: 'Behavior Impact', value: livePrediction.factors.behaviorImpact, max: 25, color: '#f59e0b' },
              ].map(f => (
                <div key={f.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-gray-600">{f.label}</span>
                    <span className="font-semibold text-gray-900">{f.value} / {f.max}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(f.value / f.max) * 100}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: f.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {livePrediction.weakAreas.length > 0 && (
              <div className="mt-5 pt-5 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-900 flex items-center gap-2 mb-2">
                  <AlertTriangle size={14} className="text-amber-500" /> Weak Areas
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {livePrediction.weakAreas.map((w, i) => <Chip key={i} color="amber">{w}</Chip>)}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
              <Lightbulb size={18} className="text-amber-500" /> AI Recommendations
            </h3>
            <p className="text-xs text-gray-400 mb-4">Personalized intervention suggestions</p>
            <div className="space-y-2.5">
              {livePrediction.recommendations.map((rec, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100"
                >
                  <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-700">{rec}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Prediction history */}
      {history.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity size={18} className="text-blue-600" /> Prediction History
          </h3>
          <div className="space-y-2">
            {history.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Brain size={14} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Predicted score: {p.predictedScore}</p>
                    <p className="text-[11px] text-gray-400">{new Date(p.generatedAt).toLocaleString()} • {p.confidence}% confidence</p>
                  </div>
                </div>
                <RiskBadge level={p.riskLevel} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BigStat({ label, value, color }: { label: string; value: string | number; color: 'blue' | 'cyan' | 'green' | 'amber' }) {
  const styles = {
    blue: 'bg-blue-50 border-blue-200',
    cyan: 'bg-cyan-50 border-cyan-200',
    green: 'bg-green-50 border-green-200',
    amber: 'bg-amber-50 border-amber-200',
  }[color];
  return (
    <div className={`${styles} border rounded-xl p-4`}>
      <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">{label}</p>
      <p className="text-2xl font-bold mt-1 text-gray-900">{value}</p>
    </div>
  );
}

function Cell({ value, max = 100, suffix = '' }: { value: number; max?: number; suffix?: string }) {
  const pct = (value / max) * 100;
  const color = pct >= 75 ? 'bg-green-500' : pct >= 50 ? 'bg-amber-400' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-medium tabular-nums w-12 text-right text-gray-700">{value}{suffix}</span>
    </div>
  );
}
