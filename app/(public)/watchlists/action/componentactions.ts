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
  const movieIdNum = Number(movie_id);
  const id = `${userId}-${movieIdNum}`;

  // Check for duplicate
  const existing = await db
    .select()
    .from(watchlists)
    .where(eq(watchlists.id, id));
  if (existing.length > 0) {
    throw new Error('Movie already in watchlist.');
  }

  return db.insert(watchlists).values({
    id,
    name,
    description,
    movie_id: movieIdNum,
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
export async function isMovieInWatchlist(
  movie_id: string | number
): Promise<boolean> {
  const session = await getServerSession();
  const userId = session?.user?.id;
  if (!userId) return false;
  const movieIdNum = Number(movie_id);
  const id = `${userId}-${movieIdNum}`;
  const existing = await db
    .select()
    .from(watchlists)
    .where(eq(watchlists.id, id));
  return existing.length > 0;
}
export async function removeWatchlist(
  movie_id: string | number
): Promise<void> {
  const session = await getServerSession();
  const userId = session?.user?.id;
  if (!userId) throw new Error('User session not found.');
  const movieIdNum = Number(movie_id);
  const id = `${userId}-${movieIdNum}`;
  await db.delete(watchlists).where(eq(watchlists.id, id));
}
