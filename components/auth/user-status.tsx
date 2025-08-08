// components/auth/user-status.tsx
'use client';

import * as React from 'react';
// import { betterAuthClient } from '@/lib/betterauth/client';

export function UserStatus() {
  // TODO: Replace with Better Auth user state
  const user = null; // Placeholder for user object

  return (
    <div className="flex items-center gap-2">
      {user ? (
        <>
          <span className="text-sm">Signed in as {user.email}</span>
          {/* <Button onClick={handleSignOut}>Sign Out</Button> */}
        </>
      ) : (
        <span className="text-muted-foreground text-sm">Not signed in</span>
      )}
    </div>
  );
}
