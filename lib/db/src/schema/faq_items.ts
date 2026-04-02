import { pgTable, serial, text, integer, boolean } from "drizzle-orm/pg-core";

export const faqItemsTable = pgTable("faq_items", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category").notNull().default("general"),
  displayOrder: integer("display_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
});

export type FaqItem = typeof faqItemsTable.$inferSelect;
