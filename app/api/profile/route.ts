import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/database';
import { user as userTable } from '@/database/schema';
import { getServerSession } from '@/lib/betterauth/get-session';
import { eq } from 'drizzle-orm';

export async function PUT(req: NextRequest) {
  const session = await getServerSession();
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { name, image } = await req.json();
  try {
    await db
      .update(userTable)
      .set({
        name,
        image,
        updatedAt: new Date(),
      })
      .where(eq(userTable.id, session.user.id));
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
