import React from 'react';
import { Link } from 'react-router-dom';
import { HeroGeometric } from '@/components/ui/shape-landing-hero';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, PiggyBank, Lightbulb, Shield, Zap, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    title: 'Smart Analytics',
    description: 'Visualize your spending patterns with interactive charts and gain deep insights into where your money goes.',
  },
  {
    icon: PiggyBank,
    title: 'Savings Goals',
    description: 'Set monthly savings targets and track your progress with real-time updates and motivational milestones.',
  },
  {
    icon: Lightbulb,
    title: 'AI-Powered Tips',
    description: 'Get personalized recommendations to optimize your spending and maximize your savings potential.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your financial data is encrypted and protected. We never share your information with third parties.',
  },
  {
    icon: Zap,
    title: 'Instant Tracking',
    description: 'Log expenses in seconds with smart categorization. No more manual spreadsheets or lost receipts.',
  },
  {
    icon: TrendingUp,
    title: 'Income Management',
    description: 'Track multiple income streams, monitor growth trends, and understand your complete financial picture.',
  },
];

const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: i * 0.1,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }),
};

const LandingPage: React.FC = () => {
  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      {/* Floating Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl px-6 py-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gray-800 border border-primary-600/30 rounded-xl flex items-center justify-center text-primary-500 font-bold text-lg shadow-lg shadow-primary-900/20">
                S
              </div>
              <span className="text-lg font-bold text-white tracking-tight">SpendWise</span>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="px-5 py-2 text-sm font-semibold text-white/70 hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="relative px-5 py-2.5 overflow-hidden bg-gray-800 text-white text-sm font-semibold rounded-xl transition-all active:scale-95 group"
              >
                <span className="absolute inset-0 w-0 h-full bg-primary-600 transition-all duration-500 ease-out group-hover:w-full rounded-xl"></span>
                <span className="relative z-10 flex items-center space-x-1.5">
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroGeometric
        badge="SpendWise — Personal Finance"
        title1="Take Control of"
        title2="Your Finances"
        description="Track expenses, set savings goals, and get AI-powered insights — all in one beautiful, intuitive dashboard."
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
          <Link
            to="/register"
            className="relative px-8 py-4 overflow-hidden bg-gray-800 text-white font-bold text-lg rounded-2xl shadow-xl shadow-black/20 transition-all active:scale-95 group"
          >
            <span className="absolute inset-0 w-0 h-full bg-primary-600 transition-all duration-500 ease-out group-hover:w-full rounded-2xl"></span>
            <span className="relative z-10 flex items-center space-x-2">
              <span>Start Free</span>
              <ArrowRight className="w-5 h-5" />
            </span>
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 bg-white/[0.06] text-white/80 font-bold text-lg rounded-2xl border border-white/[0.1] hover:bg-white/[0.1] hover:text-white transition-all backdrop-blur-md"
          >
            Sign In
          </Link>
        </div>
      </HeroGeometric>

      {/* Features Section */}
      <section className="relative py-24 md:py-32 bg-[#0a0a0a]">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-600/[0.03] to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 md:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-600/10 border border-primary-600/20 text-primary-400 text-sm font-semibold tracking-wide mb-6">
                <Zap className="w-3.5 h-3.5 fill-primary-400" />
                Features
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
                Everything you need to{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-300">
                  manage money
                </span>
              </h2>
              <p className="text-white/40 text-lg max-w-2xl mx-auto font-light">
                Powerful tools designed to give you complete visibility and control over your personal finances.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                custom={index}
                variants={fadeUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:border-primary-600/30 hover:bg-white/[0.04] transition-all duration-500 cursor-default"
              >
                <div className="w-12 h-12 rounded-2xl bg-gray-800 border border-white/[0.1] flex items-center justify-center text-primary-500 mb-6 group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-all duration-300">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-white/40 font-light leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-t from-primary-600/[0.05] via-transparent to-transparent"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
              Ready to take control?
            </h2>
            <p className="text-white/40 text-lg mb-10 max-w-xl mx-auto font-light">
              Join thousands of users who are already saving smarter with SpendWise. It's free to get started.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="relative px-10 py-4 overflow-hidden bg-gray-800 text-white font-bold text-lg rounded-2xl shadow-xl shadow-black/20 transition-all active:scale-95 group"
              >
                <span className="absolute inset-0 w-0 h-full bg-primary-600 transition-all duration-500 ease-out group-hover:w-full rounded-2xl"></span>
                <span className="relative z-10 flex items-center space-x-2">
                  <span>Create Free Account</span>
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-800 border border-primary-600/30 rounded-lg flex items-center justify-center text-primary-500 font-bold text-sm">
              S
            </div>
            <span className="text-sm font-semibold text-white/60">SpendWise</span>
          </div>
          <p className="text-sm text-white/30 font-light">
            © {new Date().getFullYear()} SpendWise. Built for smarter spending.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
