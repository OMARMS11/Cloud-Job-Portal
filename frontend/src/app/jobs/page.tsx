import Link from 'next/link';

export default function JobsPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10 animate-float" />
      
      <div className="glass-panel p-12 max-w-4xl w-full z-10 flex flex-col">
        <div className="flex justify-between items-center mb-10 border-b border-glass-border pb-6">
          <h1 className="text-4xl font-bold gradient-text">Explore Jobs</h1>
          <Link href="/" className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full font-medium transition-all hover:-translate-y-1">
            Back to Home
          </Link>
        </div>
        
        <div className="grid gap-6">
          {/* Placeholder Jobs */}
          {[1, 2, 3, 4].map((job) => (
            <div key={job} className="p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white group-hover:text-primary transition-colors">Senior Software Engineer</h3>
                  <p className="text-foreground/60 mt-1">TechCorp Inc. • Remote</p>
                </div>
                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-semibold">$120k - $150k</span>
              </div>
              <p className="text-foreground/80 text-sm line-clamp-2">
                We are looking for an experienced software engineer to join our core infrastructure team. 
                You will be responsible for building highly scalable microservices...
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
