import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

export const mainInfoTable = pgTable('main_info', {
  id: serial('id').primaryKey(),
  siteName: varchar('site_name', { length: 255 }).notNull(),
  siteDescription: text('site_description').notNull(),
  openGraphImage: text('open_graph_image').notNull(),
  heroEpithets: text('hero_epithets').array().notNull(),
  heroGreeting: text('hero_greeting').notNull(),
  aboutHero: text('about_hero').notNull(),
  phone: varchar('phone', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
});
export type SelectMainInfo = typeof mainInfoTable.$inferSelect;
