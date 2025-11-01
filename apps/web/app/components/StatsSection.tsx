'use client';

export default function StatsSection() {
  const stats = [
    { value: '10K+', label: 'Active Developers' },
    { value: '50K+', label: 'Programs Deployed' },
    { value: '500+', label: 'Learning Resources' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="text-center p-6 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
            {stat.value}
          </div>
          <div className="text-muted-foreground font-medium">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

