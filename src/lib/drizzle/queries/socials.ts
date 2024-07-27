import { socialsTable, type SocialsEnum } from '@/db/schema';
import { eq } from 'drizzle-orm';
import db from '../client';

export async function getSocials() {
  return await db.query.socialsTable.findMany();
}

export async function getSocialBySlug(slug: SocialsEnum) {
  return await db.query.socialsTable.findFirst({
    where: eq(socialsTable.slug, slug),
  });
}
