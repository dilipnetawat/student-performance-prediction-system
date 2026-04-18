import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  Line, CartesianGrid, AreaChart, Area,
} from 'recharts';
import {
  Users, AlertTriangle, TrendingUp, Brain, ArrowRight, Sparkles,
} from 'lucide-react';
import { useStore } from '../lib/store';
import { Button } from '../components/ui/Button';
import { RiskBadge } from '../components/ui/Badge';

const COLORS = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444' };

export function Dashboard() {
  const { user, students, predictions, notifications, predictAll } = useStore();

  const stats = useMemo(() => {
    const total = students.length;
    const atRisk = students.filter(s => s.riskLevel === 'high').length;
    const avgScore = total ? Math.round(
      students.reduce((sum, s) =>
        sum + s.subjects.reduce((a, x) => a + x.score, 0) / s.subjects.length, 0) / total * 10) / 10
      : 0;
    return { total, atRisk, avgScore, predCount: predictions.length };
  }, [students, predictions]);

  const barData = useMemo(() =>
    students.slice(0, 8).map(s => ({
      name: s.name.split(' ')[0],
      score: Math.round(s.subjects.reduce((a, x) => a + x.score, 0) / s.subjects.length),
    })), [students]);

  const pieData = useMemo(() => {
    const buckets = { low: 0, medium: 0, high: 0 };
    students.forEach(s => buckets[s.riskLevel]++);
    return [
      { name: 'Low Risk', value: buckets.low, color: COLORS.low },
      { name: 'Medium Risk', value: buckets.medium, color: COLORS.medium },
      { name: 'High Risk', value: buckets.high, color: COLORS.high },
    ];
  }, [students]);

  const trendData = useMemo(() => {
    const base = stats.avgScore || 70;
    return Array.from({ length: 12 }).map((_, i) => ({
      week: `W${i + 1}`,
      avg: Math.max(40, Math.min(98, Math.round(base + Math.sin(i * 0.6) * 6 + (i - 6) * 0.5))),
      target: 85,
    }));
  }, [stats.avgScore]);

  const subjectAvg = useMemo(() => {
    if (!students.length) return [];
    const map = new Map<string, { sum: number; n: number }>();
    students.forEach(s => s.subjects.forEach(sb => {
      const cur = map.get(sb.name) || { sum: 0, n: 0 };
      cur.sum += sb.score; cur.n++;
      map.set(sb.name, cur);
    }));
    return Array.from(map.entries()).map(([name, v]) => ({ name, value: Math.round(v.sum / v.n) }));
  }, [students]);

  const recentAlerts = notifications.slice(0, 4);

  const STAT_CARDS = [
    { label: 'Total Students', value: stats.total, icon: Users, color: 'bg-blue-500', bgLight: 'bg-blue-50', sub: 'Active in platform' },
    { label: 'At-Risk', value: stats.atRisk, icon: AlertTriangle, color: 'bg-red-500', bgLight: 'bg-red-50', sub: 'Need intervention' },
    { label: 'Avg. Score', value: stats.avgScore, icon: TrendingUp, color: 'bg-green-500', bgLight: 'bg-green-50', sub: 'Across all subjects' },
    { label: 'Predictions', value: stats.predCount, icon: Brain, color: 'bg-amber-500', bgLight: 'bg-amber-50', sub: 'Generated total' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-gray-400">Welcome back, {user?.name?.split(' ')[0]} 👋</p>
          <h1 className="text-2xl lg:text-3xl font-bold mt-1">
            Your <span className="text-blue-600">command center</span>
          </h1>
        </div>
        {user?.role !== 'student' && (
          <Button onClick={predictAll} icon={<Sparkles size={16} />}>Run Predictions for All</Button>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl border border-gray-200 p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">{s.label}</p>
                <p className="text-3xl font-bold mt-2 text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center`}>
                <s.icon size={18} className="text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Bar chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900">Top Students by Average Score</h3>
            <p className="text-xs text-gray-400">Based on current subject performance</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 11 }} />
              <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8 }} />
              <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900">Risk Distribution</h3>
          <p className="text-xs text-gray-400 mb-2">Current student risk levels</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={4}>
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {pieData.map(p => (
              <div key={p.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                  <span className="text-gray-600">{p.name}</span>
                </div>
                <span className="font-semibold text-gray-900">{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Area chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900">Performance Trend</h3>
            <p className="text-xs text-gray-400">Class average over the last 12 weeks</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="week" stroke="#9ca3af" tick={{ fontSize: 11 }} />
              <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} domain={[40, 100]} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8 }} />
              <Area type="monotone" dataKey="avg" stroke="#3b82f6" strokeWidth={2} fill="url(#areaGrad)" />
              <Line type="monotone" dataKey="target" stroke="#22c55e" strokeWidth={2} strokeDasharray="6 4" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent alerts */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Recent Alerts</h3>
            <Link to="/app/notifications" className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3 flex-1 overflow-auto">
            {recentAlerts.length === 0 && <p className="text-sm text-gray-400">No alerts yet — all clear!</p>}
            {recentAlerts.map(a => {
              const dotColor = a.type === 'alert' ? 'bg-red-500' : a.type === 'warning' ? 'bg-amber-500' : a.type === 'success' ? 'bg-green-500' : 'bg-blue-500';
              return (
                <div key={a.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="flex items-start gap-2">
                    <span className={`mt-1.5 w-2 h-2 rounded-full ${dotColor}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{a.title}</p>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{a.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Subject averages + at-risk list */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Subject Averages</h3>
          <div className="space-y-3">
            {subjectAvg.map(sb => (
              <div key={sb.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600">{sb.name}</span>
                  <span className="font-semibold text-gray-900">{sb.value}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${sb.value}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{
                      background: sb.value >= 80 ? '#22c55e' : sb.value >= 60 ? '#f59e0b' : '#ef4444',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Students Requiring Attention</h3>
            <Link to="/app/students" className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium">
              All students <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2.5">
            {students.filter(s => s.riskLevel !== 'low').slice(0, 5).map(s => (
              <Link
                key={s.id}
                to={`/app/students/${s.id}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-100 transition group"
              >
                <img src={s.avatar} alt={s.name} className="w-9 h-9 rounded-lg" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{s.name}</p>
                  <p className="text-xs text-gray-400">Grade {s.grade} • Section {s.section} • GPA {s.overallGPA}</p>
                </div>
                <RiskBadge level={s.riskLevel} />
                <ArrowRight size={14} className="text-gray-300 group-hover:text-gray-500 transition" />
              </Link>
            ))}
            {students.filter(s => s.riskLevel !== 'low').length === 0 && (
              <p className="text-sm text-gray-400">🎉 All students are performing well!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
