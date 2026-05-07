import Link from 'next/link';

export default function ProfilePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-40 left-40 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -z-10 animate-float" />
      
      <div className="glass-panel p-12 max-w-2xl w-full z-10 flex flex-col">
        <div className="flex justify-between items-center mb-10 border-b border-glass-border pb-6">
          <h1 className="text-4xl font-bold gradient-text">Your Profile</h1>
          <Link href="/" className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full font-medium transition-all hover:-translate-y-1">
            Back to Home
          </Link>
        </div>
        
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-6 mb-4">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/50 text-3xl font-bold text-primary">
              JD
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">John Doe</h2>
              <p className="text-foreground/60">Software Developer</p>
            </div>
          </div>
          
          <div className="space-y-4 text-sm text-foreground/80 bg-white/5 p-6 rounded-xl border border-white/10">
            <div className="flex justify-between border-b border-white/10 pb-3">
              <span className="font-semibold text-white">Email:</span>
              <span>john.doe@example.com</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-3">
              <span className="font-semibold text-white">Location:</span>
              <span>San Francisco, CA</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-white">Experience:</span>
              <span>5 Years</span>
            </div>
          </div>
          
          <button className="mt-4 px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] w-full text-center">
            Edit Profile
          </button>
        </div>
      </div>
    </main>
  );
}
