import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const obfuscationsTable = pgTable("obfuscations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertObfuscationSchema = createInsertSchema(obfuscationsTable).omit({ id: true, createdAt: true });
export type InsertObfuscation = z.infer<typeof insertObfuscationSchema>;
export type Obfuscation = typeof obfuscationsTable.$inferSelect;
