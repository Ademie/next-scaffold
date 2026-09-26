'use client';

import { useActionState, useRef, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { addCommentAction } from '../actions';

interface CommentFormProps {
  postId: string;
  userAvatar?: string;
}

function PostButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="btn btn-neutral btn-sm rounded-lg font-medium px-4"
    >
      {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Post'}
    </button>
  );
}

export function CommentForm({ postId, userAvatar }: CommentFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const actionWithPostId = addCommentAction.bind(null, postId);
  const [state, formAction] = useActionState(actionWithPostId, null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80';

  return (
    <form ref={formRef} action={formAction} className="flex items-start gap-3 w-full my-6">
      <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-base-200">
        <Image
          src={userAvatar || defaultAvatar}
          alt="Your avatar"
          fill
          sizes="36px"
          className="object-cover"
        />
      </div>

      <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <input
          name="content"
          type="text"
          placeholder="Add a comment..."
          required
          className="input input-bordered w-full rounded-xl text-sm bg-base-100 border-base-200 focus:border-primary flex-1"
        />
        <div className="flex justify-end">
          <PostButton />
        </div>
      </div>
    </form>
  );
}
