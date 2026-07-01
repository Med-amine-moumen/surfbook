import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

const uploadDir = path.join(__dirname, "../../public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image! Please upload an image."));
    }
  },
});

function getPublicBackendUrl(req: express.Request) {
  const configuredUrl = process.env.BACKEND_URL?.replace(/\/$/, "");

  if (configuredUrl) {
    return configuredUrl;
  }

  return `${req.protocol}://${req.get("host")}`;
}

// Single image upload endpoint
router.post("/", verifyToken, upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload a file" });
    }

    const relativeUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({
      url: `${getPublicBackendUrl(req)}${relativeUrl}`,
      relativeUrl,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Multiple image upload endpoint
router.post("/multiple", verifyToken, upload.array("images", 5), (req, res) => {
  try {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({ error: "Please upload files" });
    }

    const files = req.files as Express.Multer.File[];
    const relativeUrls = files.map((file) => `/uploads/${file.filename}`);
    const baseUrl = getPublicBackendUrl(req);
    const imageUrls = relativeUrls.map((url) => `${baseUrl}${url}`);

    res.status(200).json({ urls: imageUrls, relativeUrls });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
