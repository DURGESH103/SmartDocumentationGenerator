import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, Zap, Shield, Code, Github, Upload, CheckCircle, ArrowRight, Sparkles, Check } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      <nav className="sticky top-0 z-50 bg-white/60 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600" />
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SmartDoc</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium">
                Login
              </motion.button>
            </Link>
            <Link to="/register">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg">
                Sign Up
              </motion.button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center pt-20 pb-16">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-xl rounded-full shadow-lg border border-gray-200/50 mb-8">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">AI-Powered Documentation</span>
          </motion.div>
          
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6 leading-tight">
            Documentation<br />Made Simple
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Transform your codebase into comprehensive documentation instantly with AI. Save hours of manual work.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/register">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg text-lg font-medium flex items-center gap-2">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 bg-white/80 backdrop-blur-xl text-gray-700 rounded-xl shadow-lg text-lg font-medium border border-gray-200/50">
              View Demo
            </motion.button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-20">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-4 overflow-hidden">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="space-y-3 font-mono text-sm">
                <div className="text-green-400">$ smartdoc analyze project.zip</div>
                <div className="text-gray-400">📦 Analyzing project structure...</div>
                <div className="text-gray-400">🔍 Detecting languages: Python, JavaScript</div>
                <div className="text-gray-400">🤖 Generating documentation with AI...</div>
                <div className="text-green-400">✓ Documentation generated successfully!</div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            { icon: Zap, title: 'Lightning Fast', desc: 'Generate comprehensive docs in seconds, not hours' },
            { icon: Shield, title: 'Secure & Private', desc: 'Your code stays safe with enterprise-grade security' },
            { icon: Code, title: 'Multi-Language', desc: 'Supports Python, JavaScript, Java, and 20+ languages' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-gray-200/50 text-center group"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="bg-white/80 backdrop-blur-xl rounded-3xl p-16 shadow-lg border border-gray-200/50 mb-20">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Upload, num: '1', title: 'Upload', desc: 'Upload your project ZIP or paste GitHub URL' },
              { icon: Sparkles, num: '2', title: 'AI Analyzes', desc: 'Our AI analyzes your code structure and patterns' },
              { icon: CheckCircle, num: '3', title: 'Export Docs', desc: 'Download professional README and documentation' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="text-center relative"
              >
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-purple-600">
                    <span className="text-sm font-bold text-purple-600">{step.num}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="pb-20">
          <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Simple Pricing</h2>
          <p className="text-center text-gray-600 mb-12">Choose the plan that fits your needs</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { name: 'Free', price: '$0', features: ['5 projects/month', 'Basic AI analysis', 'README export', 'Community support'] },
              { name: 'Pro', price: '$19', features: ['Unlimited projects', 'Advanced AI analysis', 'All export formats', 'Priority support', 'GitHub integration'], highlight: true },
              { name: 'Team', price: '$49', features: ['Everything in Pro', 'Team collaboration', 'Custom templates', 'API access', 'Dedicated support'] },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.1 }}
                className={`bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border-2 ${plan.highlight ? 'border-purple-600 scale-105' : 'border-gray-200/50'}`}
              >
                {plan.highlight && <div className="text-center mb-4"><span className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">POPULAR</span></div>}
                <h3 className="text-2xl font-bold text-center mb-2">{plan.name}</h3>
                <div className="text-center mb-6"><span className="text-4xl font-bold">{plan.price}</span><span className="text-gray-600">/month</span></div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => <li key={j} className="flex items-center gap-2 text-sm"><Check className="w-5 h-5 text-green-600" /><span>{f}</span></li>)}
                </ul>
                <Link to="/register">
                  <button className={`w-full py-3 rounded-xl font-medium ${plan.highlight ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    Get Started
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }} className="text-center pb-20">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-16 shadow-2xl">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to get started?</h2>
            <p className="text-xl text-white/90 mb-8">Join thousands of developers using SmartDoc</p>
            <Link to="/register">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-10 py-4 bg-white text-purple-600 rounded-xl shadow-lg text-lg font-bold">
                Start Free Trial
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
