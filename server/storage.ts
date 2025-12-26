import { 
  users, type User, type InsertUser,
  sessions, type Session, type InsertSession,
  messages, type Message, type InsertMessage,
  therapyNotes, type TherapyNote, type InsertTherapyNote,
  quotes, type Quote, type InsertQuote, type QuoteCategory,
  journalingPrompts, type JournalingPrompt, type InsertJournalingPrompt, type JournalingPromptCategory,
  customTherapists, type CustomTherapist, type InsertCustomTherapist
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
  // Session operations
  getSession(id: string): Promise<Session | undefined>;
  getUserSessions(userId: number): Promise<Session[]>;
  createSession(session: InsertSession): Promise<Session>;
  updateSession(id: string, updates: Partial<InsertSession>): Promise<Session | undefined>;
  
  // Message operations
  getSessionMessages(sessionId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  updateMessage(id: number, updates: Partial<InsertMessage>): Promise<Message | undefined>;

  // Therapy Notes operations
  getSessionNotes(sessionId: string): Promise<TherapyNote[]>;
  createTherapyNote(note: InsertTherapyNote): Promise<TherapyNote>;
  
  // Quote operations
  getUserQuotes(userId: number): Promise<Quote[]>;
  getQuotesByCategory(category: QuoteCategory): Promise<Quote[]>;
  getDailyQuote(userId: number): Promise<Quote | undefined>;
  createQuote(quote: InsertQuote): Promise<Quote>;
  updateQuote(id: number, updates: Partial<InsertQuote>): Promise<Quote | undefined>;
  favoriteQuote(id: number, favorited: boolean): Promise<Quote | undefined>;

  // Journaling Prompt operations
  getUserJournalingPrompts(userId: number, limit?: number): Promise<JournalingPrompt[]>;
  getJournalingPromptsByCategory(category: JournalingPromptCategory): Promise<JournalingPrompt[]>;
  getDailyJournalingPrompt(userId: number, category?: JournalingPromptCategory): Promise<JournalingPrompt | undefined>;
  createJournalingPrompt(prompt: InsertJournalingPrompt): Promise<JournalingPrompt>;
  updateJournalingPrompt(id: number, updates: Partial<InsertJournalingPrompt>): Promise<JournalingPrompt | undefined>;
  markJournalingPromptAsUsed(id: number): Promise<JournalingPrompt | undefined>;
  
  // Custom Therapist operations
  getUserCustomTherapists(userId: number): Promise<CustomTherapist[]>;
  getCustomTherapist(id: number): Promise<CustomTherapist | undefined>;
  createCustomTherapist(therapist: InsertCustomTherapist): Promise<CustomTherapist>;
  updateCustomTherapist(id: number, updates: Partial<InsertCustomTherapist>): Promise<CustomTherapist | undefined>;
  deleteCustomTherapist(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }
  
  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  // Session operations
  async getSession(id: string): Promise<Session | undefined> {
    const [session] = await db.select().from(sessions).where(eq(sessions.id, id));
    return session;
  }

  async getUserSessions(userId: number): Promise<Session[]> {
    return db
      .select()
      .from(sessions)
      .where(eq(sessions.userId, userId))
      .orderBy(desc(sessions.lastActivity));
  }

  async createSession(session: InsertSession): Promise<Session> {
    const [newSession] = await db
      .insert(sessions)
      .values(session)
      .returning();
    return newSession;
  }

  async updateSession(id: string, updates: Partial<InsertSession>): Promise<Session | undefined> {
    const [updatedSession] = await db
      .update(sessions)
      .set(updates)
      .where(eq(sessions.id, id))
      .returning();
    return updatedSession;
  }

  // Message operations
  async getSessionMessages(sessionId: string): Promise<Message[]> {
    return db
      .select()
      .from(messages)
      .where(eq(messages.sessionId, sessionId))
      .orderBy(messages.timestamp);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    // Update session lastActivity when creating a message
    if (message.sessionId) {
      await db
        .update(sessions)
        .set({ lastActivity: new Date() })
        .where(eq(sessions.id, message.sessionId));
    }

    const [newMessage] = await db
      .insert(messages)
      .values(message)
      .returning();
    return newMessage;
  }

  async updateMessage(id: number, updates: Partial<InsertMessage>): Promise<Message | undefined> {
    const [updatedMessage] = await db
      .update(messages)
      .set(updates)
      .where(eq(messages.id, id))
      .returning();
    return updatedMessage;
  }

  // Therapy Notes operations
  async getSessionNotes(sessionId: string): Promise<TherapyNote[]> {
    return db
      .select()
      .from(therapyNotes)
      .where(eq(therapyNotes.sessionId, sessionId))
      .orderBy(therapyNotes.timestamp);
  }

  async createTherapyNote(note: InsertTherapyNote): Promise<TherapyNote> {
    const [newNote] = await db
      .insert(therapyNotes)
      .values(note)
      .returning();
    return newNote;
  }

  // Quote operations
  async getUserQuotes(userId: number): Promise<Quote[]> {
    return db
      .select()
      .from(quotes)
      .where(eq(quotes.userId, userId))
      .orderBy(desc(quotes.createdAt));
  }

  async getQuotesByCategory(category: QuoteCategory): Promise<Quote[]> {
    return db
      .select()
      .from(quotes)
      .where(eq(quotes.category, category))
      .orderBy(desc(quotes.createdAt));
  }

  async getDailyQuote(userId: number): Promise<Quote | undefined> {
    // 直接获取最近的引言，不考虑日期
    const [recentQuote] = await db
      .select()
      .from(quotes)
      .where(eq(quotes.userId, userId))
      .orderBy(desc(quotes.createdAt))
      .limit(1);
    
    // 如果有收藏的引言，可以优先返回收藏的
    if (!recentQuote) {
      const [favoritedQuote] = await db
        .select()
        .from(quotes)
        .where(and(
          eq(quotes.userId, userId),
          eq(quotes.favorited, true)
        ))
        .orderBy(desc(quotes.createdAt))
        .limit(1);
      
      if (favoritedQuote) {
        return favoritedQuote;
      }
    }
    
    return recentQuote;
  }

  async createQuote(quote: InsertQuote): Promise<Quote> {
    const [newQuote] = await db
      .insert(quotes)
      .values({
        ...quote,
        displayedAt: new Date() // Mark as displayed now
      })
      .returning();
    return newQuote;
  }

  async updateQuote(id: number, updates: Partial<InsertQuote>): Promise<Quote | undefined> {
    const [updatedQuote] = await db
      .update(quotes)
      .set(updates)
      .where(eq(quotes.id, id))
      .returning();
    return updatedQuote;
  }

  async favoriteQuote(id: number, favorited: boolean): Promise<Quote | undefined> {
    const [updatedQuote] = await db
      .update(quotes)
      .set({ favorited })
      .where(eq(quotes.id, id))
      .returning();
    return updatedQuote;
  }

  // Journaling Prompt operations
  async getUserJournalingPrompts(userId: number, limit: number = 10): Promise<JournalingPrompt[]> {
    return db
      .select()
      .from(journalingPrompts)
      .where(eq(journalingPrompts.userId, userId))
      .orderBy(desc(journalingPrompts.createdAt))
      .limit(limit);
  }

  async getJournalingPromptsByCategory(category: JournalingPromptCategory): Promise<JournalingPrompt[]> {
    return db
      .select()
      .from(journalingPrompts)
      .where(eq(journalingPrompts.category, category))
      .orderBy(desc(journalingPrompts.createdAt));
  }

  async getDailyJournalingPrompt(userId: number, category?: JournalingPromptCategory): Promise<JournalingPrompt | undefined> {
    // 直接获取最近的提示，不管是否已使用
    const whereClause = category 
      ? and(eq(journalingPrompts.userId, userId), eq(journalingPrompts.category, category))
      : eq(journalingPrompts.userId, userId);
    
    // 首先尝试获取未使用的提示
    const [unusedPrompt] = await db
      .select()
      .from(journalingPrompts)
      .where(and(whereClause, eq(journalingPrompts.usedAt as any, null)))
      .orderBy(desc(journalingPrompts.createdAt))
      .limit(1);
    
    if (unusedPrompt) {
      return unusedPrompt;
    }
    
    // 如果所有提示都已使用，获取最近的一个
    const [recentPrompt] = await db
      .select()
      .from(journalingPrompts)
      .where(whereClause)
      .orderBy(desc(journalingPrompts.createdAt))
      .limit(1);
    
    return recentPrompt;
  }

  async createJournalingPrompt(prompt: InsertJournalingPrompt): Promise<JournalingPrompt> {
    const [newPrompt] = await db
      .insert(journalingPrompts)
      .values(prompt)
      .returning();
    return newPrompt;
  }

  async updateJournalingPrompt(id: number, updates: Partial<InsertJournalingPrompt>): Promise<JournalingPrompt | undefined> {
    const [updatedPrompt] = await db
      .update(journalingPrompts)
      .set(updates)
      .where(eq(journalingPrompts.id, id))
      .returning();
    return updatedPrompt;
  }

  async markJournalingPromptAsUsed(id: number): Promise<JournalingPrompt | undefined> {
    const [updatedPrompt] = await db
      .update(journalingPrompts)
      .set({ usedAt: new Date() })
      .where(eq(journalingPrompts.id, id))
      .returning();
    return updatedPrompt;
  }

  // Custom Therapist operations
  async getUserCustomTherapists(userId: number): Promise<CustomTherapist[]> {
    return db
      .select()
      .from(customTherapists)
      .where(eq(customTherapists.userId, userId))
      .orderBy(desc(customTherapists.createdAt));
  }

  async getCustomTherapist(id: number): Promise<CustomTherapist | undefined> {
    const [therapist] = await db
      .select()
      .from(customTherapists)
      .where(eq(customTherapists.id, id));
    return therapist;
  }

  async createCustomTherapist(therapist: InsertCustomTherapist): Promise<CustomTherapist> {
    // 确保个性特质值不为null
    const personalityTraits = {
      rationalEmotional: therapist.rationalEmotional !== undefined ? therapist.rationalEmotional : 50,
      friendlyStrict: therapist.friendlyStrict !== undefined ? therapist.friendlyStrict : 50,
      practicalCreative: therapist.practicalCreative !== undefined ? therapist.practicalCreative : 50,
      directIndirect: therapist.directIndirect !== undefined ? therapist.directIndirect : 50,
    };
    
    console.log("Creating therapist with explicitly set personality traits:", personalityTraits);
    
    // 确保所有translations字段都是字符串
    const cleanedTherapist = { ...therapist };
    
    // 确保所有translations字段都是正确的格式
    // 注意：从therapistTranslation.ts修改后，我们不再需要在这里进行转换
    // 翻译对象现在直接以对象形式传入，数据库会自动处理
    // 以下代码被保留用于兼容处理
    
    const [newTherapist] = await db
      .insert(customTherapists)
      .values({
        ...cleanedTherapist,
        ...personalityTraits,
        modifiedAt: new Date()
      })
      .returning();
    return newTherapist;
  }

  async updateCustomTherapist(id: number, updates: Partial<InsertCustomTherapist>): Promise<CustomTherapist | undefined> {
    try {
      console.log(`开始更新治疗师 ID: ${id}，更新数据:`, JSON.stringify(updates, null, 2));
      
      // 获取现有治疗师数据
      const existingTherapist = await this.getCustomTherapist(id);
      if (!existingTherapist) {
        console.error(`未找到治疗师 ID: ${id}`);
        return undefined;
      }
      
      console.log(`找到现有治疗师:`, JSON.stringify({
        id: existingTherapist.id,
        name: existingTherapist.name,
        existingTraits: {
          rationalEmotional: existingTherapist.rationalEmotional,
          friendlyStrict: existingTherapist.friendlyStrict,
          practicalCreative: existingTherapist.practicalCreative,
          directIndirect: existingTherapist.directIndirect,
        }
      }, null, 2));
      
      // 确保个性特质值不为null，使用现有值作为默认值（如果存在）
      const personalityTraits = {
        rationalEmotional: updates.rationalEmotional !== undefined ? 
          Number(updates.rationalEmotional) : 
          (existingTherapist.rationalEmotional !== null ? existingTherapist.rationalEmotional : 50),
        
        friendlyStrict: updates.friendlyStrict !== undefined ? 
          Number(updates.friendlyStrict) : 
          (existingTherapist.friendlyStrict !== null ? existingTherapist.friendlyStrict : 50),
        
        practicalCreative: updates.practicalCreative !== undefined ? 
          Number(updates.practicalCreative) : 
          (existingTherapist.practicalCreative !== null ? existingTherapist.practicalCreative : 50),
        
        directIndirect: updates.directIndirect !== undefined ? 
          Number(updates.directIndirect) : 
          (existingTherapist.directIndirect !== null ? existingTherapist.directIndirect : 50),
      };
      
      console.log("最终使用的个性特质值:", personalityTraits);
      
      // 移除任何值为undefined的字段，避免覆盖现有数据
      const cleanedUpdates: Record<string, any> = { ...updates };
      Object.keys(cleanedUpdates).forEach(key => {
        if (cleanedUpdates[key] === undefined) {
          delete cleanedUpdates[key];
        }
      });
      
      console.log("清理后的更新数据:", cleanedUpdates);
      
      // 最终更新数据，合并清理后的更新和个性特质
      const finalUpdateData = {
        ...cleanedUpdates,
        ...personalityTraits,
        modifiedAt: new Date()
      };
      
      console.log("最终更新数据:", finalUpdateData);
      
      const [updatedTherapist] = await db
        .update(customTherapists)
        .set(finalUpdateData)
        .where(eq(customTherapists.id, id))
        .returning();
      
      console.log("数据库更新成功，返回的数据:", updatedTherapist ? JSON.stringify({
        id: updatedTherapist.id,
        name: updatedTherapist.name,
        updatedTraits: {
          rationalEmotional: updatedTherapist.rationalEmotional,
          friendlyStrict: updatedTherapist.friendlyStrict,
          practicalCreative: updatedTherapist.practicalCreative,
          directIndirect: updatedTherapist.directIndirect,
        }
      }, null, 2) : "无");
      
      return updatedTherapist;
    } catch (error) {
      console.error(`更新治疗师时出错 ID: ${id}:`, error);
      return undefined;
    }
  }

  async deleteCustomTherapist(id: number): Promise<boolean> {
    try {
      console.log(`Attempting to delete custom therapist with ID: ${id}`);
      
      // 直接使用 delete 方法而不使用 returning
      await db.delete(customTherapists).where(eq(customTherapists.id, id));
      
      // 验证删除是否成功
      const existingTherapist = await this.getCustomTherapist(id);
      const deleted = existingTherapist === undefined;
      
      console.log(`Custom therapist deletion result: ${deleted ? 'Successful' : 'Failed'}`);
      return deleted;
    } catch (error) {
      console.error("Error deleting custom therapist:", error);
      return false;
    }
  }
}

export const storage = new DatabaseStorage();
