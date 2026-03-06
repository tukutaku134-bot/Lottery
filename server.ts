import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const db = new Database("lottery.db");
db.exec("PRAGMA foreign_keys = ON");
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// Multer Storage Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS lotteries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    type TEXT CHECK(type IN ('single', 'vs')) NOT NULL,
    host_image_id INTEGER,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (host_image_id) REFERENCES images(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS lottery_images (
    lottery_id INTEGER,
    image_id INTEGER,
    PRIMARY KEY (lottery_id, image_id),
    FOREIGN KEY (lottery_id) REFERENCES lotteries(id) ON DELETE CASCADE,
    FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE
  );

  -- Drop and recreate winners table to ensure constraints are correct
  DROP TABLE IF EXISTS winners; 
  
  CREATE TABLE IF NOT EXISTS winners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lottery_id INTEGER,
    image_id INTEGER,
    winner_name TEXT,
    winner_url TEXT,
    lottery_title TEXT,
    won_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lottery_id) REFERENCES lotteries(id) ON DELETE SET NULL,
    FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE SET NULL
  );

  -- Sample Data
  INSERT OR IGNORE INTO images (id, url, name) VALUES 
  (1, 'https://picsum.photos/seed/gamer1/400/400', 'Cyber Warrior'),
  (2, 'https://picsum.photos/seed/gamer2/400/400', 'Neon Phantom'),
  (3, 'https://picsum.photos/seed/gamer3/400/400', 'Glitch Master'),
  (4, 'https://picsum.photos/seed/gamer4/400/400', 'Void Walker'),
  (5, 'https://picsum.photos/seed/host1/400/400', 'Arena Master');

  INSERT OR IGNORE INTO lotteries (id, title, type, host_image_id, is_active) VALUES 
  (1, 'Cyberpunk Draw', 'single', NULL, 1),
  (2, 'Arena Boss Battle', 'vs', 5, 1);

  INSERT OR IGNORE INTO lottery_images (lottery_id, image_id) VALUES 
  (1, 1), (1, 2), (1, 3), (1, 4),
  (2, 1), (2, 2), (2, 3);
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  // Auth Middleware
  const authenticateAdmin = (req: any, res: any, next: any) => {
    const token = req.cookies.admin_token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    try {
      jwt.verify(token, JWT_SECRET);
      next();
    } catch (err) {
      res.status(401).json({ error: "Invalid token" });
    }
  };

  // Auth Routes
  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
      const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "24h" });
      res.cookie("admin_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.json({ success: true });
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    res.clearCookie("admin_token");
    res.json({ success: true });
  });

  app.get("/api/admin/check", (req, res) => {
    const token = req.cookies.admin_token;
    if (!token) return res.json({ authenticated: false });
    try {
      jwt.verify(token, JWT_SECRET);
      res.json({ authenticated: true });
    } catch (err) {
      res.json({ authenticated: false });
    }
  });

  // Image Routes
  app.get("/api/images", (req, res) => {
    const images = db.prepare("SELECT * FROM images ORDER BY created_at DESC").all();
    res.json(images);
  });

  app.post("/api/images", authenticateAdmin, (req, res) => {
    try {
      const { url, name } = req.body;
      const result = db.prepare("INSERT INTO images (url, name) VALUES (?, ?)").run(url, name);
      res.json({ id: result.lastInsertRowid });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/upload", authenticateAdmin, upload.single("image"), (req: any, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });
      const { name } = req.body;
      const url = `/uploads/${req.file.filename}`;
      const result = db.prepare("INSERT INTO images (url, name) VALUES (?, ?)").run(url, name || req.file.originalname);
      res.json({ id: result.lastInsertRowid, url });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.patch("/api/images/:id", authenticateAdmin, (req, res) => {
    try {
      const { name, url } = req.body;
      db.prepare("UPDATE images SET name = ?, url = ? WHERE id = ?").run(name, url, req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/images/:id", authenticateAdmin, (req, res) => {
    try {
      db.prepare("DELETE FROM images WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      console.error("Delete image error:", err);
      res.status(400).json({ error: "Cannot delete image. It might be in use or protected. " + err.message });
    }
  });

  // Lottery Routes
  app.get("/api/lotteries", (req, res) => {
    const lotteries = db.prepare("SELECT * FROM lotteries ORDER BY created_at DESC").all();
    const lotteriesWithImages = lotteries.map((l: any) => {
      const images = db.prepare(`
        SELECT i.* FROM images i
        JOIN lottery_images li ON i.id = li.image_id
        WHERE li.lottery_id = ?
      `).all(l.id);
      
      let hostImage = null;
      if (l.host_image_id) {
        hostImage = db.prepare("SELECT * FROM images WHERE id = ?").get(l.host_image_id);
      }
      
      return { ...l, images, hostImage };
    });
    res.json(lotteriesWithImages);
  });

  app.post("/api/lotteries", authenticateAdmin, (req, res) => {
    const { title, type, host_image_id, image_ids } = req.body;
    
    try {
      const transaction = db.transaction(() => {
        const result = db.prepare("INSERT INTO lotteries (title, type, host_image_id, is_active) VALUES (?, ?, ?, 1)").run(title, type, host_image_id);
        const lotteryId = result.lastInsertRowid;
        
        const insertLotteryImage = db.prepare("INSERT INTO lottery_images (lottery_id, image_id) VALUES (?, ?)");
        for (const imgId of image_ids) {
          insertLotteryImage.run(lotteryId, imgId);
        }
        return lotteryId;
      });

      const id = transaction();
      res.json({ id });
    } catch (err) {
      console.error("Error creating lottery:", err);
      res.status(500).json({ error: "Failed to create lottery" });
    }
  });

  app.put("/api/lotteries/:id", authenticateAdmin, (req, res) => {
    const { title, type, host_image_id, image_ids } = req.body;
    const { id } = req.params;

    try {
      const transaction = db.transaction(() => {
        db.prepare("UPDATE lotteries SET title = ?, type = ?, host_image_id = ? WHERE id = ?").run(title, type, host_image_id, id);
        
        // Update images: delete old ones and insert new ones
        db.prepare("DELETE FROM lottery_images WHERE lottery_id = ?").run(id);
        const insertLotteryImage = db.prepare("INSERT INTO lottery_images (lottery_id, image_id) VALUES (?, ?)");
        for (const imgId of image_ids) {
          insertLotteryImage.run(id, imgId);
        }
      });

      transaction();
      res.json({ success: true });
    } catch (err) {
      console.error("Error updating lottery:", err);
      res.status(500).json({ error: "Failed to update lottery" });
    }
  });

  app.patch("/api/lotteries/:id", authenticateAdmin, (req, res) => {
    try {
      const { is_active } = req.body;
      db.prepare("UPDATE lotteries SET is_active = ? WHERE id = ?").run(is_active ? 1 : 0, req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/lotteries/:id", authenticateAdmin, (req, res) => {
    try {
      db.prepare("DELETE FROM lotteries WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Winner Routes
  app.get("/api/winners", (req, res) => {
    try {
      const winners = db.prepare("SELECT * FROM winners ORDER BY won_at DESC").all();
      res.json(winners);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/winners", (req, res) => {
    try {
      const { lottery_id, image_id, winner_name, winner_url, lottery_title } = req.body;
      db.prepare(`
        INSERT INTO winners (lottery_id, image_id, winner_name, winner_url, lottery_title)
        VALUES (?, ?, ?, ?, ?)
      `).run(lottery_id, image_id, winner_name, winner_url, lottery_title);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
