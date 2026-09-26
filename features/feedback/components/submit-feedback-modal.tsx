'use client';

import { useActionState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { submitFeedbackAction } from '../actions';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="btn btn-primary w-full gap-2 shadow-sm font-medium"
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Submitting...
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4" />
          Submit idea
        </>
      )}
    </button>
  );
}

export function SubmitFeedbackModal() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const isOpen = searchParams.get('modal') === 'submit-feedback';

  const [state, formAction] = useActionState(submitFeedbackAction, null);

  const closeModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('modal');
    router.replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    if (state?.success) {
      closeModal();
    }
  }, [state]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="card bg-base-100 border border-base-200 shadow-2xl max-w-lg w-full p-6 relative rounded-2xl">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="btn btn-ghost btn-circle btn-sm absolute right-4 top-4 text-base-content/60"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="text-xl font-bold text-base-content mb-1">Submit feedback</h2>
        <p className="text-sm text-base-content/70 mb-5">
          Share your idea or request. The community can upvote and discuss it.
        </p>

        <form action={formAction} className="flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-base-content/80 mb-1.5">
              Title
            </label>
            <input
              name="title"
              type="text"
              placeholder="e.g. Dark mode improvements"
              required
              className="input input-bordered w-full rounded-xl text-sm focus:input-primary"
            />
            {state?.errors?.title && (
              <p className="text-error text-xs mt-1">{state.errors.title[0]}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-base-content/80 mb-1.5">
              Category
            </label>
            <select
              name="category"
              defaultValue="UI"
              required
              className="select select-bordered w-full rounded-xl text-sm focus:select-primary"
            >
              <option value="API">API</option>
              <option value="UI">UI</option>
              <option value="Integrations">Integrations</option>
              <option value="Security">Security</option>
              <option value="Mobile">Mobile</option>
              <option value="Analytics">Analytics</option>
              <option value="Productivity">Productivity</option>
            </select>
            {state?.errors?.category && (
              <p className="text-error text-xs mt-1">{state.errors.category[0]}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-base-content/80 mb-1.5">
              Description
            </label>
            <textarea
              name="content"
              rows={4}
              placeholder="Explain the problem or how this feature would help you..."
              required
              className="textarea textarea-bordered w-full rounded-xl text-sm focus:textarea-primary resize-none leading-relaxed"
            />
            {state?.errors?.content && (
              <p className="text-error text-xs mt-1">{state.errors.content[0]}</p>
            )}
          </div>

          <div className="mt-2">
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
}
