import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Brain, Zap, Lock, ChevronRight, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedButton from '../components/ui/AnimatedButton';
import GlassCard from '../components/ui/GlassCard';

const LandingPage = () => {
  const features = [
    { icon: Brain, title: "Neural Detection", desc: "Advanced AI models trained on millions of transaction patterns to detect anomalies in milliseconds." },
    { icon: Activity, title: "Behavioral Analysis", desc: "Monitor user behavior and device fingerprints to identify account takeovers before they happen." },
    { icon: Lock, title: "Bank-Grade Security", desc: "End-to-end encryption with compliance to global financial security standards." },
  ];

  const stats = [
    { label: "Transactions Analyzed", value: "10B+" },
    { label: "Fraud Prevented", value: "$2.5B" },
    { label: "Detection Rate", value: "99.9%" },
    { label: "Response Time", value: "<50ms" },
  ];

  return (
    <div className="flex flex-col min-h-screen pt-20 pb-16">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full py-20 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8"
        >
          <Zap className="w-4 h-4 animate-pulse" />
          <span className="text-sm font-medium">ChatPayShield AI Engine v2.0 Live</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl"
        >
          AI-Powered <span className="text-gradient">Fraud Intelligence</span> for Digital Payments
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed"
        >
          Protect your platform with real-time neural networks. Detect anomalies, prevent chargebacks, and secure every transaction with absolute confidence.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 w-full justify-center"
        >
          <Link to="/register">
            <AnimatedButton className="w-full sm:w-auto h-14 px-8 text-lg">
              Start Free Trial <ChevronRight className="w-5 h-5 ml-1" />
            </AnimatedButton>
          </Link>
          <Link to="/dashboard">
            <AnimatedButton variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg">
              View Live Demo
            </AnimatedButton>
          </Link>
        </motion.div>

        {/* Hero Visual Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 w-full max-w-5xl relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
          <GlassCard className="p-2 border-white/10 shadow-2xl relative overflow-hidden bg-surface/80">
            {/* Visual Header */}
            <div className="h-8 border-b border-white/5 flex items-center px-4 gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-danger/80" />
              <div className="w-3 h-3 rounded-full bg-warning/80" />
              <div className="w-3 h-3 rounded-full bg-success/80" />
            </div>
            {/* Abstract UI Representation */}
            <div className="h-[400px] flex items-center justify-center relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-primary/20 animate-[spin_10s_linear_infinite]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-secondary/20 animate-[spin_15s_linear_infinite_reverse]" />
              <Shield className="w-24 h-24 text-primary animate-pulse-glow" />
              {/* Floating Data Points */}
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i} 
                  className="absolute w-2 h-2 rounded-full bg-primary"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animation: `float ${2 + Math.random() * 3}s ease-in-out infinite`
                  }}
                />
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-white/5 bg-surface/30 backdrop-blur-sm py-12 my-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm font-medium text-gray-400 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Enterprise-Grade Protection</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">Our sophisticated AI models operate in the background, identifying complex fraud rings without adding friction to legitimate users.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <GlassCard key={idx} hover className="p-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
