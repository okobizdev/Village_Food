const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PROJECT_NAME = process.env.PROJECT_NAME || "my-app";

// POST /api/v1/cloudinary/upload
router.post("/upload", upload.single("file"), async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({ error: "No file provided" });
        }

        //  folder name
        const folder = req.query.folder || req.body.folder || "misc";

        const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
            "base64"
        )}`;

        const result = await cloudinary.uploader.upload(base64, {
            folder: `${PROJECT_NAME}/${folder}`,
        });

        res.json({
            secure_url: result.secure_url,
            public_id: result.public_id,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Upload failed" });
    }
});

// POST /api/v1/cloudinary/delete
router.post("/delete", async (req, res) => {
    try {
        const { imagePublicId } = req.body;

        if (!imagePublicId) {
            return res.status(400).json({ error: "public_id required" });
        }

        const result = await cloudinary.uploader.destroy(imagePublicId);

        res.json({
            success: true,
            result,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Delete failed" });
    }
});

module.exports = router;
