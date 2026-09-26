import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/ui/navbar';
import { getFeedbackPostByIdQuery, getCommentsByPostIdQuery } from '@/features/feedback/queries';
import { LargeUpvoteWidget } from '@/features/feedback/components/large-upvote-widget';
import { CommentForm } from '@/features/feedback/components/comment-form';
import { CommentItem } from '@/features/feedback/components/comment-item';
import { getSession } from '@/lib/auth/dal';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getFeedbackPostByIdQuery(id);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.content.slice(0, 160),
    openGraph: {
      title: `${post.title} — ${post.upvoteCount} Upvotes`,
      description: post.content.slice(0, 160),
      type: 'article',
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.content.slice(0, 160),
    },
  };
}

function formatRelativeTime(dateString: string) {
  const diffDays = Math.max(1, Math.round((Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24)));
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  const diffWeeks = Math.round(diffDays / 7);
  return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
}

export default async function PostDetailPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getFeedbackPostByIdQuery(id);

  if (!post) {
    notFound();
  }

  const comments = await getCommentsByPostIdQuery(id);
  const session = await getSession();

  const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';

  return (
    <>
      <Navbar activeTab="feedback" />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10">
        {/* Back Link */}
        <Link
          href="/feedback"
          className="inline-flex items-center gap-2 text-xs font-semibold text-base-content/70 hover:text-base-content mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to feedback</span>
        </Link>

        {/* Post Container */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8">
          <div className="flex-1 min-w-0">
            {/* Category Pill */}
            <span className="badge badge-info badge-soft badge-sm font-semibold mb-3 rounded-md uppercase tracking-wider text-[10px]">
              {post.category}
            </span>

            {/* Post Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight mb-4">
              {post.title}
            </h1>

            {/* Author Metadata Row */}
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-base-200">
                <Image
                  src={post.authorAvatar || defaultAvatar}
                  alt={post.authorName}
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              </div>
              <div className="text-xs">
                <span className="font-semibold text-base-content block">
                  {post.authorName}
                </span>
                <span className="text-base-content/50">
                  {formatRelativeTime(post.createdAt)}
                </span>
              </div>
            </div>

            {/* Post Content */}
            <div className="prose max-w-none text-base-content/80 text-sm leading-relaxed whitespace-pre-line mb-6">
              {post.content}
            </div>

            {/* Tags Row */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-base-200">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="badge badge-ghost badge-sm text-xs font-medium px-2.5 py-0.5 rounded-lg text-base-content/70"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Large Upvote Widget (Top-Right) */}
          <div className="shrink-0 w-full md:w-auto">
            <LargeUpvoteWidget postId={post.id} initialCount={post.upvoteCount} />
          </div>
        </div>

        {/* Comments & Discussion Thread */}
        <div id="comments" className="mt-12 pt-8 border-t border-base-200">
          <h2 className="text-base font-bold text-base-content mb-4">
            {post.commentCount} comments
          </h2>

          {/* Add Comment Form */}
          <CommentForm postId={post.id} userAvatar={session?.name ? undefined : undefined} />

          {/* Comments List */}
          <div className="flex flex-col gap-3.5 mt-6">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
