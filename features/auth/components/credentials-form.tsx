'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { signInAction } from '../actions';

interface CredentialsFormProps {
  redirectTo?: string;
}

function SignInSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="btn btn-neutral w-full font-semibold rounded-xl text-sm"
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Signing in...
        </>
      ) : (
        'Sign in'
      )}
    </button>
  );
}

export function CredentialsForm({ redirectTo = '/dashboard' }: CredentialsFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction] = useActionState(signInAction, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="redirect" value={redirectTo} />

      {/* Email Address */}
      <div>
        <label className="block text-xs font-semibold text-base-content/80 mb-1.5">
          Email address
        </label>
        <input
          name="email"
          type="email"
          defaultValue="you@company.com"
          placeholder="you@company.com"
          required
          className="input input-bordered w-full rounded-xl text-sm focus:input-primary"
        />
        {state?.errors?.email && (
          <p className="text-error text-xs mt-1">{state.errors.email[0]}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-base-content/80">
            Password
          </label>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-xs text-primary font-medium hover:underline"
          >
            Forgot password?
          </a>
        </div>

        <div className="relative">
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            defaultValue="password123"
            placeholder="Enter your password"
            required
            className="input input-bordered w-full pr-10 rounded-xl text-sm focus:input-primary"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {state?.errors?.password && (
          <p className="text-error text-xs mt-1">{state.errors.password[0]}</p>
        )}
      </div>

      <div className="mt-2">
        <SignInSubmitButton />
      </div>
    </form>
  );
}
