import express from "express";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";
import { getEvents, addEvent, addAttendee, removeAttendee, getSongs, addSong, addSongFile, deleteSong, deleteSongFile, getSongFile, getTasks, addTask, updateTask, deleteTask } from "./src/db.js";

dotenv.config();

// We are hardcoding the credentials as requested by the user for this specific task
const EMAIL_USER = "inheritancechoir@gmail.com";
const EMAIL_PASS = "hkgg kmih oeth eedi";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Ensure uploads directory exists
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    }
  });

  const upload = multer({ storage: storage });

  app.use(express.json());
  app.use('/uploads', express.static(uploadsDir));

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/send-email", async (req, res) => {
    const { to, subject, text, html } = req.body;

    if (!to || !subject || (!text && !html)) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const info = await transporter.sendMail({
        from: `"Inheritance Choir" <${EMAIL_USER}>`,
        to,
        subject,
        text,
        html,
      });
      res.json({ success: true, messageId: info.messageId });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  // Events API
  app.get("/api/events", (req, res) => {
    try {
      const events = getEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.post("/api/events", (req, res) => {
    try {
      const event = req.body;
      addEvent(event);
      res.json({ success: true, event });
    } catch (error) {
      console.error("Error adding event:", error);
      res.status(500).json({ error: "Failed to add event" });
    }
  });

  app.post("/api/events/:id/attendees", (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      addAttendee(id, name);
      res.json({ success: true, name });
    } catch (error) {
      console.error("Error adding attendee:", error);
      res.status(500).json({ error: "Failed to add attendee" });
    }
  });

  app.delete("/api/events/:id/attendees/:name", (req, res) => {
    try {
      const { id, name } = req.params;
      removeAttendee(id, name);
      res.json({ success: true, name });
    } catch (error) {
      console.error("Error removing attendee:", error);
      res.status(500).json({ error: "Failed to remove attendee" });
    }
  });

  // Songs API
  app.get("/api/songs", (req, res) => {
    try {
      const songs = getSongs();
      res.json(songs);
    } catch (error) {
      console.error("Error fetching songs:", error);
      res.status(500).json({ error: "Failed to fetch songs" });
    }
  });

  app.post("/api/songs", (req, res) => {
    try {
      const song = {
        id: Date.now().toString(),
        title: req.body.title,
        composer: req.body.composer || null,
        notes: req.body.notes || null,
        created_at: new Date().toISOString()
      };
      addSong(song);
      res.json({ success: true, song: { ...song, files: [] } });
    } catch (error) {
      console.error("Error adding song:", error);
      res.status(500).json({ error: "Failed to add song" });
    }
  });

  app.delete("/api/songs/:id", (req, res) => {
    try {
      const { id } = req.params;
      deleteSong(id);
      res.json({ success: true, id });
    } catch (error) {
      console.error("Error deleting song:", error);
      res.status(500).json({ error: "Failed to delete song" });
    }
  });

  app.post("/api/songs/:id/files", upload.single('file'), (req, res) => {
    try {
      const { id } = req.params;
      const { fileType } = req.body;
      
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const file = {
        id: Date.now().toString(),
        song_id: id,
        file_name: req.file.originalname,
        file_path: `/uploads/${req.file.filename}`,
        file_type: fileType || 'other',
        uploaded_at: new Date().toISOString()
      };
      
      addSongFile(file);
      res.json({ success: true, file });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  app.delete("/api/songs/files/:fileId", (req, res) => {
    try {
      const { fileId } = req.params;
      const file = getSongFile(fileId);
      
      if (file) {
        const filePath = path.join(process.cwd(), file.file_path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        deleteSongFile(fileId);
      }
      
      res.json({ success: true, id: fileId });
    } catch (error) {
      console.error("Error deleting file:", error);
      res.status(500).json({ error: "Failed to delete file" });
    }
  });

  // Tasks API
  app.get("/api/tasks", (req, res) => {
    try {
      const tasks = getTasks();
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", (req, res) => {
    try {
      const task = {
        id: Date.now().toString(),
        title: req.body.title,
        description: req.body.description || null,
        priority: req.body.priority || 'medium',
        due_date: req.body.due_date || null,
        status: req.body.status || 'pending',
        created_at: new Date().toISOString()
      };
      addTask(task);
      res.json({ success: true, task });
    } catch (error) {
      console.error("Error adding task:", error);
      res.status(500).json({ error: "Failed to add task" });
    }
  });

  app.put("/api/tasks/:id", (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updatedTask = updateTask(id, updates);
      res.json({ success: true, task: updatedTask });
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ error: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", (req, res) => {
    try {
      const { id } = req.params;
      deleteTask(id);
      res.json({ success: true, id });
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ error: "Failed to delete task" });
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
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  // Simple cron job simulation for scheduled activities
  setInterval(() => {
    console.log("Running scheduled activities...");
    try {
      // 1. Task Reminders
      const tasks = getTasks();
      const today = new Date().toISOString().split('T')[0];
      const dueTasks = tasks.filter(t => t.due_date === today && t.status === 'pending');
      
      if (dueTasks.length > 0) {
        console.log(`Found ${dueTasks.length} tasks due today. Sending reminders...`);
        // Example of sending an email reminder
        // transporter.sendMail({
        //   from: `"Inheritance Choir" <${EMAIL_USER}>`,
        //   to: "admin@example.com",
        //   subject: "Daily Task Reminder",
        //   text: `You have ${dueTasks.length} tasks due today.`
        // });
      }

      // 2. Event Reminders
      const events = getEvents();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      
      const upcomingEvents = events.filter(e => e.date === tomorrowStr);
      if (upcomingEvents.length > 0) {
        console.log(`Found ${upcomingEvents.length} events tomorrow. Sending reminders...`);
      }

    } catch (error) {
      console.error("Error in scheduled activities:", error);
    }
  }, 1000 * 60 * 60); // Run every hour

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
