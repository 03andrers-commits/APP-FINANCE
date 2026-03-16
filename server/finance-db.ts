import { eq, and, gt } from "drizzle-orm";
import { getDb } from "./db";
import {
  creditCards,
  transactions,
  familyMembers,
  syncMetadata,
  InsertCreditCard,
  InsertTransaction,
  InsertFamilyMember,
  InsertSyncMetadata,
  CreditCard,
  Transaction,
  FamilyMember,
} from "../drizzle/schema";

/**
 * Family Members Operations
 */

export async function getFamilyMembers(userId: number): Promise<FamilyMember[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(familyMembers).where(eq(familyMembers.userId, userId));
  } catch (error) {
    console.error("[DB] Error getting family members:", error);
    return [];
  }
}

export async function upsertFamilyMember(data: InsertFamilyMember): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    await db
      .insert(familyMembers)
      .values(data)
      .onDuplicateKeyUpdate({
        set: {
          name: data.name,
          color: data.color,
          updatedAt: new Date(),
        },
      });
  } catch (error) {
    console.error("[DB] Error upserting family member:", error);
    throw error;
  }
}

/**
 * Credit Cards Operations
 */

export async function getCreditCards(userId: number): Promise<CreditCard[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(creditCards).where(eq(creditCards.userId, userId));
  } catch (error) {
    console.error("[DB] Error getting credit cards:", error);
    return [];
  }
}

export async function createCreditCard(data: InsertCreditCard): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    await db.insert(creditCards).values(data);
    return data.id;
  } catch (error) {
    console.error("[DB] Error creating credit card:", error);
    throw error;
  }
}

export async function updateCreditCard(
  cardId: string,
  data: Partial<InsertCreditCard>
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    await db
      .update(creditCards)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(creditCards.id, cardId));
  } catch (error) {
    console.error("[DB] Error updating credit card:", error);
    throw error;
  }
}

export async function deleteCreditCard(cardId: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    await db.delete(creditCards).where(eq(creditCards.id, cardId));
  } catch (error) {
    console.error("[DB] Error deleting credit card:", error);
    throw error;
  }
}

/**
 * Transactions Operations
 */

export async function getTransactions(userId: number): Promise<Transaction[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(transactions).where(eq(transactions.userId, userId));
  } catch (error) {
    console.error("[DB] Error getting transactions:", error);
    return [];
  }
}

export async function getTransactionsByCard(cardId: string): Promise<Transaction[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(transactions).where(eq(transactions.cardId, cardId));
  } catch (error) {
    console.error("[DB] Error getting transactions by card:", error);
    return [];
  }
}

export async function createTransaction(data: InsertTransaction): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    await db.insert(transactions).values(data);
    return data.id;
  } catch (error) {
    console.error("[DB] Error creating transaction:", error);
    throw error;
  }
}

export async function updateTransaction(
  transactionId: string,
  data: Partial<InsertTransaction>
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    await db
      .update(transactions)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(transactions.id, transactionId));
  } catch (error) {
    console.error("[DB] Error updating transaction:", error);
    throw error;
  }
}

export async function deleteTransaction(transactionId: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    await db.delete(transactions).where(eq(transactions.id, transactionId));
  } catch (error) {
    console.error("[DB] Error deleting transaction:", error);
    throw error;
  }
}

/**
 * Sync Metadata Operations
 */

export async function recordSync(data: InsertSyncMetadata): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    await db
      .insert(syncMetadata)
      .values(data)
      .onDuplicateKeyUpdate({
        set: {
          lastSyncedAt: new Date(),
          lastModifiedAt: data.lastModifiedAt,
        },
      });
  } catch (error) {
    console.error("[DB] Error recording sync:", error);
    throw error;
  }
}

export async function getLastSyncTime(
  userId: number,
  entityType: "card" | "transaction" | "member"
): Promise<Date | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(syncMetadata)
      .where(and(eq(syncMetadata.userId, userId), eq(syncMetadata.entityType, entityType)))
      .orderBy(syncMetadata.lastSyncedAt)
      .limit(1);

    return result.length > 0 ? result[0].lastSyncedAt : null;
  } catch (error) {
    console.error("[DB] Error getting last sync time:", error);
    return null;
  }
}

/**
 * Get changes since last sync
 */
export async function getChangedCards(userId: number, since: Date): Promise<CreditCard[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(creditCards)
      .where(and(eq(creditCards.userId, userId), gt(creditCards.updatedAt, since)));
  } catch (error) {
    console.error("[DB] Error getting changed cards:", error);
    return [];
  }
}

export async function getChangedTransactions(userId: number, since: Date): Promise<Transaction[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(transactions)
      .where(and(eq(transactions.userId, userId), gt(transactions.updatedAt, since)));
  } catch (error) {
    console.error("[DB] Error getting changed transactions:", error);
    return [];
  }
}

export async function getChangedMembers(userId: number, since: Date): Promise<FamilyMember[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(familyMembers)
      .where(and(eq(familyMembers.userId, userId), gt(familyMembers.updatedAt, since)));
  } catch (error) {
    console.error("[DB] Error getting changed members:", error);
    return [];
  }
}
