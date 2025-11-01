'use client';

import { Sparkles } from 'lucide-react';
import { Button } from '@repo/ui/button';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
}

export default function HeroSection({ 
  title = "Build Solana Programs with AI",
  subtitle = "Powered by AI",
  description = "The ultimate AI-powered development environment for Solana blockchain. Build, deploy, and learn Solana programs with integrated AI assistance, real-time collaboration, and enterprise-grade security."
}: HeroSectionProps) {
  return (
    <section className="mb-12 text-center animate-fade-in-up">
      <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary mb-6">
        <Sparkles className="w-4 h-4" />
        <span>Now with AI-powered code generation</span>
      </div>

      <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        {title}
      </h1>

      <p className="text-xl md:text-2xl text-muted-foreground mb-2 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        {subtitle}
      </p>

      <p className="max-w-2xl mx-auto text-muted-foreground mb-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        {description}
      </p>

      <div className="flex items-center justify-center space-x-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          Get Started Free
        </Button>
        <Button size="lg" variant="outline" className="border-2 hover:bg-primary/10 transition-all duration-300 hover:scale-105">
          <span className="mr-2">▶</span>
          Try Sandbox
        </Button>
      </div>
    </section>
  );
}

