'use client';
import { UserProfileForm } from './components/user-profile-form';

export default function ProfilePage() {
  // You may want to fetch initialName and initialImage from session or db
  return (
    <div className="container mx-auto max-w-xl py-8">
      <UserProfileForm initialName="" initialImage="" />
    </div>
  );
}
