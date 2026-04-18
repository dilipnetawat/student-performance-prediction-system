import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Search, Lightbulb, AlertTriangle, TrendingUp } from 'lucide-react';
import { useStore } from '../lib/store';
import { Button } from '../components/ui/Button';
import { RiskBadge, Chip } from '../components/ui/Badge';
import { runPrediction } from '../lib/mlEngine';
import { Link } from 'react-router-dom';

export function PredictionsPage() {
  const { user, students, predict, predictAll } = useStore();
  const [query, setQuery] = useState('');
  const [running, setRunning] = useState(false);

  const livePredictions = useMemo(
    () => students.map(s => ({ student: s, prediction: runPrediction(s) })),
    [students]
  );

  const filtered = livePredictions.filter(({ student }) =>
    !query || student.name.toLowerCase().includes(query.toLowerCase())
  );

  const summary = useMemo(() => {
    const total = livePredictions.length;
    const high = livePredictions.filter(p => p.prediction.riskLevel === 'high').length;
    const med = livePredictions.filter(p => p.prediction.riskLevel === 'medium').length;
    const low = livePredictions.filter(p => p.prediction.riskLevel === 'low').length;
    const avgConf = total ? Math.round(livePredictions.reduce((a, p) => a + p.prediction.confidence, 0) / total) : 0;
    return { total, high, med, low, avgConf };
  }, [livePredictions]);

  async function handleRunAll() {
    setRunning(true);
    await new Promise(r => setTimeout(r, 600));
    predictAll();
    setRunning(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">ML Predictions</h1>
          <p className="text-sm text-gray-400 mt-1">Weighted scoring engine • Real-time forecast for every student</p>
        </div>
        {user?.role !== 'student' && (
          <Button onClick={handleRunAll} disabled={running} icon={<Sparkles size={16} />}>
            {running ? 'Running...' : 'Run for All Students'}
          </Button>
        )}
      </div>

      {/* Summary */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Predictions', value: summary.total, color: 'bg-blue-500', icon: Brain },
          { label: 'High Risk', value: summary.high, color: 'bg-red-500', icon: AlertTriangle },
          { label: 'Medium Risk', value: summary.med, color: 'bg-amber-500', icon: TrendingUp },
          { label: 'Avg Confidence', value: `${summary.avgConf}%`, color: 'bg-green-500', icon: Sparkles },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">{s.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{s.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center`}>
                <s.icon size={18} className="text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ML model info card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-5 items-start">
          <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <Brain size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg">Weighted Scoring Engine</h3>
            <p className="text-sm text-gray-500 mt-1">Deterministic ML model that blends four signals into a single performance forecast.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
              <ModelChip label="Attendance" weight="25%" color="blue" />
              <ModelChip label="Assignments" weight="30%" color="purple" />
              <ModelChip label="Participation" weight="20%" color="green" />
              <ModelChip label="Behavior" weight="25%" color="amber" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search predictions..."
          className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition"
        />
      </div>

      {/* Prediction cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(({ student, prediction: p }, i) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.03, 0.3) }}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <Link to={`/app/students/${student.id}`}>
                <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-lg" />
              </Link>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 truncate">{student.name}</p>
                <p className="text-[11px] text-gray-400">Grade {student.grade} • {student.studentId}</p>
              </div>
              <RiskBadge level={p.riskLevel} />
            </div>

            {/* Score circle */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-16 h-16">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="32" cy="32" r="27" stroke="#f3f4f6" strokeWidth="5" fill="none" />
                  <motion.circle
                    cx="32" cy="32" r="27"
                    stroke={p.riskLevel === 'high' ? '#ef4444' : p.riskLevel === 'medium' ? '#f59e0b' : '#22c55e'}
                    strokeWidth="5"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: '0 170' }}
                    animate={{ strokeDasharray: `${(p.predictedScore / 100) * 170} 170` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-lg font-bold text-gray-900">{p.predictedScore}</p>
                  <p className="text-[8px] text-gray-400 uppercase">Score</p>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-medium">Confidence</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${p.confidence}%` }} transition={{ duration: 0.6 }}
                        className="h-full bg-blue-500 rounded-full" />
                    </div>
                    <span className="text-xs font-semibold text-gray-700">{p.confidence}%</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                  <div className="bg-gray-50 rounded-md px-2 py-1 border border-gray-100">
                    <span className="text-gray-400">Att</span> <span className="font-semibold text-gray-700 ml-1">{p.factors.attendanceImpact}</span>
                  </div>
                  <div className="bg-gray-50 rounded-md px-2 py-1 border border-gray-100">
                    <span className="text-gray-400">Asg</span> <span className="font-semibold text-gray-700 ml-1">{p.factors.assignmentImpact}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top recommendation */}
            {p.recommendations[0] && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3">
                <div className="flex items-start gap-2">
                  <Lightbulb size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-700 leading-relaxed">{p.recommendations[0]}</p>
                </div>
              </div>
            )}

            {p.weakAreas.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {p.weakAreas.slice(0, 2).map((w, i) => (
                  <Chip key={i} color={p.riskLevel === 'high' ? 'rose' : 'amber'}>{w}</Chip>
                ))}
                {p.weakAreas.length > 2 && <Chip color="violet">+{p.weakAreas.length - 2} more</Chip>}
              </div>
            )}

            <div className="flex gap-2">
              {user?.role !== 'student' && (
                <Button size="sm" variant="secondary" className="flex-1" onClick={() => predict(student.id)}>
                  Re-run
                </Button>
              )}
              <Link to={`/app/students/${student.id}`} className="flex-1">
                <Button size="sm" className="w-full">View Profile</Button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ModelChip({ label, weight, color }: { label: string; weight: string; color: 'blue' | 'purple' | 'green' | 'amber' }) {
  const styles = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
  }[color];
  return (
    <div className={`${styles} border rounded-lg p-3`}>
      <p className="text-[10px] uppercase tracking-wider opacity-70 font-medium">{label}</p>
      <p className="text-xl font-bold mt-1">{weight}</p>
    </div>
  );
}
