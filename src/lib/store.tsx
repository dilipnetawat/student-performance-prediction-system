import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User, Student, Prediction, Notification, Role } from './types';
import { buildSeedStudents, buildSeedNotifications } from './seedData';
import { runPrediction } from './mlEngine';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const KEY = 'tracked_state_v1';

interface State {
  user: User | null;
  students: Student[];
  predictions: Prediction[];
  notifications: Notification[];
  theme: 'dark' | 'light';
}

interface Ctx extends State {
  login: (email: string, password: string) => { ok: boolean; error?: string };
  signup: (name: string, email: string, password: string, role: Role) => { ok: boolean; error?: string };
  googleSignup: (name: string, email: string, token: string) => void;
  logout: () => void;
  addStudent: (s: Omit<Student, 'id' | 'avatar' | 'enrolledDate' | 'overallAttendance' | 'overallGPA' | 'riskLevel'>) => void;
  updateStudent: (id: string, patch: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  predict: (studentId: string) => Prediction;
  predictAll: () => Prediction[];
  markRead: (id: string) => void;
  markAllRead: () => void;
  deleteNotification: (id: string) => void;
  toggleTheme: () => void;
}

const StoreCtx = createContext<Ctx | null>(null);

function loadInitial(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const students = buildSeedStudents();
  const notifications = buildSeedNotifications(students);
  return { user: null, students, predictions: [], notifications, theme: 'light' };
}

function avatarFor(name: string) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'>
      <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='#6366f1'/><stop offset='1' stop-color='#a855f7'/>
      </linearGradient></defs>
      <rect width='80' height='80' rx='40' fill='url(#g)'/>
      <text x='50%' y='52%' text-anchor='middle' dominant-baseline='middle' font-family='Inter, sans-serif' font-weight='700' font-size='30' fill='white'>${initials}</text>
    </svg>`
  )}`;
}

function recomputeStudent(s: Student): Student {
  const overallAttendance = Math.round(s.subjects.reduce((sum, x) => sum + x.attendance, 0) / s.subjects.length);
  const avgScore = s.subjects.reduce((sum, x) => sum + x.score, 0) / s.subjects.length;
  const overallGPA = Math.round((avgScore / 25) * 10) / 10;
  const riskLevel = avgScore < 50 ? 'high' : avgScore < 70 ? 'medium' : 'low';
  return { ...s, overallAttendance, overallGPA, riskLevel };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(loadInitial);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, [state.theme]);

  // Auth Observer
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch or create user in Firestore
        const userRef = doc(db, 'users', firebaseUser.uid);
        let userDoc;
        try {
          userDoc = await getDoc(userRef);
        } catch (err) {
          console.error("Firestore error:", err);
          return;
        }

        let userData: User;
        let isNewSession = false;

        if (!userDoc.exists()) {
          // Explicitly clear local caches as requested for a new user
          localStorage.clear();
          sessionStorage.clear();
          isNewSession = true;

          userData = {
             id: firebaseUser.uid,
             name: firebaseUser.displayName || 'New User',
             email: firebaseUser.email || '',
             role: 'teacher',
             avatar: firebaseUser.photoURL || avatarFor(firebaseUser.displayName || 'New User'),
             createdAt: new Date().toISOString(),
          };
          try {
            await setDoc(userRef, userData);
          } catch(e) { console.error(e) }
        } else {
          userData = userDoc.data() as User;
        }

        setState(s => {
          if (s.user?.id !== firebaseUser.uid || isNewSession) {
             // Reset everything for this new user to prevent leaking data
             localStorage.clear();
             return { user: userData, students: [], predictions: [], notifications: [], theme: s.theme };
          }
          return { ...s, user: userData };
        });
      } else {
        // Logged out
        localStorage.clear();
        sessionStorage.clear();
        setState({ user: null, students: [], predictions: [], notifications: [], theme: 'light' });
      }
    });

    return () => unsub();
  }, []);

  const value: Ctx = useMemo(() => ({
    ...state,
    login: (email, password) => {
      if (!email || !password) return { ok: false, error: 'Email and password required' };
      const name = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      const user: User = {
        id: 'u_' + Math.random().toString(36).slice(2, 10),
        name: name || 'Demo User',
        email,
        role: 'teacher',
        avatar: avatarFor(name || 'Demo User'),
        createdAt: new Date().toISOString(),
      };
      setState(s => ({ ...s, user }));
      return { ok: true };
    },
    signup: (name, email, password, role) => {
      if (!name || !email || !password) return { ok: false, error: 'All fields required' };
      const user: User = {
        id: 'u_' + Math.random().toString(36).slice(2, 10),
        name, email, role,
        avatar: avatarFor(name),
        createdAt: new Date().toISOString(),
      };
      setState(s => ({ ...s, user }));
      return { ok: true };
    },
    googleSignup: (name, email, _token) => {
      // Stub, logic handled in auth observer now
    },
    logout: () => {
      signOut(auth).catch(console.error);
      setState(s => ({ ...s, user: null }));
    },
    addStudent: (data) => setState(s => {
      const id = 'std_' + Math.random().toString(36).slice(2, 8);
      const base: Student = {
        ...data,
        id,
        avatar: avatarFor(data.name),
        enrolledDate: new Date().toISOString(),
        overallAttendance: 0, overallGPA: 0, riskLevel: 'low',
      };
      return { ...s, students: [recomputeStudent(base), ...s.students] };
    }),
    updateStudent: (id, patch) => setState(s => ({
      ...s,
      students: s.students.map(st => st.id === id ? recomputeStudent({ ...st, ...patch }) : st),
    })),
    deleteStudent: (id) => setState(s => ({
      ...s,
      students: s.students.filter(st => st.id !== id),
      predictions: s.predictions.filter(p => p.studentId !== id),
    })),
    predict: (studentId) => {
      const student = state.students.find(s => s.id === studentId);
      if (!student) throw new Error('Student not found');
      const p = runPrediction(student);
      setState(s => ({ ...s, predictions: [p, ...s.predictions] }));
      return p;
    },
    predictAll: () => {
      const preds = state.students.map(s => runPrediction(s));
      setState(s => ({ ...s, predictions: [...preds, ...s.predictions] }));
      return preds;
    },
    markRead: (id) => setState(s => ({
      ...s,
      notifications: s.notifications.map(n => n.id === id ? { ...n, isRead: true } : n),
    })),
    markAllRead: () => setState(s => ({
      ...s,
      notifications: s.notifications.map(n => ({ ...n, isRead: true })),
    })),
    deleteNotification: (id) => setState(s => ({
      ...s,
      notifications: s.notifications.filter(n => n.id !== id),
    })),
    toggleTheme: () => setState(s => ({ ...s, theme: s.theme === 'dark' ? 'light' : 'dark' })),
  }), [state]);

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error('useStore must be inside StoreProvider');
  return c;
}
