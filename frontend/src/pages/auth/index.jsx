import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import AnimatedButton from '../../components/ui/AnimatedButton';
import { useAuth } from '../../context/AuthContext';

const AuthLayout = ({ children, title, subtitle }) => (
  <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div className="w-full max-w-md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
          <p className="text-gray-400">{subtitle}</p>
        </div>
        <GlassCard className="p-8">
          {children}
        </GlassCard>
      </motion.div>
    </div>
  </div>
);

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your dashboard">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-danger/10 border border-danger/30 rounded-xl text-danger text-sm">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="email"
              name="email"
              className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-background/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
              placeholder="admin@chatpayshield.com"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="password"
              name="password"
              className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-background/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
              placeholder="••••••••"
              required
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input id="remember-me" type="checkbox" className="h-4 w-4 rounded border-gray-600 bg-background/50 text-primary focus:ring-primary/50" />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">Remember me</label>
          </div>
          <div className="text-sm">
            <a href="#" className="font-medium text-primary hover:text-primary/80 transition-colors">Forgot password?</a>
          </div>
        </div>
        <AnimatedButton type="submit" className="w-full" disabled={loading}>
          {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4 ml-2" />
        </AnimatedButton>
      </form>
      <div className="mt-6 text-center text-sm text-gray-400">
        Don't have an account? <Link to="/register" className="font-medium text-primary hover:text-primary/80">Sign up</Link>
      </div>
    </AuthLayout>
  );
};

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const fullName = e.target.fullName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await register(fullName, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Start protecting your platform today">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-danger/10 border border-danger/30 rounded-xl text-danger text-sm">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              name="fullName"
              className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-background/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
              placeholder="John Doe"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="email"
              name="email"
              className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-background/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
              placeholder="you@company.com"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="password"
              name="password"
              className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-background/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
              placeholder="••••••••"
              required
            />
          </div>
        </div>
        <AnimatedButton type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'} <ArrowRight className="w-4 h-4 ml-2" />
        </AnimatedButton>
      </form>
      <div className="mt-6 text-center text-sm text-gray-400">
        Already have an account? <Link to="/login" className="font-medium text-primary hover:text-primary/80">Sign in</Link>
      </div>
    </AuthLayout>
  );
};
