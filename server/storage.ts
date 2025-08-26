import { 
  type User, 
  type InsertUser, 
  type Portfolio, 
  type InsertPortfolio,
  type Goal,
  type InsertGoal,
  type AtrqResult,
  type InsertAtrqResult,
  type SuitabilityRule,
  type InsertSuitabilityRule,
  type MonitoringField,
  type InsertMonitoringField,
  type PortfolioBreach,
  type InsertPortfolioBreach
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Portfolio methods
  getPortfoliosByUserId(userId: string): Promise<Portfolio[]>;
  getPortfolio(id: string): Promise<Portfolio | undefined>;
  createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  updatePortfolio(id: string, updates: Partial<InsertPortfolio>): Promise<Portfolio | undefined>;
  deletePortfolio(id: string): Promise<boolean>;
  
  // Goal methods
  getGoalsByUserId(userId: string): Promise<Goal[]>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  updateGoal(userId: string, updates: Partial<InsertGoal>): Promise<Goal | undefined>;
  
  // ATRQ methods
  getAtrqResultByUserId(userId: string): Promise<AtrqResult | undefined>;
  createAtrqResult(atrq: InsertAtrqResult): Promise<AtrqResult>;
  updateAtrqResult(userId: string, updates: Partial<InsertAtrqResult>): Promise<AtrqResult | undefined>;
  
  // Suitability Rule methods
  getSuitabilityRulesByUserId(userId: string): Promise<SuitabilityRule[]>;
  createSuitabilityRule(rule: InsertSuitabilityRule): Promise<SuitabilityRule>;
  updateSuitabilityRule(id: string, updates: Partial<InsertSuitabilityRule>): Promise<SuitabilityRule | undefined>;
  deleteSuitabilityRule(id: string): Promise<boolean>;
  
  // Monitoring Field methods
  getMonitoringFieldsByUserId(userId: string): Promise<MonitoringField[]>;
  createMonitoringField(field: InsertMonitoringField): Promise<MonitoringField>;
  updateMonitoringField(id: string, updates: Partial<InsertMonitoringField>): Promise<MonitoringField | undefined>;
  deleteMonitoringField(id: string): Promise<boolean>;
  
  // Portfolio Breach methods
  getPortfolioBreachesByUserId(userId: string): Promise<PortfolioBreach[]>;
  createPortfolioBreach(breach: InsertPortfolioBreach): Promise<PortfolioBreach>;
  updatePortfolioBreach(id: string, updates: Partial<InsertPortfolioBreach>): Promise<PortfolioBreach | undefined>;
  deletePortfolioBreach(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private portfolios: Map<string, Portfolio>;
  private goals: Map<string, Goal>;
  private atrqResults: Map<string, AtrqResult>;
  private suitabilityRules: Map<string, SuitabilityRule>;
  private monitoringFields: Map<string, MonitoringField>;
  private portfolioBreaches: Map<string, PortfolioBreach>;

  constructor() {
    this.users = new Map();
    this.portfolios = new Map();
    this.goals = new Map();
    this.atrqResults = new Map();
    this.suitabilityRules = new Map();
    this.monitoringFields = new Map();
    this.portfolioBreaches = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample user
    const userId = randomUUID();
    const user: User = {
      id: userId,
      username: "john.smith",
      password: "password",
      name: "John Smith"
    };
    this.users.set(userId, user);

    // Create sample goals
    const goal: Goal = {
      id: randomUUID(),
      userId,
      totalAssets: "2450000.00",
      targetProgress: "87.3",
      monthlyIncome: "18750.00",
      riskScore: "6.8",
      assetsChange: "12.5",
      incomeChange: "3.2"
    };
    this.goals.set(userId, goal);

    // Create sample ATRQ result
    const atrq: AtrqResult = {
      id: randomUUID(),
      userId,
      overallScore: "6.8",
      riskProfile: "Moderate",
      timeHorizon: "8.2",
      financialCapacity: "7.1",
      lossTolerance: "5.9",
      riskExperience: "6.3",
      lastUpdated: new Date()
    };
    this.atrqResults.set(userId, atrq);

    // Create sample portfolios
    const portfolios = [
      {
        id: randomUUID(),
        userId,
        name: "Conservative Growth Fund",
        type: "Mutual Fund",
        value: "450200.00",
        performance: "8.7",
        riskLevel: "Medium",
        lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        id: randomUUID(),
        userId,
        name: "Aggressive Growth Portfolio",
        type: "ETF Portfolio",
        value: "1250800.00",
        performance: "15.2",
        riskLevel: "High",
        lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
      },
      {
        id: randomUUID(),
        userId,
        name: "Balanced Income Fund",
        type: "Bond Fund",
        value: "750500.00",
        performance: "4.1",
        riskLevel: "Low",
        lastUpdated: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
      }
    ];

    portfolios.forEach(portfolio => {
      this.portfolios.set(portfolio.id, portfolio);
    });

    // Create sample monitoring fields
    const fields = [
      {
        id: randomUUID(),
        userId,
        fieldName: "Portfolio Allocation Drift",
        isEnabled: true,
        threshold: "5.0",
        alertLevel: "Warning"
      },
      {
        id: randomUUID(),
        userId,
        fieldName: "Risk Profile Mismatch",
        isEnabled: true,
        threshold: "1.5",
        alertLevel: "Critical"
      },
      {
        id: randomUUID(),
        userId,
        fieldName: "Concentration Risk",
        isEnabled: false,
        threshold: "20.0",
        alertLevel: "Warning"
      }
    ];

    fields.forEach(field => {
      this.monitoringFields.set(field.id, field);
    });

    // Create sample suitability rules
    const rules = [
      {
        id: randomUUID(),
        userId,
        name: "Rule #1",
        isActive: true,
        conditions: {
          "Portfolio Allocation Drift": { operator: ">", value: 5 },
          "Risk Score Mismatch": { operator: ">", value: 1.5 }
        },
        actions: { alertLevel: "Warning", message: "Generate Warning Alert" }
      },
      {
        id: randomUUID(),
        userId,
        name: "Rule #2",
        isActive: false,
        conditions: {
          "Concentration Risk": { operator: ">", value: 20 }
        },
        actions: { alertLevel: "Critical", message: "Generate Critical Alert" }
      }
    ];

    rules.forEach(rule => {
      this.suitabilityRules.set(rule.id, rule);
    });

    // Create sample portfolio breaches
    const breaches = [
      {
        id: randomUUID(),
        portfolioId: portfolios[0].id, // Conservative Growth Fund
        monitoringFieldId: fields[0].id, // Portfolio Allocation Drift
        breachCondition: "Portfolio Allocation Drift > 5.0%",
        breachValue: "7.2",
        status: "Pending",
        detectedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        resolvedAt: null
      },
      {
        id: randomUUID(),
        portfolioId: portfolios[1].id, // Aggressive Growth Portfolio
        monitoringFieldId: fields[1].id, // Risk Profile Mismatch
        breachCondition: "Risk Score Mismatch > 1.5",
        breachValue: "2.1",
        status: "Accept and change",
        detectedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        resolvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: randomUUID(),
        portfolioId: portfolios[2].id, // Balanced Income Fund
        monitoringFieldId: fields[2].id, // Concentration Risk
        breachCondition: "Concentration Risk > 20.0%",
        breachValue: "25.8",
        status: "Reject",
        detectedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        resolvedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      }
    ];

    breaches.forEach(breach => {
      this.portfolioBreaches.set(breach.id, breach);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getPortfoliosByUserId(userId: string): Promise<Portfolio[]> {
    return Array.from(this.portfolios.values()).filter(
      portfolio => portfolio.userId === userId
    );
  }

  async getPortfolio(id: string): Promise<Portfolio | undefined> {
    return this.portfolios.get(id);
  }

  async createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio> {
    const id = randomUUID();
    const newPortfolio: Portfolio = {
      ...portfolio,
      id,
      lastUpdated: new Date()
    };
    this.portfolios.set(id, newPortfolio);
    return newPortfolio;
  }

  async updatePortfolio(id: string, updates: Partial<InsertPortfolio>): Promise<Portfolio | undefined> {
    const portfolio = this.portfolios.get(id);
    if (!portfolio) return undefined;
    
    const updated: Portfolio = {
      ...portfolio,
      ...updates,
      lastUpdated: new Date()
    };
    this.portfolios.set(id, updated);
    return updated;
  }

  async deletePortfolio(id: string): Promise<boolean> {
    return this.portfolios.delete(id);
  }

  async getGoalsByUserId(userId: string): Promise<Goal[]> {
    return Array.from(this.goals.values()).filter(
      goal => goal.userId === userId
    );
  }

  async createGoal(goal: InsertGoal): Promise<Goal> {
    const id = randomUUID();
    const newGoal: Goal = { ...goal, id };
    this.goals.set(id, newGoal);
    return newGoal;
  }

  async updateGoal(userId: string, updates: Partial<InsertGoal>): Promise<Goal | undefined> {
    const goal = Array.from(this.goals.values()).find(g => g.userId === userId);
    if (!goal) return undefined;
    
    const updated: Goal = { ...goal, ...updates };
    this.goals.set(goal.id, updated);
    return updated;
  }

  async getAtrqResultByUserId(userId: string): Promise<AtrqResult | undefined> {
    return Array.from(this.atrqResults.values()).find(
      result => result.userId === userId
    );
  }

  async createAtrqResult(atrq: InsertAtrqResult): Promise<AtrqResult> {
    const id = randomUUID();
    const result: AtrqResult = {
      ...atrq,
      id,
      lastUpdated: new Date()
    };
    this.atrqResults.set(id, result);
    return result;
  }

  async updateAtrqResult(userId: string, updates: Partial<InsertAtrqResult>): Promise<AtrqResult | undefined> {
    const result = Array.from(this.atrqResults.values()).find(r => r.userId === userId);
    if (!result) return undefined;
    
    const updated: AtrqResult = {
      ...result,
      ...updates,
      lastUpdated: new Date()
    };
    this.atrqResults.set(result.id, updated);
    return updated;
  }

  async getSuitabilityRulesByUserId(userId: string): Promise<SuitabilityRule[]> {
    return Array.from(this.suitabilityRules.values()).filter(
      rule => rule.userId === userId
    );
  }

  async createSuitabilityRule(rule: InsertSuitabilityRule): Promise<SuitabilityRule> {
    const id = randomUUID();
    const newRule: SuitabilityRule = { 
      ...rule, 
      id,
      isActive: rule.isActive ?? true
    };
    this.suitabilityRules.set(id, newRule);
    return newRule;
  }

  async updateSuitabilityRule(id: string, updates: Partial<InsertSuitabilityRule>): Promise<SuitabilityRule | undefined> {
    const rule = this.suitabilityRules.get(id);
    if (!rule) return undefined;
    
    const updated: SuitabilityRule = { ...rule, ...updates };
    this.suitabilityRules.set(id, updated);
    return updated;
  }

  async deleteSuitabilityRule(id: string): Promise<boolean> {
    return this.suitabilityRules.delete(id);
  }

  async getMonitoringFieldsByUserId(userId: string): Promise<MonitoringField[]> {
    return Array.from(this.monitoringFields.values()).filter(
      field => field.userId === userId
    );
  }

  async createMonitoringField(field: InsertMonitoringField): Promise<MonitoringField> {
    const id = randomUUID();
    const newField: MonitoringField = { 
      ...field, 
      id,
      isEnabled: field.isEnabled ?? true,
      threshold: field.threshold ?? null
    };
    this.monitoringFields.set(id, newField);
    return newField;
  }

  async updateMonitoringField(id: string, updates: Partial<InsertMonitoringField>): Promise<MonitoringField | undefined> {
    const field = this.monitoringFields.get(id);
    if (!field) return undefined;
    
    const updated: MonitoringField = { ...field, ...updates };
    this.monitoringFields.set(id, updated);
    return updated;
  }

  async deleteMonitoringField(id: string): Promise<boolean> {
    return this.monitoringFields.delete(id);
  }

  async getPortfolioBreachesByUserId(userId: string): Promise<PortfolioBreach[]> {
    // Get user's portfolios first
    const userPortfolios = Array.from(this.portfolios.values()).filter(
      portfolio => portfolio.userId === userId
    );
    const portfolioIds = userPortfolios.map(p => p.id);
    
    return Array.from(this.portfolioBreaches.values()).filter(
      breach => portfolioIds.includes(breach.portfolioId)
    );
  }

  async createPortfolioBreach(breach: InsertPortfolioBreach): Promise<PortfolioBreach> {
    const id = randomUUID();
    const newBreach: PortfolioBreach = {
      ...breach,
      id,
      detectedAt: new Date(),
      resolvedAt: null
    };
    this.portfolioBreaches.set(id, newBreach);
    return newBreach;
  }

  async updatePortfolioBreach(id: string, updates: Partial<InsertPortfolioBreach>): Promise<PortfolioBreach | undefined> {
    const breach = this.portfolioBreaches.get(id);
    if (!breach) return undefined;
    
    const updated: PortfolioBreach = {
      ...breach,
      ...updates,
      resolvedAt: updates.status && updates.status !== "Pending" ? new Date() : breach.resolvedAt
    };
    this.portfolioBreaches.set(id, updated);
    return updated;
  }

  async deletePortfolioBreach(id: string): Promise<boolean> {
    return this.portfolioBreaches.delete(id);
  }
}

export const storage = new MemStorage();
