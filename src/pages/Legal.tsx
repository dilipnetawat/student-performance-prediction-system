import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, ArrowLeft } from 'lucide-react';

interface Props {
  type: 'privacy' | 'terms';
}

export function LegalPage({ type }: Props) {
  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? 'Privacy Policy' : 'Terms of Service';
  const lastUpdated = 'April 18, 2026';

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 overflow-hidden">
      {/* Nav */}
      <nav className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
              <GraduationCap size={20} className="text-white" />
            </div>
            <p className="font-semibold text-lg text-gray-900">TrackEd</p>
          </Link>
          <Link to="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1.5 transition">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl border border-gray-200 p-10 shadow-sm"
        >
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{title}</h1>
            <p className="text-sm text-gray-400">Last Updated: {lastUpdated}</p>
          </div>

          <div className="prose prose-blue max-w-none text-gray-600 text-sm leading-relaxed space-y-6">
            {isPrivacy ? (
              <>
                <p>
                  At TrackEd, we take your privacy and the privacy of your students incredibly seriously. This Privacy Policy outlines how we collect, use, and protect your data.
                </p>
                <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-2">1. Data Collection</h3>
                <p>
                  We only collect data that is strictly necessary for our platform to function. This includes account creation strings (names, emails) and student performance metrics uploaded by authenticated educators. We never scrape or obtain student data without explicit authorization.
                </p>
                <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-2">2. Data Usage & AI Predictions</h3>
                <p>
                  The machine learning algorithms predicting student risks run anonymously. Identifying student information is strictly obfuscated from prediction training data. We do not sell your data, student metrics, or usage analytics to any third parties.
                </p>
                <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-2">3. Security</h3>
                <p>
                  All data is encrypted in transit and at rest using industry-standard protocols. Our database infrastructure is powered by Google Firebase, ensuring enterprise-grade compliance and protection standards.
                </p>
              </>
            ) : (
              <>
                <p>
                  Welcome to TrackEd. By using our platform, you agree to these Terms of Service. Please read them carefully to understand your rights and responsibilities.
                </p>
                <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-2">1. Account Responsibility</h3>
                <p>
                  You are responsible for maintaining the confidentiality of your account credentials. Educational institutions must ensure that the uploading of student academic data complies with FERPA, GDPR, and other applicable local regulations regarding student privacy.
                </p>
                <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-2">2. Acceptable Use</h3>
                <p>
                  You may only use TrackEd for legitimate educational tracking and intervention. You may not attempt to reverse-engineer the machine learning models, overload our servers, or use the service to disseminate malicious content.
                </p>
                <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-2">3. Service Modifications</h3>
                <p>
                  We are constantly refining our prediction engines. We reserve the right to modify, suspend, or discontinue our predictive endpoints or services at any time, though we will provide ample notice to administrators heavily relying on our architecture.
                </p>
              </>
            )}

            <div className="pt-10 mt-10 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
              <p>TrackEd — Educational Intelligence Platform</p>
              <Link to={isPrivacy ? '/terms' : '/privacy'} className="text-blue-600 hover:underline">
                View {isPrivacy ? 'Terms of Service' : 'Privacy Policy'} &rarr;
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
