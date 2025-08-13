'use server';
import { db } from '@/database';
import { user } from '@/database/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from '@/lib/betterauth/get-session';

export async function updateProfile({
  name,
  image,
}: {
  name: string;
  image?: string;
}) {
  const session = await getServerSession();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error('User session not found.');
  }
  return db
    .update(user)
    .set({
      name,
      image,
    })
    .where(eq(user.id, userId));
}

export async function getName(): Promise<string> {
  const session = await getServerSession();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error('User session not found.');
  }
  const result = await db
    .select({ name: user.name })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);
  return result[0]?.name ?? '';
}
