import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, BarChart3, Brain, Bell, Sparkles, GraduationCap, Shield, Zap, TrendingUp, Users, Activity, Star,
} from 'lucide-react';
import { Hero3D } from '../components/Hero3D';
import { Button } from '../components/ui/Button';

const FEATURES = [
  { icon: BarChart3, title: 'Real-Time Analytics', desc: 'Beautiful dashboards reveal class-wide trends in seconds.' },
  { icon: Brain, title: 'ML Predictions', desc: 'A weighted scoring engine forecasts each student\'s trajectory.' },
  { icon: Bell, title: 'Early Warnings', desc: 'Get notified the moment a student slips into the at-risk zone.' },
  { icon: Sparkles, title: 'Smart Insights', desc: 'AI-powered recommendations tailored for every weak area.' },
  { icon: Shield, title: 'Role-Based Access', desc: 'Granular permissions for admins, teachers, and students.' },
  { icon: Zap, title: 'Lightning Fast', desc: 'Run predictions across your whole roster in milliseconds.' },
];

const STATS = [
  { value: '10k+', label: 'Students Tracked' },
  { value: '94%', label: 'Prediction Accuracy' },
  { value: '500+', label: 'Schools' },
  { value: '24/7', label: 'Live Monitoring' },
];

export function Landing() {
  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
      {/* Nav */}
      <nav className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
              <GraduationCap size={20} className="text-white" />
            </div>
            <p className="font-semibold text-lg text-gray-900">TrackEd</p>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
            <a href="#features" className="hover:text-gray-900 transition">Features</a>
            <a href="#how" className="hover:text-gray-900 transition">How it Works</a>
            <a href="#feedback" className="hover:text-gray-900 transition">Feedback</a>
            <a href="#stats" className="hover:text-gray-900 transition">Stats</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" icon={<ArrowRight size={14} />}>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-6 pt-16 lg:pt-24 pb-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-medium text-blue-600 mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              AI-powered student success platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl lg:text-6xl font-bold leading-tight tracking-tight"
            >
              Track Performance.<br />
              <span className="text-blue-600">Predict Success.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg text-gray-500 max-w-xl leading-relaxed"
            >
              The intelligent dashboard for teachers and administrators. Spot at-risk students early, generate ML-powered predictions, and act on personalized recommendations — all in one workspace.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link to="/signup">
                <Button size="lg" icon={<ArrowRight size={18} />}>Start Free Trial</Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="secondary">View Live Demo</Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-10 flex items-center gap-4 text-xs text-gray-400"
            >
              <div className="flex -space-x-2">
                {['#3b82f6', '#10b981', '#f59e0b', '#ef4444'].map((c) => (
                  <div key={c} className="w-7 h-7 rounded-full border-2 border-white" style={{ background: c }} />
                ))}
              </div>
              <p>Trusted by 500+ schools worldwide</p>
            </motion.div>
          </div>

          <div className="relative">
            <Hero3D />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-12 border-y border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-4xl lg:text-5xl font-bold text-blue-600">{s.value}</p>
              <p className="text-xs uppercase tracking-wider text-gray-400 mt-2">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-3xl lg:text-4xl font-bold">
              Everything you need to <span className="text-blue-600">stay ahead</span>
            </h2>
            <p className="mt-4 text-gray-500">
              From granular analytics to predictive alerts, TrackEd gives educators superpowers.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:-translate-y-1 transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                  <f.icon size={22} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">Workflow</p>
            <h2 className="text-3xl lg:text-4xl font-bold">
              Three steps to <span className="text-blue-600">smarter teaching</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: 'Add Students', desc: 'Import your roster or add students manually with subjects and metrics.' },
              { icon: Activity, title: 'Track Metrics', desc: 'Monitor attendance, assignments, participation, and behavior in real time.' },
              { icon: TrendingUp, title: 'Predict & Act', desc: 'Run ML predictions, view recommendations, and intervene proactively.' },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="relative inline-flex">
                  <div className="w-20 h-20 rounded-xl bg-white border border-gray-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <step.icon size={28} className="text-blue-600" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 max-w-xs mx-auto">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback / Testimonials */}
      <section id="feedback" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">Feedback</p>
            <h2 className="text-3xl lg:text-4xl font-bold">
              What educators are <span className="text-blue-600">saying</span>
            </h2>
            <p className="mt-4 text-gray-500">
              Hear from teachers and administrators who use TrackEd every day.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Dr. Priya Sharma',
                role: 'Principal, Delhi Public School',
                text: 'TrackEd has completely changed how we handle student interventions. We can now predict which students need help 3 weeks before exams — that\'s a game changer.',
                rating: 5,
              },
              {
                name: 'Rahul Mehta',
                role: 'Math Teacher, Gwalior',
                text: 'The recommendations are surprisingly accurate. I used to manually track 120 students — now TrackEd gives me a clear priority list every Monday morning.',
                rating: 5,
              },
              {
                name: 'Sneha Patel',
                role: 'Academic Coordinator',
                text: 'Our dropout rate dropped by 30% in just one semester. The early warning system catches problems that we would have missed until it was too late.',
                rating: 5,
              },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                    {t.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-blue-600 rounded-2xl p-10 lg:p-14 text-center text-white"
          >
            <h2 className="text-2xl lg:text-4xl font-bold">
              Ready to transform your classroom?
            </h2>
            <p className="mt-4 text-blue-100 max-w-xl mx-auto">
              Join thousands of educators using TrackEd to give every student the support they need to succeed.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/signup"><Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50" icon={<ArrowRight size={18} />}>Create Free Account</Button></Link>
              <Link to="/login"><Button size="lg" className="bg-blue-500 text-white hover:bg-blue-400 border-none">Sign In</Button></Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <GraduationCap size={14} className="text-white" />
            </div>
            <span>© 2026 TrackEd. Empowering educators with intelligence.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-gray-900 transition">Privacy</a>
            <a href="#" className="hover:text-gray-900 transition">Terms</a>
            <a href="#" className="hover:text-gray-900 transition">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
