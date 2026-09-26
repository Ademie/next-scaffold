# Execution Plan: Screen 04 — Authentication & Sign In (`screen_authentication.md`)

**Target Route:** `/login`  
**Matching UI:** Bottom-Left screen in `ui/ux.png`  
**SRS Reference:** Section 4.1 (Authentication & Session Management), Section 5.2 (Security Boundaries)  
**Architectural Contract:** Conforms to [`AGENTS.md`](../AGENTS.md) (Cookie session at network edge, Zod validation, dual boundary defense)

---

## 1. Visual & Layout Breakdown (From Mockup)

Split 2-column layout (`grid grid-cols-1 lg:grid-cols-2 min-h-screen`):

1. **Left Hero Column (Branding & Value Props):**
   - Brand logo: `FeaturePulse` in top corner.
   - Graphic / Illustration: Mockup card showing a feature request card with upvote button and feedback preview.
   - Eyebrow tag: `PRODUCT COMMUNITY`.
   - Headline: `<h1>Real feedback. Real progress.</h1>`.
   - Subtitle: `"Join our community of users and help shape the future of our product."`
   - Three feature benefit items with icons:
     1. **Share your ideas**: *"Tell us what you want to see next."* (Idea / bulb icon).
     2. **Vote and discuss**: *"Support ideas and join the conversation."* (Heart / upvote icon).
     3. **Track progress**: *"See what's planned, in progress and completed."* (Board / roadmap icon).
2. **Right Auth Column (Form Card):**
   - Centered container with clean padding.
   - Header:
     - Title: `<h2>Welcome back</h2>`
     - Subtitle: `"Sign in to your account to continue."`
   - Social Logins:
     - Button: `Continue with Google` (with official Google icon).
     - Button: `Continue with GitHub` (with official GitHub icon).
   - Divider with text: `Or`.
   - Credential Form:
     - Email address field: Label `Email address`, placeholder `you@company.com`.
     - Password field: Label `Password`, placeholder `Enter your password`, toggle visibility eye icon, `Forgot password?` link right-aligned.
     - Submit Button: Full-width dark button `Sign in`.
   - Footer link: `"Don't have an account? Create account"`.

---

## 2. Server vs. Client Component Boundaries

```text
app/(auth)/login/page.tsx (Server Component)
├── features/auth/components/auth-branding-panel.tsx (Server Component - static UI)
└── features/auth/components/sign-in-card.tsx (Server Component)
    ├── features/auth/components/oauth-buttons.tsx (Client Component - OAuth triggers)
    └── features/auth/components/credentials-form.tsx (Client Component - useActionState)
```

- **Server Components:**
  - `page.tsx`: Inspects redirect destination from `searchParams.redirect`.
  - `auth-branding-panel.tsx`: Renders the left side marketing layout with zero JS runtime overhead.
  - `sign-in-card.tsx`: Base container for the login panel.
- **Client Components (Strict Leaf Islands):**
  - `<OAuthButtons />`: Handles redirects to Google / GitHub OAuth providers.
  - `<CredentialsForm />`: Manages form validation, password visibility toggle, pending state (`useActionState`), and error messages.

---

## 3. Server Actions & Authentication Contracts

### 3.1 Server Action (`features/auth/actions.ts`)
```typescript
export async function signInWithCredentialsAction(
  prevState: ActionResponse<{ redirectTo: string }>,
  formData: FormData
): Promise<ActionResponse<{ redirectTo: string }>> {
  // Validate email and password via Zod
  const validated = signInSchema.safeParse(Object.fromEntries(formData));
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  // Verify credentials in DB
  const user = await verifyUserCredentials(validated.data.email, validated.data.password);
  if (!user) {
    return {
      success: false,
      errors: { root: ['Invalid email or password.'] },
    };
  }

  // Set secure, httpOnly session cookie
  await createSession(user.id);

  // Return success redirect path (default to /dashboard or /feedback)
  return { success: true, data: { redirectTo: validated.data.redirect || '/dashboard' } };
}
```

---

## 4. Edge & Data Boundary Alignment (`proxy.ts` & DAL)

1. **`proxy.ts` (Next.js 16 Edge Boundary):**
   - Intercepts requests to `/dashboard/*`.
   - Checks presence of `session_token` cookie.
   - If missing, redirects immediately to `/login?redirect=${encodeURIComponent(req.url)}`.
2. **`lib/auth/dal.ts` (Data Access Layer):**
   - When reaching protected server components, decrypts and validates the session user.
   - Ensures user has an active membership in the organization before returning sensitive data.

---

## 5. UI Implementation & daisyUI Tokens

- **Left Brand Column:**
  - `bg-base-200/50 p-8 lg:p-16 flex flex-col justify-between border-r border-base-200`
- **Social Buttons:**
  - `btn btn-outline border-base-300 w-full flex items-center justify-center gap-3 font-medium`
- **Input Fields:**
  - `input input-bordered w-full focus:input-primary`
- **Sign In Button:**
  - `btn btn-neutral w-full font-semibold`
