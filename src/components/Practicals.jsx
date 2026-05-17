// 1. Node v18+ uchun CRYPTO xatosini tuzatish
const crypto = require("crypto");
if (!global.crypto) { global.crypto = crypto; }
if (!global.crypto.getRandomValues) {
  global.crypto.getRandomValues = (buffer) => crypto.randomFillSync(buffer);
}
if (!global.crypto.subtle) { global.crypto.subtle = crypto.webcrypto.subtle; }

// 2. ENV & Paketlar
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

// 4. Route importlar
const studentRoutes = require("./routes/studentRoutes");
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const lectureRoutes = require("./routes/lectureRoutes");

// 5. Model
const Lesson = require("./models/Lesson");

const app = express();

// 6. Middleware
app.use(cors());
app.use(express.json());
// "uploads" papkasini tashqi dunyoga ochish (fayllarni ko'rish uchun)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 7. MongoDB
const MONGO_URI = "mongodb+srv://jahongirjurakulov9_db_user:12345678j@cluster0.73j6adh.mongodb.net/student_system?retryWrites=true&w=majority";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Tabriklayman! MongoDB muvaffaqiyatli ulandi ✅"))
  .catch((err) => console.log("Mongo ulanishda xato ❌:", err.message));

// 8. Multer storage (Fayllarni saqlash sozlamasi)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// 9. API routes
app.use("/api/students", studentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/lectures", lectureRoutes);

// =====================================================
// 10. LESSON UPLOAD API (Modelga moslandi)
// =====================================================
app.post("/api/lessons/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Fayl tanlanmagan!" });
    }

    const lesson = new Lesson({
      title: req.body.title || req.body.topic, // Ikkala variantni ham qabul qiladi
      teacher: req.body.teacher || "Admin",
      fileUrl: req.file.filename, // Lesson.js modelida 'fileUrl'
      type: "maruza"
    });

    await lesson.save();

    res.json({
      success: true,
      message: "Ma'ruza saqlandi ✅",
      file: req.file.filename
    });
  } catch (err) {
    console.log("Yuklashda xato:", err);
    res.status(500).json({ success: false, error: "Server xatosi" });
  }
});

// Barcha darslarni olish API
app.get("/api/lessons", async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ createdAt: -1 });
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ success: false, error: "Xatolik yuz berdi" });
  }
});

// 11. SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server ${PORT}-portda ishga tushdi 🚀`);
});