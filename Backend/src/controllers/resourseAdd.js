const express = require("express");
const { v2: cloudinary } = require("cloudinary");
const Resource = require("../models/resourse");
require("dotenv").config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload to Cloudinary as a Promise
const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "resources" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    stream.end(fileBuffer);
  });
};

const addResource = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("File:", req.file);
    
    let imageUrl = null;

    // Only process image upload for YouTube resources
    if (req.body.type === 'youtube') {
      if (!req.file) {
        return res.status(400).json({ message: "Thumbnail is required for YouTube resources" });
      }
      try {
        const result = await streamUpload(req.file.buffer);
        imageUrl = result.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({ message: "Error uploading image to Cloudinary" });
      }
    }

    // Validate resource type
    if (!['youtube', 'github', 'course'].includes(req.body.type)) {
      return res.status(400).json({ message: "Invalid resource type. Must be youtube, github, or course" });
    }

    const newResource = new Resource({
      ...req.body,
      thumbnail: imageUrl,
    });

    await newResource.save();
    res.status(201).json(newResource);
  } catch (err) {
    console.error("Error saving resource:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}



const fetchResource =  async (req, res) => {
  try {
    const filter = {};
    const { type, tag } = req.query;

    if (type) {
      // Validate type against enum values: "youtube", "github", "course"
      const validTypes = ["youtube", "github", "course"];
      if (validTypes.includes(type.toLowerCase())) {
        filter.type = type.toLowerCase();
      } else {
        return res.status(400).json({ message: "Invalid resource type in query" });
      }
    }
    if (tag) {
      // Case-insensitive exact match for tag
      filter.tag = { $regex: new RegExp(`^${tag}$`, "i") };
    }

    const resources = await Resource.find(filter).sort({ createdAt: -1 });

    res.json(resources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ message: "Failed to fetch resources", error: error.message });
  }
};


module.exports ={addResource, fetchResource};