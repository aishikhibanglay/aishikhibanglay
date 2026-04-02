import { pgTable, serial, text, real, integer, boolean } from "drizzle-orm/pg-core";

export const aiToolsTable = pgTable("ai_tools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  company: text("company").notNull().default(""),
  badge: text("badge").notNull().default("Free"),
  rating: real("rating").notNull().default(4.0),
  description: text("description").notNull().default(""),
  websiteUrl: text("website_url").notNull().default(""),
  gradientClass: text("gradient_class").notNull().default("bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400"),
  displayOrder: integer("display_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
});

export type AiTool = typeof aiToolsTable.$inferSelect;
