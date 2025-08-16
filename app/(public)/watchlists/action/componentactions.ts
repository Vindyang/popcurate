'use server';

import { db } from '@/database';
import { watchlists } from '@/database/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from '@/lib/betterauth/get-session';

export async function createWatchlist({
  name,
  description,
  movie_id,
}: {
  name: string;
  description?: string;
  movie_id: string | number;
}) {
  const session = await getServerSession();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error('User session not found.');
  }
  const id = `${userId}-${movie_id}`;
  return db.insert(watchlists).values({
    id,
    name,
    description,
    user_id: userId,
    created_at: new Date(),
    updated_at: new Date(),
  });
}

export async function getWatchlists() {
  const session = await getServerSession();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error('User session not found.');
  }
  return db.select().from(watchlists).where(eq(watchlists.user_id, userId));
}

export async function fetchWatchlists() {
  const session = await getServerSession();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error('User session not found.');
  }
  const watchLists = await db
    .select()
    .from(watchlists)
    .where(eq(watchlists.user_id, userId));
  return watchLists;
}
