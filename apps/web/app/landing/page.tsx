'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@repo/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/card';
import { Code } from '@repo/ui/code';
import { 
  Bot, 
  Code2, 
  Zap, 
  Shield, 
  Rocket, 
  Star,
  ArrowRight,
  Github,
  Twitter,
  MessageCircle,
  LogIn,
  UserPlus,
  Play,
  Sparkles,
  Layers,
  Cpu,
  Database,
  Globe,
  Lock,
  CheckCircle,
  TrendingUp,
  Users,
  Award,
  ChevronRight,
  ExternalLink,
  Terminal,
  FileCode,
  GitBranch,
  Settings,
  Monitor
} from 'lucide-react';
import { fadeInUp, slideInLeft, slideInRight, staggerContainer, staggerItem } from '../../lib/animations';

interface LandingPageProps {
  onLogin?: () => void;
  onSignup?: () => void;
}

// Typing animation component
const TypingAnimation = ({ text, className = "" }: { text: string; className?: string }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <span className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="inline-block w-0.5 h-8 bg-blue-400 ml-1"
      />
    </span>
  );
};

// Floating particles component
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

export default function LandingPage({ onLogin, onSignup }: LandingPageProps) {

  const features = [
    {
      icon: Bot,
      title: 'AI-Powered Development',
      description: 'Get intelligent code suggestions, explanations, and automated testing powered by advanced AI models.',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/10 to-pink-500/10'
    },
    {
      icon: Code2,
      title: 'Modern IDE Experience',
      description: 'Full-featured code editor with syntax highlighting, IntelliSense, debugging tools, and real-time collaboration.',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/10 to-cyan-500/10'
    },
    {
      icon: Zap,
      title: 'Instant Compilation',
      description: 'Compile and deploy your Solana programs with a single click. No complex setup required.',
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-500/10 to-orange-500/10'
    },
    {
      icon: Shield,
      title: 'Security First',
      description: 'Built-in security analysis, vulnerability scanning, and best practices for Solana development.',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-500/10 to-emerald-500/10'
    },
    {
      icon: Rocket,
      title: 'One-Click Deploy',
      description: 'Deploy to Solana devnet, testnet, or mainnet directly from the IDE with automated testing.',
      gradient: 'from-red-500 to-pink-500',
      bgGradient: 'from-red-500/10 to-pink-500/10'
    },
    {
      icon: Star,
      title: 'Template Library',
      description: 'Access hundreds of pre-built Solana program templates, examples, and community contributions.',
      gradient: 'from-indigo-500 to-purple-500',
      bgGradient: 'from-indigo-500/10 to-purple-500/10'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Developers' },
    { number: '50K+', label: 'Programs Deployed' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'AI Support' }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Senior Blockchain Developer',
      company: 'DeFi Protocol',
      content: 'Solana AI IDE has revolutionized how we build on Solana. The AI assistance is incredible.',
      avatar: 'SC'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Founder',
      company: 'NFT Marketplace',
      content: 'From idea to mainnet in days, not weeks. This is the future of Web3 development.',
      avatar: 'MR'
    },
    {
      name: 'Emily Watson',
      role: 'CTO',
      company: 'Gaming Studio',
      content: 'The debugging tools and security features saved us countless hours of development time.',
      avatar: 'EW'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-pink-500/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
        <FloatingParticles />
      </div>

      {/* Header */}
      <motion.header 
        className="relative z-50 border-b border-white/10 bg-black/20 backdrop-blur-2xl"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-50"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Solana AI IDE
              </h1>
              <p className="text-xs text-gray-400">Powered by AI</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="hidden md:flex items-center space-x-2">
              <motion.a 
                href="#" 
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <Github className="h-5 w-5 text-gray-300" />
              </motion.a>
              <motion.a 
                href="#" 
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <Twitter className="h-5 w-5 text-gray-300" />
              </motion.a>
              <motion.a 
                href="#" 
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <MessageCircle className="h-5 w-5 text-gray-300" />
              </motion.a>
            </div>
            
            <div className="w-px h-8 bg-white/20"></div>
            
            <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
            >
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onLogin}
                className="text-gray-300 hover:text-white hover:bg-white/10 px-6 py-2 rounded-xl transition-all duration-300"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="sm" 
                onClick={onSignup}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Sign Up
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="container mx-auto relative z-10">
          <motion.div 
            className="text-center mb-16"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div 
              className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-white/10 mb-8"
              variants={fadeInUp}
            >
              <Sparkles className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-sm font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Now with AI-powered code generation
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
              variants={fadeInUp}
            >
              <span className="block bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                <TypingAnimation text="Build Solana" className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent" />
              </span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                <TypingAnimation text="Programs with AI" className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent" />
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              The ultimate AI-powered development environment for Solana blockchain. 
              Build, deploy, and learn Solana programs with integrated AI assistance, 
              real-time collaboration, and enterprise-grade security.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center mb-20"
              variants={fadeInUp}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Button 
                  size="lg" 
                  className="relative text-lg px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 rounded-2xl border border-blue-500/20"
                >
                  <motion.span
                    className="flex items-center"
                    whileHover={{ x: 2 }}
                  >
                    Get Started Free
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </motion.span>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-white/5 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="relative text-lg px-12 py-6 border-white/20 text-white hover:bg-white/10 hover:border-white/30 backdrop-blur-xl rounded-2xl"
                >
                  <motion.span
                    className="flex items-center"
                    whileHover={{ x: 2 }}
                  >
                    <Play className="mr-3 h-6 w-6" />
                    Try Sandbox
                  </motion.span>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Enhanced Code Preview */}
          <motion.div 
            className="max-w-6xl mx-auto"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.4 }}
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
              <Card className="relative bg-gray-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl group-hover:border-white/20 transition-all duration-500">
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gray-800/30">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <motion.div 
                        className="w-3 h-3 bg-red-400 rounded-full shadow-lg"
                        whileHover={{ scale: 1.2 }}
                      />
                      <motion.div 
                        className="w-3 h-3 bg-yellow-400 rounded-full shadow-lg"
                        whileHover={{ scale: 1.2 }}
                      />
                      <motion.div 
                        className="w-3 h-3 bg-green-400 rounded-full shadow-lg"
                        whileHover={{ scale: 1.2 }}
                      />
                    </div>
                    <div className="flex items-center space-x-3 text-gray-300">
                      <Code2 className="h-5 w-5" />
                      <span className="text-sm font-medium">lib.rs</span>
                      <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                      <span className="text-xs text-gray-500">Rust</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <motion.div 
                      className="flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-blue-300 font-medium">AI Powered</span>
                    </motion.div>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Terminal className="h-4 w-4" />
                      <span className="text-xs">Terminal</span>
                    </div>
                    <motion.button
                      className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Play className="h-4 w-4 text-green-400" />
                    </motion.button>
                  </div>
                </div>
                <div className="p-8 relative">
                  <div className="absolute top-4 right-4 flex items-center space-x-2">
                    <motion.div
                      className="w-2 h-2 bg-green-400 rounded-full"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-xs text-green-400 font-medium">Live</span>
                  </div>
                  <pre className="text-sm text-white/90 font-mono leading-relaxed overflow-x-auto">
                    <motion.code
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.8 }}
                    >
{`use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111");

#[program]
pub mod hello_world {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = 0;
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count += 1;
        Ok(())
    }
}`}
                    </motion.code>
                  </pre>
                  <div className="absolute bottom-4 right-4 flex items-center space-x-2 text-xs text-gray-500">
                    <span>Lines: 18</span>
                    <span>•</span>
                    <span>Characters: 456</span>
                    <span>•</span>
                    <span>AI Suggestions: 3</span>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <motion.div
            className="flex flex-col items-center text-gray-400"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-sm mb-2">Scroll to explore</span>
            <motion.div
              className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
              animate={{ borderColor: ['#9CA3AF', '#3B82F6', '#9CA3AF'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="w-1 h-3 bg-gray-400 rounded-full mt-2"
                animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <motion.section 
        className="py-20 px-4 relative"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center"
                variants={fadeInUp}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl"></div>
                  <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
                    <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                      {stat.number}
                    </h3>
                    <p className="text-gray-300 text-sm font-medium">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Quick Onboarding Section */}
      <section className="py-24 px-4 bg-gray-900/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              From signup to deployment, we've made Solana development as simple as possible.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserPlus className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">1. Sign Up</h3>
              <p className="text-gray-300">Create your free account in seconds. No credit card required.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Code2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">2. Choose Template</h3>
              <p className="text-gray-300">Pick from our library of Solana program templates or start from scratch.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Rocket className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">3. Deploy</h3>
              <p className="text-gray-300">One-click deployment to Solana devnet, testnet, or mainnet.</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
            >
              Start Building Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-sm text-gray-400 mt-4">
              Or <button className="text-blue-400 hover:text-blue-300 underline">try our sandbox</button> without signing up
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <motion.section 
        className="py-32 px-4 relative"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-20"
            variants={fadeInUp}
          >
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-white/10 mb-8">
              <Sparkles className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-sm font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ✨ Features
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Everything you need to build on Solana
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              From AI-powered code generation to one-click deployment, 
              we've got all the tools you need to succeed in Web3 development.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div 
                  key={index} 
                  className="group relative"
                  variants={fadeInUp}
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  <Card className="relative bg-gray-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 hover:bg-gray-800/40 transition-all duration-500 hover:border-white/20">
                    <div className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-3xl flex items-center justify-center mb-8 group-hover:scale-105 transition-transform duration-200 shadow-2xl`}>
                      <Icon className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {feature.description}
                    </p>
                    <div className="mt-6 flex items-center text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-sm font-medium mr-2">Learn more</span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section 
        className="py-32 px-4 relative"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-20"
            variants={fadeInUp}
          >
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-xl border border-white/10 mb-8">
              <Users className="h-4 w-4 text-green-400 mr-2" />
              <span className="text-sm font-medium bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                💬 Testimonials
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Loved by developers worldwide
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              See what developers are saying about their experience with Solana AI IDE.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                className="group relative"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Card className="relative bg-gray-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 hover:bg-gray-800/40 transition-all duration-500">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{testimonial.name}</h4>
                      <p className="text-gray-400 text-sm">{testimonial.role}</p>
                      <p className="text-blue-400 text-sm">{testimonial.company}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed text-lg italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center mt-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-32 px-4 relative"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
        <div className="container mx-auto text-center relative z-10">
          <motion.div 
            className="max-w-5xl mx-auto"
            variants={fadeInUp}
          >
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-white/10 mb-8">
              <Rocket className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-sm font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                🚀 Ready to start?
              </span>
            </div>
            <h2 className="text-4xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Ready to start building?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of developers building the future of Web3 on Solana. 
              Start your journey today with our AI-powered development environment.
            </p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center"
              variants={fadeInUp}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  className="text-lg px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 rounded-2xl"
                >
                  Start Building Now
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-12 py-6 border-white/20 text-white hover:bg-white/10 hover:border-white/30 backdrop-blur-xl rounded-2xl"
                >
                  <ExternalLink className="mr-3 h-6 w-6" />
                  Try Sandbox
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        className="border-t border-white/10 bg-gray-900/30 backdrop-blur-2xl"
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <motion.div 
                className="flex items-center space-x-4 mb-6"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-50"></div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Solana AI IDE
                  </h3>
                  <p className="text-gray-400 text-sm">Powered by AI</p>
                </div>
              </motion.div>
              <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                The ultimate AI-powered development environment for Solana blockchain. 
                Build, deploy, and learn with integrated AI assistance.
              </p>
              <div className="flex items-center space-x-4 mt-6">
                <motion.a 
                  href="#" 
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github className="h-5 w-5 text-gray-300" />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Twitter className="h-5 w-5 text-gray-300" />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MessageCircle className="h-5 w-5 text-gray-300" />
                </motion.a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold text-lg mb-6">Product</h4>
              <div className="space-y-4">
                {['Features', 'Templates', 'Documentation', 'API', 'Pricing'].map((item) => (
                  <motion.a 
                    key={item}
                    href="#" 
                    className="block text-gray-400 hover:text-white transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold text-lg mb-6">Support</h4>
              <div className="space-y-4">
                {['Help Center', 'Community', 'Contact', 'Status', 'Security'].map((item) => (
                  <motion.a 
                    key={item}
                    href="#" 
                    className="block text-gray-400 hover:text-white transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2024 Solana AI IDE. Built with ❤️ for the Solana ecosystem.
              </p>
              <div className="flex items-center space-x-8 text-sm text-gray-400">
                <motion.a 
                  href="#" 
                  className="hover:text-white transition-colors"
                  whileHover={{ y: -2 }}
                >
                  Privacy Policy
                </motion.a>
                <motion.a 
                  href="#" 
                  className="hover:text-white transition-colors"
                  whileHover={{ y: -2 }}
                >
                  Terms of Service
                </motion.a>
                <motion.a 
                  href="#" 
                  className="hover:text-white transition-colors"
                  whileHover={{ y: -2 }}
                >
                  Cookie Policy
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

