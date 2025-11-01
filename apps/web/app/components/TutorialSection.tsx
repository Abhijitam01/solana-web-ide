'use client';

import { Play } from 'lucide-react';
import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';

interface Tutorial {
  title: string;
  duration: string;
  thumbnail: string;
  link: string;
}

const tutorials: Tutorial[] = [
  {
    title: 'Build a Blog DApp using Solana Playground',
    duration: '15 min',
    thumbnail: '/api/placeholder/400/225',
    link: 'https://www.youtube.com/watch?v=example1'
  },
  {
    title: 'Build a Todo DApp using Solana Playground',
    duration: '20 min',
    thumbnail: '/api/placeholder/400/225',
    link: 'https://www.youtube.com/watch?v=example2'
  },
  {
    title: 'Creating Your First Solana Program',
    duration: '12 min',
    thumbnail: '/api/placeholder/400/225',
    link: 'https://www.youtube.com/watch?v=example3'
  }
];

export default function TutorialSection() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-foreground mb-6">Tutorials</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tutorials.map((tutorial, index) => (
          <Card
            key={index}
            className="group overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-purple-600/20 overflow-hidden">
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                </div>
              </div>
              
              {/* Duration badge */}
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-xs text-white backdrop-blur-sm">
                {tutorial.duration}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {tutorial.title}
              </h3>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

