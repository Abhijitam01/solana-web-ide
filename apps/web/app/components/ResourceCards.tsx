'use client';

import { BookOpen, Code, Octagon, Sparkles, Search, Layers } from 'lucide-react';
import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';

interface ResourceCard {
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  description: string;
  link: string;
}

const resources: ResourceCard[] = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    iconColor: 'bg-purple-500',
    title: 'Cookbook',
    description: 'Detailed explanations and guides for building applications on Solana.',
    link: 'https://solanacookbook.com/'
  },
  {
    icon: <Code className="w-6 h-6" />,
    iconColor: 'bg-gray-400',
    title: 'Anchor',
    description: 'Everything related to developing on Solana with Anchor framework.',
    link: 'https://www.anchor-lang.com/'
  },
  {
    icon: <Octagon className="w-6 h-6" />,
    iconColor: 'bg-pink-500',
    title: 'Seahorse',
    description: 'Write Anchor-compatible Solana programs in Python.',
    link: 'https://seahorse-lang.org/'
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    iconColor: 'bg-purple-600',
    title: 'SolDev',
    description: 'Solana content aggregator with easy discoverability for all your development needs.',
    link: 'https://soldev.app/'
  },
  {
    icon: <Layers className="w-6 h-6" />,
    iconColor: 'bg-teal-500',
    title: 'Solana Docs',
    description: 'The core Solana documentation used to provide deep understanding of Solana concepts.',
    link: 'https://docs.solana.com/'
  },
  {
    icon: <Search className="w-6 h-6" />,
    iconColor: 'bg-gray-500',
    title: 'Metaplex Docs',
    description: 'Documentation for understanding how to work with NFTs on Solana using the Metaplex Standards.',
    link: 'https://docs.metaplex.com/'
  }
];

export default function ResourceCards() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-foreground mb-6">Resources</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource, index) => (
          <Card
            key={index}
            className="group p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex flex-col h-full">
              {/* Icon */}
              <div className={`${resource.iconColor} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                {resource.icon}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">{resource.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{resource.description}</p>
              </div>

              {/* Learn more button */}
              <div className="mt-4">
                <Button
                  variant="ghost"
                  className="w-full group-hover:bg-primary/10 group-hover:text-primary transition-colors"
                  onClick={() => window.open(resource.link, '_blank')}
                >
                  <span className="mr-2">Learn more</span>
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

