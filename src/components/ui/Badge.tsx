import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import type { RiskLevel } from '../../lib/types';

export function RiskBadge({ level }: { level: RiskLevel }) {
  const cls = level === 'low' ? 'badge-low' : level === 'medium' ? 'badge-medium' : 'badge-high';
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize', cls)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', level === 'low' ? 'bg-green-500' : level === 'medium' ? 'bg-amber-500' : 'bg-red-500')} />
      {level} risk
    </span>
  );
}

export function Chip({ children, color = 'violet' }: { children: ReactNode; color?: 'violet' | 'emerald' | 'amber' | 'rose' | 'cyan' }) {
  const colors = {
    violet: 'bg-blue-50 text-blue-700 border-blue-200',
    emerald: 'bg-green-50 text-green-700 border-green-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    rose: 'bg-red-50 text-red-700 border-red-200',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  };
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border', colors[color])}>
      {children}
    </span>
  );
}
