import type { Metadata } from 'next';
import Link from 'next/link';
import { Lightbulb, Heart, Kanban } from 'lucide-react';
import { CredentialsForm } from '@/features/auth/components/credentials-form';
import { OAuthButtons } from '@/features/auth/components/oauth-buttons';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to FeaturePulse to submit feedback, vote on ideas, and follow our roadmap.',
};

interface LoginPageProps {
  searchParams: Promise<{
    redirect?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectTo = params.redirect || '/dashboard';

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-base-100">
      {/* Left Column: Branding & Value Props */}
      <div className="bg-base-200/40 p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-r border-base-200">
        <div>
          {/* Brand Logo */}
          <Link href="/feedback" className="flex items-center gap-2.5 font-bold text-lg text-base-content hover:opacity-90 transition-opacity mb-12">
            <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-content font-black text-base shadow-sm">
              FP
            </span>
            <span>FeaturePulse</span>
          </Link>

          {/* Value Proposition */}
          <div className="max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-primary mb-2 inline-block">
              Product Community
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-base-content tracking-tight mb-3">
              Real feedback. <br />
              Real progress.
            </h1>
            <p className="text-sm text-base-content/70 leading-relaxed mb-8">
              Join our community of users and help shape the future of our product.
            </p>

            {/* Feature Bullets */}
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-base-100 border border-base-200 flex items-center justify-center shrink-0 shadow-xs">
                  <Lightbulb className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-base-content">
                    Share your ideas
                  </h3>
                  <p className="text-xs text-base-content/60">
                    Tell us what you want to see next.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-base-100 border border-base-200 flex items-center justify-center shrink-0 shadow-xs">
                  <Heart className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-base-content">
                    Vote and discuss
                  </h3>
                  <p className="text-xs text-base-content/60">
                    Support ideas and join the conversation.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-base-100 border border-base-200 flex items-center justify-center shrink-0 shadow-xs">
                  <Kanban className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-base-content">
                    Track progress
                  </h3>
                  <p className="text-xs text-base-content/60">
                    See what&apos;s planned, in progress and completed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Small decorative preview card */}
        <div className="hidden lg:block mt-12 pt-8 border-t border-base-200/80">
          <div className="bg-base-100 border border-base-200/90 rounded-2xl p-4 shadow-sm max-w-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-xs font-semibold text-base-content">Live Public Board</span>
            </div>
            <p className="text-xs text-base-content/60">
              Transparent, real-time collaboration with verified customers and product teams.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Sign In Form */}
      <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center max-w-md w-full mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-base-content mb-1.5">
            Welcome back
          </h2>
          <p className="text-sm text-base-content/60">
            Sign in to your account to continue.
          </p>
        </div>

        {/* Social Logins */}
        <OAuthButtons redirectTo={redirectTo} />

        {/* Divider */}
        <div className="divider my-6 text-xs text-base-content/40 font-medium">
          Or
        </div>

        {/* Credentials Form */}
        <CredentialsForm redirectTo={redirectTo} />

        {/* Footer Link */}
        <p className="text-center text-xs text-base-content/60 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
