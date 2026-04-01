import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const navItemsTable = pgTable("nav_items", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  href: text("href").notNull(),
  section: text("section").notNull(),
  position: integer("position").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  openInNewTab: boolean("open_in_new_tab").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertNavItemSchema = createInsertSchema(navItemsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertNavItem = z.infer<typeof insertNavItemSchema>;
export type NavItem = typeof navItemsTable.$inferSelect;
