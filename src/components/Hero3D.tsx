import { motion } from 'framer-motion';
import { BarChart3, Brain, GraduationCap, TrendingUp } from 'lucide-react';

/**
 * Simple hero illustration showing a dashboard preview card.
 */
export function Hero3D() {
  return (
    <div className="relative w-full h-[480px] flex items-center justify-center">
      {/* Main dashboard preview card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-[400px] bg-white rounded-xl border border-gray-200 p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Live Dashboard</p>
            <h3 className="text-lg font-semibold text-gray-900">Class Performance</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
            <BarChart3 size={18} className="text-white" />
          </div>
        </div>

        {/* Mini bar chart */}
        <div className="flex items-end justify-between h-28 gap-2 mb-4">
          {[68, 84, 52, 91, 76, 88, 73, 95].map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: 0.3 + i * 0.07, duration: 0.5, ease: 'easeOut' }}
              className="flex-1 rounded-t-md"
              style={{
                background: i === 3 ? '#2563eb' : '#93c5fd',
              }}
            />
          ))}
        </div>

        {/* Stat row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <p className="text-[10px] text-gray-400">Students</p>
            <p className="text-lg font-semibold text-gray-900">248</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <p className="text-[10px] text-gray-400">At Risk</p>
            <p className="text-lg font-semibold text-red-500">12</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <p className="text-[10px] text-gray-400">Avg</p>
            <p className="text-lg font-semibold text-green-600">82.4</p>
          </div>
        </div>
      </motion.div>

      {/* Small prediction card */}
      <motion.div
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 100, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute bg-white rounded-lg border border-gray-200 p-4 w-52 -top-2 right-0 shadow-md"
      >
        <div className="flex items-center gap-2 mb-2">
          <Brain size={14} className="text-blue-600" />
          <p className="text-xs font-medium text-gray-500">ML Prediction</p>
        </div>
        <p className="text-2xl font-bold text-blue-600">94.7%</p>
        <p className="text-[10px] text-gray-400 mt-1">Confidence: high</p>
        <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '94%' }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="h-full bg-blue-500 rounded-full"
          />
        </div>
      </motion.div>

      {/* Small alert card */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: -100, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="absolute bg-white rounded-lg border border-gray-200 p-4 w-48 bottom-8 left-0 shadow-md"
      >
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
            <TrendingUp size={14} className="text-red-500" />
          </div>
          <p className="text-xs font-medium text-gray-500">Risk Alert</p>
        </div>
        <p className="text-sm font-semibold text-gray-900">Aarav Sharma</p>
        <p className="text-[10px] text-gray-400 mt-0.5">Attendance dropped 18%</p>
      </motion.div>
    </div>
  );
}
