import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Family members table - stores user, spouse, and daughter
 */
export const familyMembers = mysqlTable("family_members", {
  id: varchar("id", { length: 64 }).primaryKey(), // 'user', 'spouse', 'daughter'
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  color: varchar("color", { length: 7 }).notNull(), // hex color
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FamilyMember = typeof familyMembers.$inferSelect;
export type InsertFamilyMember = typeof familyMembers.$inferInsert;

/**
 * Credit cards table - stores up to 15 cards per user
 */
export const creditCards = mysqlTable("credit_cards", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  brand: mysqlEnum("brand", ["visa", "mastercard", "elo", "amex", "other"]).notNull(),
  limit: int("limit").notNull(), // limit in cents
  lastFourDigits: varchar("lastFourDigits", { length: 4 }).notNull(),
  dueDate: int("dueDate").notNull(), // day of month (1-31)
  photoUrl: text("photoUrl"), // S3 URL for photo
  isActive: int("isActive").default(1).notNull(), // 0 or 1 for boolean
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CreditCard = typeof creditCards.$inferSelect;
export type InsertCreditCard = typeof creditCards.$inferInsert;

/**
 * Transactions table - stores purchases with installment support
 */
export const transactions = mysqlTable("transactions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: int("userId").notNull(),
  cardId: varchar("cardId", { length: 64 }).notNull(),
  memberId: varchar("memberId", { length: 64 }).notNull(), // references familyMembers.id
  amount: int("amount").notNull(), // amount in cents
  description: varchar("description", { length: 255 }).notNull(),
  category: mysqlEnum("category", [
    "food",
    "transport",
    "health",
    "entertainment",
    "shopping",
    "utilities",
    "other",
  ]).notNull(),
  installments: int("installments").default(1).notNull(), // number of installments
  currentInstallment: int("currentInstallment").default(1).notNull(), // current installment number
  date: timestamp("date").notNull(), // transaction date
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

/**
 * Sync metadata table - tracks last sync time for conflict resolution
 */
export const syncMetadata = mysqlTable("sync_metadata", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  entityType: mysqlEnum("entityType", ["card", "transaction", "member"]).notNull(),
  entityId: varchar("entityId", { length: 64 }).notNull(),
  lastSyncedAt: timestamp("lastSyncedAt").defaultNow().onUpdateNow().notNull(),
  lastModifiedAt: timestamp("lastModifiedAt").notNull(),
});

export type SyncMetadata = typeof syncMetadata.$inferSelect;
export type InsertSyncMetadata = typeof syncMetadata.$inferInsert;
