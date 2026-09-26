import Link from 'next/link';
import { Search, Compass } from 'lucide-react';
import { getSession } from '@/lib/auth/dal';

interface NavbarProps {
  activeTab?: 'feedback' | 'roadmap' | 'changelog';
}

export async function Navbar({ activeTab = 'feedback' }: NavbarProps) {
  const session = await getSession();

  return (
    <header className="border-b border-base-200 bg-base-100 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link href="/feedback" className="flex items-center gap-2.5 font-bold text-lg text-base-content hover:opacity-90 transition-opacity">
            <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-content font-black text-base shadow-sm">
              FP
            </span>
            <span>FeaturePulse</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              href="/roadmap"
              className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                activeTab === 'roadmap'
                  ? 'text-primary font-semibold border-b-2 border-primary rounded-b-none'
                  : 'text-base-content/70 hover:text-base-content hover:bg-base-200/60'
              }`}
            >
              Roadmap
            </Link>
            <Link
              href="/feedback"
              className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                activeTab === 'feedback'
                  ? 'text-primary font-semibold border-b-2 border-primary rounded-b-none'
                  : 'text-base-content/70 hover:text-base-content hover:bg-base-200/60'
              }`}
            >
              Feedback
            </Link>
            <Link
              href="/changelog"
              className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                activeTab === 'changelog'
                  ? 'text-primary font-semibold border-b-2 border-primary rounded-b-none'
                  : 'text-base-content/70 hover:text-base-content hover:bg-base-200/60'
              }`}
            >
              Changelog
            </Link>
          </nav>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          <Link
            href="/feedback?modal=search"
            aria-label="Search"
            className="btn btn-ghost btn-circle btn-sm text-base-content/70 hover:text-base-content"
          >
            <Search className="w-4 h-4" />
          </Link>

          {session ? (
            <div className="flex items-center gap-2">
              <Link href="/dashboard" className="btn btn-primary btn-sm gap-1.5 font-medium shadow-sm">
                <Compass className="w-4 h-4" />
                Dashboard
              </Link>
            </div>
          ) : (
            <Link href="/login" className="btn btn-neutral btn-sm font-medium px-4">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
