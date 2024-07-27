import {
  pgEnum,
  pgTable,
  serial,
  text,
  varchar,
} from 'drizzle-orm/pg-core';

export const socialsEnum = pgEnum('socials_enum', [
  'vk',
  'telegram',
  'github',
  'discord',
  'hh',
]);

export const socialsTable = pgTable('socials', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255, enum: socialsEnum.enumValues })
    .notNull()
    .unique(),
  name: varchar('name', { length: 255 }).notNull(),
  url: text('url').notNull(),
  iconifyId: varchar('iconify_id', { length: 255 }).notNull(),
});

export type SelectSocial = typeof socialsTable.$inferSelect;
export type SocialsEnum = (typeof socialsEnum.enumValues)[number];
