'use client';

import { useState } from 'react';
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
  Play
} from 'lucide-react';

interface LandingPageProps {
  onLogin?: () => void;
  onSignup?: () => void;
}

export default function LandingPage({ onLogin, onSignup }: LandingPageProps) {

  const features = [
    {
      icon: Bot,
      title: 'AI-Powered Development',
      description: 'Get intelligent code suggestions and explanations powered by advanced AI models.'
    },
    {
      icon: Code2,
      title: 'Modern IDE Experience',
      description: 'Full-featured code editor with syntax highlighting, IntelliSense, and debugging tools.'
    },
    {
      icon: Zap,
      title: 'Instant Compilation',
      description: 'Compile and deploy your Solana programs with a single click.'
    },
    {
      icon: Shield,
      title: 'Security First',
      description: 'Built-in security analysis and best practices for Solana development.'
    },
    {
      icon: Rocket,
      title: 'One-Click Deploy',
      description: 'Deploy to Solana devnet, testnet, or mainnet directly from the IDE.'
    },
    {
      icon: Star,
      title: 'Template Library',
      description: 'Access hundreds of pre-built Solana program templates and examples.'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">⚡</span>
            </div>
            <span className="text-2xl font-bold text-white">
              Solana AI IDE
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </Button>
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
              <Twitter className="h-4 w-4 mr-2" />
              Twitter
            </Button>
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
              <MessageCircle className="h-4 w-4 mr-2" />
              Discord
            </Button>
            <div className="w-px h-6 bg-white/20 mx-2"></div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onLogin}
              className="border-white/20 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Button>
            <Button 
              size="sm" 
              onClick={onSignup}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-32 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-blue-500/5"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 mb-8">
            <span className="text-sm text-blue-300">🚀 Now with AI-powered code generation</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="text-white">
              Build Solana
            </span>
            <br />
            <span className="text-blue-400">
              Programs with AI
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
            The ultimate AI-powered development environment for Solana blockchain. 
            Build, deploy, and learn Solana programs with integrated AI assistance, 
            real-time collaboration, and enterprise-grade security.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button 
              size="lg" 
              className="text-lg px-10 py-6 bg-blue-600 hover:bg-blue-700 text-white shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
            >
              Get Started Free
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-10 py-6 border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/50 backdrop-blur-sm"
            >
              <Play className="mr-3 h-6 w-6" />
              Try Sandbox
            </Button>
          </div>

          {/* Code Preview */}
          <div className="max-w-5xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/10 rounded-2xl blur-xl"></div>
              <Card className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-700 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800/50">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Code2 className="h-4 w-4" />
                      <span className="text-sm font-medium">lib.rs</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-blue-300">AI Powered</span>
                  </div>
                </div>
                <div className="p-6">
                  <pre className="text-sm text-white/90 font-mono leading-relaxed overflow-x-auto">
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
                  </pre>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

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
      <section className="py-32 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 mb-6">
              <span className="text-sm text-blue-300">✨ Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Everything you need to build on Solana
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              From AI-powered code generation to one-click deployment, 
              we've got all the tools you need to succeed in Web3 development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group relative">
                  <div className="absolute inset-0 bg-blue-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Card className="relative bg-gray-900/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 hover:bg-gray-800/50 transition-all duration-300 hover:scale-105">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 relative">
        <div className="absolute inset-0 bg-blue-500/5"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white">
              Ready to start building?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of developers building the future of Web3 on Solana. 
              Start your journey today with our AI-powered development environment.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-12 py-6 bg-blue-600 hover:bg-blue-700 text-white shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
              >
                Start Building Now
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-12 py-6 border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/50 backdrop-blur-sm"
              >
                Try Sandbox
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">⚡</span>
              </div>
              <span className="text-xl font-bold text-white">
                Solana AI IDE
              </span>
            </div>
            
            <div className="flex items-center space-x-8 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              © 2024 Solana AI IDE. Built with ❤️ for the Solana ecosystem.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
