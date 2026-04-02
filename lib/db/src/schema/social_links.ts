import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const socialLinksTable = pgTable("social_links", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  url: text("url").notNull(),
  icon: text("icon").notNull().default("link"),
  displayOrder: integer("display_order").notNull().default(0),
});

export type SocialLink = typeof socialLinksTable.$inferSelect;
