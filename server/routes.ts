import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPortfolioSchema, insertSuitabilityRuleSchema, insertMonitoringFieldSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current user (hardcoded for demo)
  app.get("/api/user", async (req, res) => {
    try {
      const users = Array.from((storage as any).users.values());
      const user = users[0]; // Get first user for demo
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Portfolio routes
  app.get("/api/portfolios", async (req, res) => {
    try {
      const users = Array.from((storage as any).users.values());
      const userId = users[0]?.id;
      if (!userId) {
        return res.status(404).json({ message: "User not found" });
      }
      const portfolios = await storage.getPortfoliosByUserId(userId);
      res.json(portfolios);
    } catch (error) {
      res.status(500).json({ message: "Failed to get portfolios" });
    }
  });

  app.post("/api/portfolios", async (req, res) => {
    try {
      const validatedData = insertPortfolioSchema.parse(req.body);
      const portfolio = await storage.createPortfolio(validatedData);
      res.json(portfolio);
    } catch (error) {
      res.status(400).json({ message: "Invalid portfolio data" });
    }
  });

  // Goals routes
  app.get("/api/goals", async (req, res) => {
    try {
      const users = Array.from((storage as any).users.values());
      const userId = users[0]?.id;
      if (!userId) {
        return res.status(404).json({ message: "User not found" });
      }
      const goals = await storage.getGoalsByUserId(userId);
      res.json(goals[0] || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to get goals" });
    }
  });

  // ATRQ routes
  app.get("/api/atrq", async (req, res) => {
    try {
      const users = Array.from((storage as any).users.values());
      const userId = users[0]?.id;
      if (!userId) {
        return res.status(404).json({ message: "User not found" });
      }
      const atrq = await storage.getAtrqResultByUserId(userId);
      res.json(atrq || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to get ATRQ results" });
    }
  });

  // Suitability Rules routes
  app.get("/api/suitability-rules", async (req, res) => {
    try {
      const users = Array.from((storage as any).users.values());
      const userId = users[0]?.id;
      if (!userId) {
        return res.status(404).json({ message: "User not found" });
      }
      const rules = await storage.getSuitabilityRulesByUserId(userId);
      res.json(rules);
    } catch (error) {
      res.status(500).json({ message: "Failed to get suitability rules" });
    }
  });

  app.post("/api/suitability-rules", async (req, res) => {
    try {
      const validatedData = insertSuitabilityRuleSchema.parse(req.body);
      const rule = await storage.createSuitabilityRule(validatedData);
      res.json(rule);
    } catch (error) {
      res.status(400).json({ message: "Invalid rule data" });
    }
  });

  app.put("/api/suitability-rules/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const rule = await storage.updateSuitabilityRule(id, updates);
      if (!rule) {
        return res.status(404).json({ message: "Rule not found" });
      }
      res.json(rule);
    } catch (error) {
      res.status(400).json({ message: "Failed to update rule" });
    }
  });

  app.delete("/api/suitability-rules/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteSuitabilityRule(id);
      if (!success) {
        return res.status(404).json({ message: "Rule not found" });
      }
      res.json({ message: "Rule deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete rule" });
    }
  });

  // Monitoring Fields routes
  app.get("/api/monitoring-fields", async (req, res) => {
    try {
      const users = Array.from((storage as any).users.values());
      const userId = users[0]?.id;
      if (!userId) {
        return res.status(404).json({ message: "User not found" });
      }
      const fields = await storage.getMonitoringFieldsByUserId(userId);
      res.json(fields);
    } catch (error) {
      res.status(500).json({ message: "Failed to get monitoring fields" });
    }
  });

  app.post("/api/monitoring-fields", async (req, res) => {
    try {
      const validatedData = insertMonitoringFieldSchema.parse(req.body);
      const field = await storage.createMonitoringField(validatedData);
      res.json(field);
    } catch (error) {
      res.status(400).json({ message: "Invalid field data" });
    }
  });

  app.put("/api/monitoring-fields/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const field = await storage.updateMonitoringField(id, updates);
      if (!field) {
        return res.status(404).json({ message: "Field not found" });
      }
      res.json(field);
    } catch (error) {
      res.status(400).json({ message: "Failed to update field" });
    }
  });

  app.delete("/api/monitoring-fields/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteMonitoringField(id);
      if (!success) {
        return res.status(404).json({ message: "Field not found" });
      }
      res.json({ message: "Field deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete field" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
