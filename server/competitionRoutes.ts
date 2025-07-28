import type { Express, Request } from "express";
import { competitions, competitionEntries, competitionVotes } from "../shared/schema";
import { db } from "./db";
import { eq, desc, sql, and } from "drizzle-orm";
import crypto from "crypto";

export function registerCompetitionRoutes(app: Express) {
  // Get current active competition
  app.get("/api/competition/current", async (req, res) => {
    try {
      const [competition] = await db
        .select()
        .from(competitions)
        .where(eq(competitions.status, "active"))
        .orderBy(desc(competitions.createdAt))
        .limit(1);

      if (!competition) {
        return res.status(404).json({ message: "No active competition found" });
      }

      res.json(competition);
    } catch (error) {
      console.error("Error fetching current competition:", error);
      res.status(500).json({ message: "Failed to fetch competition" });
    }
  });

  // Get competition entries with sorting
  app.get("/api/competition/:competitionId/entries", async (req, res) => {
    try {
      const { competitionId } = req.params;
      const { sortBy = 'votes', limit = 50 } = req.query;

      let orderBy;
      switch (sortBy) {
        case 'newest':
          orderBy = desc(competitionEntries.createdAt);
          break;
        case 'trending':
          // Simple trending algorithm based on recent vote velocity
          orderBy = desc(sql`CAST(${competitionEntries.voteCount} AS INTEGER) * 0.8 + RANDOM() * 100`);
          break;
        default: // votes
          orderBy = desc(sql`CAST(${competitionEntries.voteCount} AS INTEGER)`);
      }

      const entries = await db
        .select()
        .from(competitionEntries)
        .where(and(
          eq(competitionEntries.competitionId, competitionId),
          eq(competitionEntries.status, "approved")
        ))
        .orderBy(orderBy)
        .limit(parseInt(limit as string));

      res.json(entries);
    } catch (error) {
      console.error("Error fetching competition entries:", error);
      res.status(500).json({ message: "Failed to fetch entries" });
    }
  });

  // Submit new competition entry
  app.post("/api/competition/:competitionId/entries", async (req, res) => {
    try {
      const { competitionId } = req.params;
      const { customerName, stylistName, city, imageUrl, description } = req.body;

      if (!stylistName || !city || !imageUrl) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Check if competition exists and is active
      const [competition] = await db
        .select()
        .from(competitions)
        .where(eq(competitions.id, competitionId));

      if (!competition) {
        return res.status(404).json({ message: "Competition not found" });
      }

      if (competition.status !== "active") {
        return res.status(400).json({ message: "Competition is not active" });
      }

      // Create new entry
      const [newEntry] = await db
        .insert(competitionEntries)
        .values({
          competitionId,
          customerName,
          stylistName,
          city,
          imageUrl,
          description,
          status: "pending", // Requires moderation
          submittedBy: (req as any).user?.id || null,
        })
        .returning();

      res.status(201).json(newEntry);
    } catch (error) {
      console.error("Error creating competition entry:", error);
      res.status(500).json({ message: "Failed to create entry" });
    }
  });

  // Vote for an entry
  app.post("/api/competition/entries/:entryId/vote", async (req, res) => {
    try {
      const { entryId } = req.params;
      const userAgent = req.get('User-Agent') || '';
      const ipAddress = req.ip || req.connection.remoteAddress || '';
      
      // Create voter identifier (hash of IP + User Agent for anonymous voting)
      const voterIdentifier = crypto
        .createHash('sha256')
        .update(ipAddress + userAgent + new Date().toISOString().slice(0, 7)) // Month-based
        .digest('hex');

      // Check if entry exists
      const [entry] = await db
        .select()
        .from(competitionEntries)
        .where(eq(competitionEntries.id, entryId));

      if (!entry) {
        return res.status(404).json({ message: "Entry not found" });
      }

      if (entry.status !== "approved") {
        return res.status(400).json({ message: "Entry is not approved for voting" });
      }

      // Check if user already voted for this entry
      const [existingVote] = await db
        .select()
        .from(competitionVotes)
        .where(and(
          eq(competitionVotes.entryId, entryId),
          eq(competitionVotes.voterIdentifier, voterIdentifier)
        ));

      if (existingVote) {
        return res.status(400).json({ message: "You have already voted for this entry" });
      }

      // Create vote record
      await db.insert(competitionVotes).values({
        entryId,
        competitionId: entry.competitionId,
        voterIdentifier,
        voterType: (req as any).user ? "registered" : "anonymous",
        ipAddress,
        userAgent,
      });

      // Update vote count
      const newVoteCount = (parseInt(entry.voteCount) + 1).toString();
      await db
        .update(competitionEntries)
        .set({ 
          voteCount: newVoteCount,
          updatedAt: new Date()
        })
        .where(eq(competitionEntries.id, entryId));

      res.json({ 
        success: true, 
        voteCount: newVoteCount,
        message: "Vote recorded successfully" 
      });
    } catch (error) {
      console.error("Error recording vote:", error);
      res.status(500).json({ message: "Failed to record vote" });
    }
  });

  // Get leaderboard for competition
  app.get("/api/competition/:competitionId/leaderboard", async (req, res) => {
    try {
      const { competitionId } = req.params;
      const { limit = 10 } = req.query;

      const leaderboard = await db
        .select()
        .from(competitionEntries)
        .where(and(
          eq(competitionEntries.competitionId, competitionId),
          eq(competitionEntries.status, "approved")
        ))
        .orderBy(desc(sql`CAST(${competitionEntries.voteCount} AS INTEGER)`))
        .limit(parseInt(limit as string));

      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // Admin routes for moderation
  app.get("/api/admin/competition/entries/pending", async (req, res) => {
    try {
      // Simple admin check - in production, implement proper admin auth
      if (!(req as any).user || (req as any).user.userType !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const pendingEntries = await db
        .select()
        .from(competitionEntries)
        .where(eq(competitionEntries.status, "pending"))
        .orderBy(desc(competitionEntries.createdAt));

      res.json(pendingEntries);
    } catch (error) {
      console.error("Error fetching pending entries:", error);
      res.status(500).json({ message: "Failed to fetch pending entries" });
    }
  });

  // Moderate entry (approve/reject)
  app.patch("/api/admin/competition/entries/:entryId/moderate", async (req, res) => {
    try {
      const { entryId } = req.params;
      const { action, status } = req.body; // action: 'approve', 'reject', 'feature'

      if (!req.user || req.user.userType !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      let newStatus = status;
      if (action === 'approve') newStatus = 'approved';
      if (action === 'reject') newStatus = 'rejected';
      if (action === 'feature') newStatus = 'featured';

      const [updatedEntry] = await db
        .update(competitionEntries)
        .set({
          status: newStatus,
          moderatedBy: (req as any).user.id,
          moderatedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(competitionEntries.id, entryId))
        .returning();

      if (!updatedEntry) {
        return res.status(404).json({ message: "Entry not found" });
      }

      res.json(updatedEntry);
    } catch (error) {
      console.error("Error moderating entry:", error);
      res.status(500).json({ message: "Failed to moderate entry" });
    }
  });

  // Create new competition (admin only)
  app.post("/api/admin/competition", async (req, res) => {
    try {
      if (!(req as any).user || (req as any).user.userType !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { title, description, startDate, endDate, customerPrize, stylistPrize } = req.body;

      if (!title || !startDate || !endDate) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const [newCompetition] = await db
        .insert(competitions)
        .values({
          title,
          description,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          customerPrize: customerPrize || "$100",
          stylistPrize: stylistPrize || "$1000",
          status: "active",
        })
        .returning();

      res.status(201).json(newCompetition);
    } catch (error) {
      console.error("Error creating competition:", error);
      res.status(500).json({ message: "Failed to create competition" });
    }
  });
}