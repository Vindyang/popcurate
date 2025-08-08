# Authentication Flows for Better Auth Integration

## 1. Sign Up

- User provides email and password (and optionally name).
- Optionally support social sign up (Google, Apple, etc.) if Better Auth supports it.
- Email verification sent after registration.

## 2. Sign In

- User enters email and password.
- Optionally support social sign in.
- If multi-factor authentication is enabled, prompt for second factor.

## 3. Sign Out

- User session is invalidated (token/cookie cleared).

## 4. Password Reset

- User requests password reset via email.
- Receives a secure link to reset password.

## 5. Email Verification

- After sign up, user must verify email before accessing protected resources.

## 6. Session Management

- Use secure, HTTP-only cookies or JWTs for session.
- Implement token refresh if required.

## 7. Protected Routes

- Middleware or server-side guards to restrict access to authenticated users.
- Role-based access control for admin/user roles.

## 8. Edge Cases

- Handle expired tokens, revoked access, and error states gracefully.

---

These flows will guide the implementation of Better Auth in the Next.js app.
