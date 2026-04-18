import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, AlertTriangle, AlertCircle, Info, CheckCircle2, Trash2, Check, CheckCheck } from 'lucide-react';
import { useStore } from '../lib/store';
import { Button } from '../components/ui/Button';
import type { NotifType } from '../lib/types';

const typeMeta: Record<NotifType, { icon: any; color: string; bg: string; border: string }> = {
  alert: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
  warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
  success: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200' },
};

export function NotificationsPage() {
  const { notifications, markRead, markAllRead, deleteNotification, students } = useStore();
  const [filter, setFilter] = useState<'all' | NotifType | 'unread'>('all');

  const filtered = notifications.filter(n =>
    filter === 'all' ? true : filter === 'unread' ? !n.isRead : n.type === filter
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-400 mt-1">{notifications.length} total • {unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="secondary" icon={<CheckCheck size={16} />} onClick={markAllRead}>Mark all read</Button>
        )}
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {([
          { v: 'all', label: 'All', count: notifications.length },
          { v: 'unread', label: 'Unread', count: unreadCount },
          { v: 'alert', label: 'Alerts', count: notifications.filter(n => n.type === 'alert').length },
          { v: 'warning', label: 'Warnings', count: notifications.filter(n => n.type === 'warning').length },
          { v: 'success', label: 'Success', count: notifications.filter(n => n.type === 'success').length },
          { v: 'info', label: 'Info', count: notifications.filter(n => n.type === 'info').length },
        ] as const).map(opt => (
          <button
            key={opt.v}
            onClick={() => setFilter(opt.v as any)}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition flex items-center gap-2 ${
              filter === opt.v
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {opt.label}
            <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${filter === opt.v ? 'bg-blue-500' : 'bg-gray-100'}`}>{opt.count}</span>
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((n, i) => {
            const meta = typeMeta[n.type];
            const Icon = meta.icon;
            const student = students.find(s => s.id === n.studentId);
            return (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                transition={{ delay: Math.min(i * 0.03, 0.2) }}
                className={`bg-white rounded-xl border p-4 flex gap-4 items-start group transition-all hover:shadow-sm ${
                  !n.isRead ? `${meta.border} border-l-4` : 'border-gray-200 opacity-75'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg ${meta.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={18} className={meta.color} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-medium text-gray-900">{n.title}</p>
                    {!n.isRead && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{n.message}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400">
                    <span>{new Date(n.createdAt).toLocaleString()}</span>
                    {student && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                          <img src={student.avatar} className="w-4 h-4 rounded-full" alt="" />
                          {student.name}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                  {!n.isRead && (
                    <button
                      onClick={() => markRead(n.id)}
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-green-500 transition"
                      title="Mark as read"
                    >
                      <Check size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(n.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <Bell size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="font-medium text-gray-900">You're all caught up!</p>
          <p className="text-sm text-gray-400 mt-1">No notifications match this filter.</p>
        </div>
      )}
    </div>
  );
}
