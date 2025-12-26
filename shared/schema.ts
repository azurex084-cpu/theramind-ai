import { pgTable, text, serial, integer, boolean, timestamp, uuid, primaryKey, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ===============================
// TABLE DEFINITIONS
// ===============================

// Quote categories for affirmations and motivational quotes
export const quoteCategories = [
  'confidence',       // 自信
  'growth',          // 成长
  'resilience',      // 韧性
  'mindfulness',     // 正念
  'gratitude',       // 感恩
  'compassion',      // 同情心
  'motivation',      // 动力
  'self_care',       // 自我关怀
  'wisdom',          // 智慧
  'healing',         // 治愈
  'inner_peace',     // 内心平静
  'self_love',       // 自爱
  'courage',         // 勇气
  'hope',            // 希望
  'strength',        // 力量
  'acceptance'       // 接纳
] as const;

export type QuoteCategory = typeof quoteCategories[number];

// Journaling prompt categories
export const journalingPromptCategories = [
  'self_reflection',
  'gratitude',
  'emotional_awareness',
  'goal_setting',
  'stress_management',
  'personal_growth'
] as const;

export type JournalingPromptCategory = typeof journalingPromptCategories[number];

// Therapy approaches that can be used for specialized AI responses
export const therapyApproaches = [
  'general',          // Default general therapeutic approach
  'cbt',              // Cognitive Behavioral Therapy
  'mindfulness',      // Mindfulness-Based Therapy
  'act',              // Acceptance and Commitment Therapy
  'psychodynamic',    // Psychodynamic Therapy
  'solution_focused', // Solution Focused Brief Therapy
  'humanistic',       // Humanistic/Person-Centered Therapy
  'motivational',     // Motivational Interviewing
  'dbt',              // Dialectical Behavior Therapy
  'tough_love'        // Traditional Asian parent-style tough love approach
] as const;

export type TherapyApproach = typeof therapyApproaches[number];

// Users schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").unique(),
  fullName: text("full_name"),
  preferredLanguage: text("preferred_language").default("en"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Chat sessions schema
export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: integer("user_id").references(() => users.id),
  name: text("name"),
  language: text("language").default("en"),
  therapyApproach: text("therapy_approach").default("general"), // Default approach is general
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastActivity: timestamp("last_activity").notNull().defaultNow(),
});

// Chat message schema
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  sessionId: uuid("session_id").notNull().references(() => sessions.id, { onDelete: 'cascade' }),
  content: text("content").notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  sentiment: text("sentiment"),
  isTranslated: boolean("is_translated").default(false),
  originalLanguage: text("original_language"),
  sourceLanguage: text("source_language"), // Language code for voice synthesis
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// Therapy notes schema for therapists
export const therapyNotes = pgTable("therapy_notes", {
  id: serial("id").primaryKey(),
  sessionId: uuid("session_id").notNull().references(() => sessions.id, { onDelete: 'cascade' }),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// Motivational quotes schema
export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  text: text("text").notNull(),
  author: text("author"),
  category: text("category").notNull().default('motivation'),
  customized: boolean("customized").default(false),
  favorited: boolean("favorited").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  displayedAt: timestamp("displayed_at"),
});

// Journaling prompts schema
export const journalingPrompts = pgTable("journaling_prompts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  text: text("text").notNull(),
  category: text("category").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  usedAt: timestamp("used_at"),
  isCustom: boolean("is_custom").default(false),
  aiGenerated: boolean("ai_generated").default(true),
});

// ===============================
// RELATIONS
// ===============================

export const userRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  quotes: many(quotes),
  journalingPrompts: many(journalingPrompts),
  customTherapists: many(customTherapists)
}));

export const sessionRelations = relations(sessions, ({ one, many }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
  messages: many(messages),
  therapyNotes: many(therapyNotes)
}));

export const messageRelations = relations(messages, ({ one }) => ({
  session: one(sessions, {
    fields: [messages.sessionId],
    references: [sessions.id],
  }),
}));

export const therapyNoteRelations = relations(therapyNotes, ({ one }) => ({
  session: one(sessions, {
    fields: [therapyNotes.sessionId],
    references: [sessions.id],
  }),
}));

export const quoteRelations = relations(quotes, ({ one }) => ({
  user: one(users, {
    fields: [quotes.userId],
    references: [users.id],
  }),
}));

export const journalingPromptRelations = relations(journalingPrompts, ({ one }) => ({
  user: one(users, {
    fields: [journalingPrompts.userId],
    references: [users.id],
  }),
}));

// Custom therapist personas schema
export const customTherapists = pgTable("custom_therapists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  approach: text("approach").notNull(),
  icon: text("icon").notNull(),
  promptPrefix: text("prompt_prefix").notNull(),
  color: text("color").notNull().default('#4299e1'),
  speakingStyle: text("speaking_style"),
  baseTherapyApproach: text("base_therapy_approach"),
  
  // 性格特质字段
  rationalEmotional: integer("rational_emotional"),  // 0-100, 理性vs情感
  friendlyStrict: integer("friendly_strict"),       // 0-100, 友好vs严格
  practicalCreative: integer("practical_creative"), // 0-100, 实用vs创意
  directIndirect: integer("direct_indirect"),       // 0-100, 直接vs委婉
  
  // 翻译字段 - 存储为JSONB对象
  nameTranslations: jsonb("name_translations"),
  titleTranslations: jsonb("title_translations"),
  descriptionTranslations: jsonb("description_translations"),
  approachTranslations: jsonb("approach_translations"),
  speakingStyleTranslations: jsonb("speaking_style_translations"),
  
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  modifiedAt: timestamp("modified_at").notNull().defaultNow(),
});

export const customTherapistRelations = relations(customTherapists, ({ one }) => ({
  user: one(users, {
    fields: [customTherapists.userId],
    references: [users.id],
  }),
}));

// ===============================
// SCHEMAS AND TYPES
// ===============================

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  preferredLanguage: true
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const insertSessionSchema = createInsertSchema(sessions).pick({
  userId: true,
  name: true,
  language: true,
  therapyApproach: true,
});

export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;

export const insertMessageSchema = createInsertSchema(messages).pick({
  sessionId: true,
  content: true,
  role: true,
  sentiment: true,
  isTranslated: true,
  originalLanguage: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export const insertTherapyNoteSchema = createInsertSchema(therapyNotes).pick({
  sessionId: true,
  content: true,
});

export type InsertTherapyNote = z.infer<typeof insertTherapyNoteSchema>;
export type TherapyNote = typeof therapyNotes.$inferSelect;

export const insertQuoteSchema = createInsertSchema(quotes).pick({
  userId: true,
  text: true,
  author: true,
  category: true,
  customized: true,
  favorited: true,
});

export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type Quote = typeof quotes.$inferSelect;

export const insertJournalingPromptSchema = createInsertSchema(journalingPrompts).pick({
  userId: true,
  text: true,
  category: true,
  isCustom: true,
  aiGenerated: true,
});

export type InsertJournalingPrompt = z.infer<typeof insertJournalingPromptSchema>;
export type JournalingPrompt = typeof journalingPrompts.$inferSelect;

export const insertCustomTherapistSchema = createInsertSchema(customTherapists)
  .pick({
    userId: true,
    name: true,
    title: true,
    description: true,
    approach: true,
    icon: true,
    promptPrefix: true,
    color: true,
    speakingStyle: true,
    isActive: true,
    rationalEmotional: true,
    friendlyStrict: true,
    practicalCreative: true,
    directIndirect: true,
  })
  .extend({
    baseTherapyApproach: z.string().optional(),
    rationalEmotional: z.number().min(0).max(100).optional(),
    friendlyStrict: z.number().min(0).max(100).optional(),
    practicalCreative: z.number().min(0).max(100).optional(),
    directIndirect: z.number().min(0).max(100).optional(),
    
    // 翻译字段 - 使用JSONB对象存储
    nameTranslations: z.record(z.string()).optional(),
    titleTranslations: z.record(z.string()).optional(), 
    descriptionTranslations: z.record(z.string()).optional(),
    approachTranslations: z.record(z.string()).optional(),
    speakingStyleTranslations: z.record(z.string()).optional(),
  });

export type InsertCustomTherapist = z.infer<typeof insertCustomTherapistSchema>;
export type CustomTherapist = typeof customTherapists.$inferSelect;

// Chat request schema for validation
export const chatRequestSchema = z.object({
  message: z.string().min(1).max(1000),
  language: z.string().default('en'),
  sessionId: z.string().uuid().nullable().optional(),
  therapistId: z.union([z.string(), z.number()]).optional().default('general'),
  therapyApproach: z.enum(therapyApproaches).optional().default('general'),
  promptPrefix: z.string().optional(),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

// Quote request schema for validation
export const quoteRequestSchema = z.object({
  userId: z.number().optional(),
  category: z.enum(quoteCategories).optional(),
  customized: z.boolean().default(true),
  sessionId: z.string().uuid().optional(),
});

export type QuoteRequest = z.infer<typeof quoteRequestSchema>;
