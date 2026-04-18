import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Filter, Trash2, Edit3, Mail, MoreVertical, GraduationCap } from 'lucide-react';
import { useStore } from '../lib/store';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { RiskBadge, Chip } from '../components/ui/Badge';
import type { RiskLevel, Student } from '../lib/types';

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'];

export function StudentsPage() {
  const { user, students, addStudent, deleteStudent, updateStudent } = useStore();
  const isReadOnly = user?.role === 'student';
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | RiskLevel>('all');
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);

  const filtered = useMemo(() => {
    return students.filter(s => {
      const m = !query ||
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.studentId.toLowerCase().includes(query.toLowerCase()) ||
        s.email.toLowerCase().includes(query.toLowerCase());
      const r = filter === 'all' || s.riskLevel === filter;
      return m && r;
    });
  }, [students, query, filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-sm text-gray-400 mt-1">{students.length} total • {filtered.length} shown</p>
        </div>
        {!isReadOnly && (
          <Button icon={<Plus size={16} />} onClick={() => { setEditing(null); setOpen(true); }}>
            Add Student
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, ID, or email..."
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition"
          />
        </div>
        <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-1">
          {(['all', 'low', 'medium', 'high'] as const).map(opt => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition ${
                filter === opt ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {opt === 'all' ? <span className="flex items-center gap-1"><Filter size={12} /> All</span> : opt}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-1">
          {(['grid', 'table'] as const).map(opt => (
            <button
              key={opt}
              onClick={() => setView(opt)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition ${
                view === opt ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {view === 'grid' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filtered.map((s, i) => {
              const avgScore = Math.round(s.subjects.reduce((a, x) => a + x.score, 0) / s.subjects.length);
              return (
                <motion.div
                  key={s.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.02 }}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <Link to={`/app/students/${s.id}`} className="flex items-center gap-3 min-w-0 flex-1">
                      <img src={s.avatar} alt={s.name} className="w-10 h-10 rounded-lg" />
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{s.name}</p>
                        <p className="text-[11px] text-gray-400 truncate">{s.studentId}</p>
                      </div>
                    </Link>
                    {!isReadOnly && (
                      <Menu
                        onEdit={() => { setEditing(s); setOpen(true); }}
                        onDelete={() => deleteStudent(s.id)}
                      />
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 mb-4">
                    <Chip color="violet">Grade {s.grade}</Chip>
                    <Chip color="cyan">Sec {s.section}</Chip>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <Stat label="Score" value={avgScore} />
                    <Stat label="Att" value={`${s.overallAttendance}%`} />
                    <Stat label="GPA" value={s.overallGPA} />
                  </div>

                  <div className="flex items-center justify-between">
                    <RiskBadge level={s.riskLevel} />
                    <Link to={`/app/students/${s.id}`} className="text-xs font-medium text-blue-600 hover:text-blue-700">View →</Link>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="text-left p-4">Student</th>
                  <th className="text-left p-4">ID</th>
                  <th className="text-left p-4">Grade</th>
                  <th className="text-left p-4">Score</th>
                  <th className="text-left p-4">Attendance</th>
                  <th className="text-left p-4">GPA</th>
                  <th className="text-left p-4">Risk</th>
                  {!isReadOnly && <th className="text-right p-4">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => {
                  const avgScore = Math.round(s.subjects.reduce((a, x) => a + x.score, 0) / s.subjects.length);
                  return (
                    <tr key={s.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                      <td className="p-4">
                        <Link to={`/app/students/${s.id}`} className="flex items-center gap-3">
                          <img src={s.avatar} className="w-8 h-8 rounded-lg" alt={s.name} />
                          <div>
                            <p className="font-medium text-gray-900">{s.name}</p>
                            <p className="text-[11px] text-gray-400">{s.email}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="p-4 text-gray-500 font-mono text-xs">{s.studentId}</td>
                      <td className="p-4 text-gray-700">{s.grade}-{s.section}</td>
                      <td className="p-4 font-semibold text-gray-900">{avgScore}</td>
                      <td className="p-4 text-gray-700">{s.overallAttendance}%</td>
                      <td className="p-4 text-gray-700">{s.overallGPA}</td>
                      <td className="p-4"><RiskBadge level={s.riskLevel} /></td>
                      {!isReadOnly && (
                        <td className="p-4 text-right">
                          <div className="inline-flex gap-1">
                            <button onClick={() => { setEditing(s); setOpen(true); }} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"><Edit3 size={14} /></button>
                            <button onClick={() => deleteStudent(s.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-400"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <GraduationCap size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="font-medium text-gray-900">No students match your filters</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search or risk filter.</p>
        </div>
      )}

      <StudentModal
        open={open}
        onClose={() => setOpen(false)}
        student={editing}
        onSave={(data) => {
          if (editing) updateStudent(editing.id, data);
          else addStudent(data as any);
          setOpen(false);
        }}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-gray-50 rounded-lg p-2 text-center border border-gray-100">
      <p className="text-[10px] uppercase text-gray-400 font-medium">{label}</p>
      <p className="text-sm font-semibold text-gray-900 mt-0.5">{value}</p>
    </div>
  );
}

function Menu({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
        <MoreVertical size={16} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-lg border border-gray-200 py-1 min-w-[140px] shadow-lg">
            <button onClick={() => { setOpen(false); onEdit(); }} className="w-full px-3 py-2 text-sm text-left flex items-center gap-2 hover:bg-gray-50 text-gray-700">
              <Edit3 size={14} /> Edit
            </button>
            <button onClick={() => { setOpen(false); onDelete(); }} className="w-full px-3 py-2 text-sm text-left flex items-center gap-2 hover:bg-red-50 text-red-500">
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  student: Student | null;
  onSave: (data: Partial<Student>) => void;
}

function StudentModal({ open, onClose, student, onSave }: ModalProps) {
  const [name, setName] = useState(student?.name || '');
  const [email, setEmail] = useState(student?.email || '');
  const [studentId, setStudentId] = useState(student?.studentId || '');
  const [grade, setGrade] = useState(student?.grade || '10');
  const [section, setSection] = useState(student?.section || 'A');
  const [subjects, setSubjects] = useState(
    student?.subjects || SUBJECTS.map(name => ({ name, score: 75, attendance: 85, assignments: 75, participation: 7, behavior: 7 }))
  );

  // Reset when modal opens with different student
  useState(() => {
    setName(student?.name || '');
    setEmail(student?.email || '');
    setStudentId(student?.studentId || '');
    setGrade(student?.grade || '10');
    setSection(student?.section || 'A');
    setSubjects(student?.subjects || SUBJECTS.map(name => ({ name, score: 75, attendance: 85, assignments: 75, participation: 7, behavior: 7 })));
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      name, email,
      studentId: studentId || `TRK-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
      grade, section, subjects,
    });
  }

  return (
    <Modal open={open} onClose={onClose} title={student ? 'Edit Student' : 'Add New Student'} width="max-w-2xl">
      <form onSubmit={submit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        <div className="grid sm:grid-cols-2 gap-3">
          <Input label="Full name" value={name} onChange={e => setName(e.target.value)} required />
          <Input label="Email" type="email" icon={<Mail size={14} />} value={email} onChange={e => setEmail(e.target.value)} required />
          <Input label="Student ID" value={studentId} onChange={e => setStudentId(e.target.value)} placeholder="Auto-generated" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Grade" value={grade} onChange={e => setGrade(e.target.value)} />
            <Input label="Section" value={section} onChange={e => setSection(e.target.value)} />
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Subject Metrics</p>
          <div className="space-y-2">
            {subjects.map((sb, idx) => (
              <div key={sb.name} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <p className="font-medium text-sm text-gray-900 mb-2">{sb.name}</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(['score', 'attendance', 'assignments', 'participation', 'behavior'] as const).map(k => (
                    <label key={k} className="block">
                      <span className="text-[10px] uppercase text-gray-400 font-medium">{k}</span>
                      <input
                        type="number"
                        value={sb[k]}
                        min={0}
                        max={k === 'participation' || k === 'behavior' ? 10 : 100}
                        onChange={e => {
                          const next = [...subjects];
                          (next[idx] as any)[k] = Math.max(0, Math.min(k === 'participation' || k === 'behavior' ? 10 : 100, Number(e.target.value) || 0));
                          setSubjects(next);
                        }}
                        className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 text-gray-900 mt-1"
                      />
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 sticky bottom-0">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit">{student ? 'Save changes' : 'Create student'}</Button>
        </div>
      </form>
    </Modal>
  );
}
