import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, jsonb, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
});

export const portfolios = pgTable("portfolios", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  value: decimal("value", { precision: 15, scale: 2 }).notNull(),
  performance: decimal("performance", { precision: 5, scale: 2 }).notNull(),
  riskLevel: text("risk_level").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const goals = pgTable("goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  totalAssets: decimal("total_assets", { precision: 15, scale: 2 }).notNull(),
  targetProgress: decimal("target_progress", { precision: 5, scale: 2 }).notNull(),
  monthlyIncome: decimal("monthly_income", { precision: 15, scale: 2 }).notNull(),
  riskScore: decimal("risk_score", { precision: 3, scale: 1 }).notNull(),
  assetsChange: decimal("assets_change", { precision: 5, scale: 2 }).notNull(),
  incomeChange: decimal("income_change", { precision: 5, scale: 2 }).notNull(),
});

export const atrqResults = pgTable("atrq_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  overallScore: decimal("overall_score", { precision: 3, scale: 1 }).notNull(),
  riskProfile: text("risk_profile").notNull(),
  timeHorizon: decimal("time_horizon", { precision: 3, scale: 1 }).notNull(),
  financialCapacity: decimal("financial_capacity", { precision: 3, scale: 1 }).notNull(),
  lossTolerance: decimal("loss_tolerance", { precision: 3, scale: 1 }).notNull(),
  riskExperience: decimal("risk_experience", { precision: 3, scale: 1 }).notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const suitabilityRules = pgTable("suitability_rules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  name: text("name").notNull(),
  isActive: boolean("is_active").default(true),
  conditions: jsonb("conditions").notNull(),
  actions: jsonb("actions").notNull(),
});

export const monitoringFields = pgTable("monitoring_fields", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  fieldName: text("field_name").notNull(),
  isEnabled: boolean("is_enabled").default(true),
  threshold: decimal("threshold", { precision: 10, scale: 2 }),
  alertLevel: text("alert_level").notNull(),
});

export const portfolioBreaches = pgTable("portfolio_breaches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  portfolioId: varchar("portfolio_id").notNull(),
  monitoringFieldId: varchar("monitoring_field_id").notNull(),
  breachCondition: text("breach_condition").notNull(),
  breachValue: decimal("breach_value", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("Pending"), // "Accept and change", "Accept without change", "Reject", "Pending"
  detectedAt: timestamp("detected_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
});

export const insertPortfolioSchema = createInsertSchema(portfolios).omit({
  id: true,
  lastUpdated: true,
});

export const insertGoalSchema = createInsertSchema(goals).omit({
  id: true,
});

export const insertAtrqResultSchema = createInsertSchema(atrqResults).omit({
  id: true,
  lastUpdated: true,
});

export const insertSuitabilityRuleSchema = createInsertSchema(suitabilityRules).omit({
  id: true,
});

export const insertMonitoringFieldSchema = createInsertSchema(monitoringFields).omit({
  id: true,
});

export const insertPortfolioBreachSchema = createInsertSchema(portfolioBreaches).omit({
  id: true,
  detectedAt: true,
  resolvedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Portfolio = typeof portfolios.$inferSelect;
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;
export type Goal = typeof goals.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type AtrqResult = typeof atrqResults.$inferSelect;
export type InsertAtrqResult = z.infer<typeof insertAtrqResultSchema>;
export type SuitabilityRule = typeof suitabilityRules.$inferSelect;
export type InsertSuitabilityRule = z.infer<typeof insertSuitabilityRuleSchema>;
export type MonitoringField = typeof monitoringFields.$inferSelect;
export type InsertMonitoringField = z.infer<typeof insertMonitoringFieldSchema>;
export type PortfolioBreach = typeof portfolioBreaches.$inferSelect;
export type InsertPortfolioBreach = z.infer<typeof insertPortfolioBreachSchema>;
