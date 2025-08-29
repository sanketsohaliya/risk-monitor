import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users
export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`), // UUID-like
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
});

// Portfolios
export const portfolios = sqliteTable("portfolios", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  value: real("value").notNull(),
  performance: real("performance").notNull(),
  riskLevel: text("risk_level").notNull(),
  lastUpdated: integer("last_updated", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
});

// Goals
export const goals = sqliteTable("goals", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  userId: text("user_id").notNull(),
  totalAssets: real("total_assets").notNull(),
  targetProgress: real("target_progress").notNull(),
  monthlyIncome: real("monthly_income").notNull(),
  riskScore: real("risk_score").notNull(),
  assetsChange: real("assets_change").notNull(),
  incomeChange: real("income_change").notNull(),
});

// ATRQ Results
export const atrqResults = sqliteTable("atrq_results", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  userId: text("user_id").notNull(),
  overallScore: real("overall_score").notNull(),
  riskProfile: text("risk_profile").notNull(),
  timeHorizon: real("time_horizon").notNull(),
  financialCapacity: real("financial_capacity").notNull(),
  lossTolerance: real("loss_tolerance").notNull(),
  riskExperience: real("risk_experience").notNull(),
  lastUpdated: integer("last_updated", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
});

// Suitability Rules
export const suitabilityRules = sqliteTable("suitability_rules", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  conditions: text("conditions", { mode: "json" }).notNull(),
  actions: text("actions", { mode: "json" }).notNull(),
});

// Monitoring Fields
export const monitoringFields = sqliteTable("monitoring_fields", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  userId: text("user_id").notNull(),
  fieldName: text("field_name").notNull(),
  isEnabled: integer("is_enabled", { mode: "boolean" }).default(true),
  threshold: real("threshold"),
  alertLevel: text("alert_level").notNull(),
});

// Portfolio Breaches
export const portfolioBreaches = sqliteTable("portfolio_breaches", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  portfolioId: text("portfolio_id").notNull(),
  monitoringFieldId: text("monitoring_field_id").notNull(),
  breachCondition: text("breach_condition").notNull(),
  breachValue: real("breach_value").notNull(),
  status: text("status").notNull().default("Pending"),
  detectedAt: integer("detected_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
  resolvedAt: integer("resolved_at", { mode: "timestamp" }),
});

// Zod Schemas
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

export const insertSuitabilityRuleSchema = createInsertSchema(
  suitabilityRules
).omit({
  id: true,
});

export const insertMonitoringFieldSchema = createInsertSchema(
  monitoringFields
).omit({
  id: true,
});

export const insertPortfolioBreachSchema = createInsertSchema(
  portfolioBreaches
).omit({
  id: true,
  detectedAt: true,
  resolvedAt: true,
});

// Types
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
