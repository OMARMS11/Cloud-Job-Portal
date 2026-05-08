import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10 animate-float" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl -z-10 animate-float" style={{ animationDelay: '2s' }} />

      <div className="glass-panel p-12 max-w-4xl w-full z-10 flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
          Find Your Next <br />
          <span className="gradient-text">Dream Career</span>
        </h1>
        
        <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mb-10 leading-relaxed">
          The next-generation job portal designed to connect top talent with world-class opportunities. Experience a seamless hiring journey powered by microservices.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link href="/jobs" className="px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-full font-semibold transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:-translate-y-1">
            Explore Jobs
          </Link>
          <Link href="/profile" className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full font-semibold transition-all hover:-translate-y-1">
            Create Profile
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 w-full border-t border-glass-border pt-10">
          {[
            { label: 'Active Jobs', value: '10,000+' },
            { label: 'Companies', value: '500+' },
            { label: 'Success Hires', value: '50,000+' },
            { label: 'New Daily', value: '1,000+' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-3xl font-bold gradient-text">{stat.value}</span>
              <span className="text-sm text-foreground/60 mt-2 uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
