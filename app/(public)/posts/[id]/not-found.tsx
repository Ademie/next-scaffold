import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/ui/navbar';

export default function PostNotFound() {
  return (
    <>
      <Navbar activeTab="feedback" />
      <main className="flex-1 max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-extrabold text-base-content mb-2">Post Not Found</h1>
        <p className="text-sm text-base-content/70 mb-6">
          The feature request you are looking for does not exist or has been removed.
        </p>
        <Link href="/feedback" className="btn btn-primary btn-sm gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to feedback
        </Link>
      </main>
    </>
  );
}
